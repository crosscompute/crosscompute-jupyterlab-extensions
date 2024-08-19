import json
from pathlib import Path

from jupyter_server.auth.decorator import ws_authenticated
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.utils import url_path_join
from tornado.ioloop import PeriodicCallback
from tornado.websocket import WebSocketHandler

from crosscompute_macros.iterable import (
    InfiniteDefaultDict)
from crosscompute_validation.errors import (
    CrossComputeConfigurationError)
from crosscompute_validation.functions.configuration import (
    load_raw_configuration)

from .constants import (
    NAMESPACE,
    SUFFIXES)


class UpdateWebSocket(JupyterHandler, WebSocketHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._lab_shell_path = None
        self._file_browser_folder = None
        self._periodic_callback = PeriodicCallback(
            self.send_update, 1000)
        self._information_by_path_by_folder = InfiniteDefaultDict()

    @ws_authenticated
    async def get(self, *args, **kwargs):
        await super().get(*args, **kwargs)

    def open(self):
        self._periodic_callback.start()

    def on_message(self, message):
        d = json.loads(message)
        self._lab_shell_path = Path(d['labShellPath'])
        self._file_browser_folder = Path(d['fileBrowserFolder'])

    def on_close(self):
        self._periodic_callback.stop()

    async def send_update(self):
        if self._lab_shell_path is None:
            return
        # TODO: lab shell path
        # look in folders until there is one with configuration
        # for each configuration file, load tools and/or tool name
        folder = self._file_browser_folder
        for suffix in SUFFIXES:
            for path in folder.glob('*' + suffix):
                try:
                    raw_configuration = await load_raw_configuration(path)
                except CrossComputeConfigurationError as e:
                    d = {'error': str(e)}
                else:
                    if 'crosscompute' not in raw_configuration:
                        continue
                    name = raw_configuration.get('name', '')
                    version = raw_configuration.get('version', '')
                    d = {'name': name, 'version': version}
                self.save_information(folder, path, d)
        i = self._information_by_path_by_folder
        k = str(folder)
        await self.write_message(json.dumps({
            'fileBrowserFolder': k,
            'fileBrowserFolderInformation': {
                'informationByPath': i[k],
            },
        }))

    def save_information(self, folder, path, information):
        inner_key = str(folder)
        outer_key = str(path.relative_to(folder))
        self._information_by_path_by_folder[inner_key][outer_key] = information


def setup_handlers(web_app):
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']
    updates_url = url_path_join(base_url, NAMESPACE, 'updates.json')
    handlers = [
        (updates_url, UpdateWebSocket),
    ]
    web_app.add_handlers(host_pattern, handlers)

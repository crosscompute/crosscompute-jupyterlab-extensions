import json

from jupyter_server.auth.decorator import ws_authenticated
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.utils import url_path_join
from tornado.ioloop import PeriodicCallback
from tornado.websocket import WebSocketHandler

# from crosscompute.routines.automation import DiskAutomation

from .constants import NAMESPACE


class UpdateWebSocket(JupyterHandler, WebSocketHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._path = ''
        self._periodic_callback = PeriodicCallback(self.send_update, 1000)

    @ws_authenticated
    async def get(self, *args, **kwargs):
        await super().get(*args, **kwargs)

    def open(self):
        self._periodic_callback.start()
        print('open')

    def on_message(self, message):
        self._path = message
        print('message', message)

    def on_close(self):
        self._periodic_callback.stop()
        print('close')

    def send_update(self):
        self.write_message(json.dumps({
            'path': self._path, 'PATH': self._path.upper()}))


def setup_handlers(web_app):
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']
    updates_url = url_path_join(base_url, NAMESPACE, 'updates.json')
    handlers = [
        (updates_url, UpdateWebSocket),
    ]
    web_app.add_handlers(host_pattern, handlers)

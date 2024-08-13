from jupyter_server.auth.decorator import ws_authenticated
from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.utils import url_path_join
from tornado.websocket import WebSocketHandler

from .constants import NAMESPACE


class UpdateWebSocket(JupyterHandler, WebSocketHandler):

    @ws_authenticated
    async def get(self, *args, **kwargs):
        await super().get(*args, **kwargs)

    def open(self):
        print('open')

    def on_message(self, message):
        print('message', message)

    def on_close(self):
        print('close')


def setup_handlers(web_app):
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']
    updates_url = url_path_join(base_url, NAMESPACE, 'updates.json')
    handlers = [
        (updates_url, UpdateWebSocket),
    ]
    web_app.add_handlers(host_pattern, handlers)

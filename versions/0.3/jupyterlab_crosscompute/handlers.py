import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

from .constants import NAMESPACE


class UpdateHandler(APIHandler):

    def initialize(self):
        self.set_header('content-type', 'text/event-stream')
        self.set_header('cache-control', 'no-cache')

    @tornado.web.authenticated
    async def get(self):
        x = 0
        try:
            while True:
                self.write(f'data: {x}\n\n')
                await self.flush()
                x += 1
                await tornado.gen.sleep(1)
        except tornado.iostream.StreamClosedError:
            pass


def setup_handlers(web_app):
    host_pattern = '.*$'
    base_url = web_app.settings['base_url']
    updates_url = url_path_join(base_url, NAMESPACE, 'updates.json')
    handlers = [
        (updates_url, UpdateHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)

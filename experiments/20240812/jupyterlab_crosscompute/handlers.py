import json
from tornado.iostream import StreamClosedError
from tornado.ioloop import IOLoop

from crosscompute.exceptions import (
    CrossComputeConfigurationNotFoundError, CrossComputeError)
from crosscompute.routines.automation import DiskAutomation


class RouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        path = self.get_argument('path')
        print(path)
        from pathlib import Path
        p = Path(path)
        try:
            a = DiskAutomation.load(p)
        except CrossComputeConfigurationNotFoundError as e:
            d = {'error': str(e)}
            print(e)
        except CrossComputeError as e:
            d = {'error': str(e)}
            print(e)
        else:
            c = a.configuration
            d = {'name': c.get('name', ''), 'version': c.get('version', '')}
        d['path'] = str(path)
        self.finish(json.dumps(d))


def setup_handlers(web_app):
    route_pattern = url_path_join(
        base_url, "jupyterlab-crosscompute", "get-example")
    handlers = [
        (route_pattern, RouteHandler),
    ]

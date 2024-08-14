from crosscompute.exceptions import (
    CrossComputeConfigurationNotFoundError, CrossComputeError)


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

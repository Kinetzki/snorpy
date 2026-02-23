from mitmproxy.script import concurrent
from mitmproxy.http import HTTPFlow

class HTTPInterceptor:
    def __init__(self, on_request, on_response, on_intercept, is_intercept=False):
        self.on_request = on_request
        self.on_response = on_response
        self.is_intercept = is_intercept
        self.on_intercept = on_intercept
    
    @concurrent
    def request(self, flow: HTTPFlow):
        # update content length depending on the body change
        self.on_request(flow)
        if self.is_intercept:
            flow.intercept()
            self.on_intercept(flow)
    
    @concurrent
    def response(self, flow: HTTPFlow):
        self.on_response(flow)
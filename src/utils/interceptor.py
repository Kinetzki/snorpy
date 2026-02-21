from mitmproxy.script import concurrent
from mitmproxy.http import HTTPFlow

class HTTPInterceptor:
    def __init__(self, on_request, on_response):
        self.on_request = on_request
        self.on_response = on_response
    
    @concurrent
    def request(self, flow: HTTPFlow):
        self.on_request(flow.request)
    
    @concurrent
    def response(self, flow: HTTPFlow):
        self.on_response(flow.response)
from mitmproxy.script import concurrent
from mitmproxy.http import HTTPFlow
from threading import Event
from typing import Dict

class HTTPInterceptor:
    def __init__(self, on_request, on_response):
        self.on_request = on_request
        self.on_response = on_response
        self.events: Dict[str, Event] = {}
        
    @concurrent
    def request(self, flow: HTTPFlow):
        # flow.intercept()
        
        # event = Event()
        # self.events[flow.id] = event
        # update content length depending on the body change
        self.on_request(flow)

        # event.wait()
        # del self.events[flow.id]

    @concurrent
    def response(self, flow: HTTPFlow):
        self.on_response(flow)
    
    def resume_flow(self, flow_id):
        if flow_id in self.events:
            self.events[flow_id].set()
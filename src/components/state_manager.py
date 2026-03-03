from src.utils import Dumper, HTTPInterceptor
from src.core.http_types import HTTPRequest, HTTPResponse, HTTPLog
from mitmproxy.options import Options
from mitmproxy.http import HTTPFlow
from typing import List, Any, Dict
import asyncio
import sys
import os

class StateManager:
    def __init__(self):
        self.is_listening = False
        self.main_loop: asyncio.AbstractEventLoop = asyncio.new_event_loop()
        self.proxy_listen_host = "127.0.0.1"
        self.proxy_listen_port = 8080
        
        self.http_logs: List[HTTPLog] = []
        self.req_subscribers = []
        self.res_subscribers = []
        
        options = Options(
            listen_host=self.proxy_listen_host,
            listen_port=self.proxy_listen_port
        )
        self.options = options
        self.http_interceptor = HTTPInterceptor(
            self.on_http_request,
            self.on_http_response
        )
        addons = [
            self.http_interceptor
        ]
        self.dumper: Dumper = Dumper(
            self.options,
            loop=self.main_loop,
            addons=addons
        )
        self.main_loop.set_exception_handler(self.handle_loop_exceptions)
        
    def handle_loop_exceptions(self, loop, context):
        print(f"Loop Error: {context}")
        
    def get_asset_path(self, relative_path):
        try:
            base_path = sys._MEIPASS
        except Exception:
            base_path = os.path.abspath(".")

        return os.path.join(base_path, relative_path)
    
    def toggle_proxy(self):
        if not self.is_listening:
            self.start_listener()
        else:
            self.stop_listener()
    
    def start_listener(self):
        if not self.is_listening:
            self.is_listening = True
            self.dumper.start()
            print("HTTPListener activated...")
    
    def stop_listener(self):
        if self.is_listening:
            self.is_listening = False
            self.dumper.stop()
            print("HTTPListener deactivated...")
    
    def on_http_request(self, flow: HTTPFlow):
        # print(f"Request Received: {flow.request}")
        self.send_req_event(flow)

    def on_http_response(self, flow: HTTPFlow):
        # print(f"Response Received: {flow.response}")
        self.send_res_event(flow)
    
    def on_http_intercept(self, flow: HTTPFlow):
        self.main_loop.call_soon_threadsafe(flow.resume)
    
    def update_options(self, port: int, host: str):
        new_options = Options(
            listen_host=host,
            listen_port=port
        )
        self.options = new_options
        self.dumper: Dumper = Dumper(
            self.options,
            loop=self.main_loop,
            addons=[self.http_interceptor]
        )
    
    def req_subscribe(self, callback):
        if callback:
            self.req_subscribers.append(callback)
            
    def res_subscribe(self, callback):
        if callback:
            self.res_subscribers.append(callback)
            
    def send_req_event(self, flow: HTTPFlow):
        http_req = flow.request
        request: HTTPRequest = {
            "flow_id": flow.id,
            "content": http_req.content,
            "headers": http_req.headers,
            "host": http_req.host,
            "port": http_req.port,
            "method": http_req.method,
            "scheme": http_req.scheme,
            "url": http_req.url,
            "length": len(http_req.content)
        }
        for sub in self.req_subscribers:
            try:
                sub(request)
            except:
                pass
    
    def send_res_event(self, flow: HTTPFlow):
        http_res = flow.response
        response: HTTPResponse = {
            "flow_id": flow.id,
            "content": http_res.content,
            "headers": http_res.headers,
            "length": len(http_res.content),
            "status_code": http_res.status_code
        }
        for sub in self.res_subscribers:
            try:
                sub(response)
            except:
                pass

app_state = StateManager()
    
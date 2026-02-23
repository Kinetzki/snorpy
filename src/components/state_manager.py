from src.utils import Dumper, HTTPInterceptor
from mitmproxy.options import Options
from mitmproxy.http import HTTPFlow
import asyncio
import sys
import os

class StateManager:
    def __init__(self):
        self.is_intercept = True
        self.is_listening = False
        self.main_loop: asyncio.AbstractEventLoop  = asyncio.new_event_loop()
        asyncio.set_event_loop(self.main_loop)
        
        self.http_requests = []
        self.http_responses = []
        
        options = Options(
            listen_host="127.0.0.1",
            listen_port=8080
        )
        self.http_interceptor = HTTPInterceptor(
            self.on_http_request,
            self.on_http_response,
            self.on_http_intercept,
            is_intercept=self.is_intercept
        )
        addons = [
            self.http_interceptor
        ]
        self.dumper: Dumper = Dumper(
            options,
            self.main_loop,
            addons=addons
        )
    def get_asset_path(self, relative_path):
        try:
            # PyInstaller creates a temp folder and stores path in _MEIPASS
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
            self.dumper.stop()
            print("HTTPListener deactivated...")
    
    def on_http_request(self, flow: HTTPFlow):
        print(f"Request Received: {flow.request}")

    def on_http_response(self, flow: HTTPFlow):
        print(f"Response Received: {flow.response}")
    
    def on_http_intercept(self, flow: HTTPFlow):
        self.main_loop.call_soon_threadsafe(flow.resume)
        
app_state = StateManager()
    
from src.utils import Dumper, HTTPInterceptor
from mitmproxy.options import Options

class StateManager:
    def __init__(self):
        options = Options(
            listen_host="127.0.0.1",
            listen_port=8080
        )
        addons = [
            HTTPInterceptor(
                self.on_http_request,
                self.on_http_response
            )
        ]
        self.dumper: Dumper = Dumper(
            options,
            addons=addons
        )
        self.is_listening = False
    
    def toggle_listener(self):
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
    
    def on_http_request(self, request):
        print(f"Request Received: {request}")

    def on_http_response(self, response):
        print(f"Response Received: {response}")
        
app_state = StateManager()
    
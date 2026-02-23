from customtkinter import (
    CTkFrame
)
from src.components.toggle_button import ToggleButton
from src.components.state_manager import app_state

class ProxyTab(CTkFrame):
    def __init__(self, master, width = 200, height = 200, corner_radius = None, **kwargs):
        super().__init__(master, width, height, corner_radius, fg_color="#ffffff",**kwargs)
        
        self.proxy_btn = ToggleButton(
            self,
            "Stop Proxy",
            "Start Proxy",
            active_img="square.png",
            idle_img="play.png",
            toggle_callback=app_state.toggle_proxy
        )
        self.proxy_btn.pack(side="left", anchor="nw")
        
        
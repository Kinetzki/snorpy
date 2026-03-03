from customtkinter import (
    CTkFrame,
    CTkEntry,
    CTkLabel,
    StringVar
)
from src.components.toggle_button import ToggleButton
from src.components.state_manager import app_state

class ProxyTab(CTkFrame):
    def __init__(self, master, width = 200, height = 120, corner_radius = None, **kwargs):
        super().__init__(master, width, height, corner_radius, fg_color="transparent",**kwargs)
        self.grid_columnconfigure(0, weight=1)
        self.pack_propagate(True)
        
        self.listen_host_var = StringVar(self, value=app_state.proxy_listen_host)
        self.listen_port_var = StringVar(self, value=f"{app_state.proxy_listen_port}")
        self.allow_input = True
        
        # Host Input
        self.host_frame = CTkFrame(self)
        self.host_label = CTkLabel(self.host_frame, text="Listen Host Address")
        self.host_label.pack(side="left", padx=4)
        self.host_entry = CTkEntry(self.host_frame, textvariable=self.listen_host_var)
        self.host_entry.pack(side="left")
        self.host_frame.pack(anchor="nw", pady=6)
        
        # Port input
        self.port_frame = CTkFrame(self)
        self.port_label = CTkLabel(self.port_frame, text="Listen Port")
        self.port_label.pack(side="left", padx=4)
        self.port_entry = CTkEntry(self.port_frame, textvariable=self.listen_port_var)
        self.port_entry.pack(side="left")
        self.port_frame.pack(anchor="nw", pady=(0, 6))
        
        self.proxy_btn = ToggleButton(
            self,
            "Stop Proxy",
            "Start Proxy",
            active_img="square.png",
            idle_img="play.png",
            toggle_callback=self.on_toggle_proxy
        )
        self.proxy_btn.pack(anchor="nw", pady=(0, 6))
        
        # start/stop proxy
        # view/edit proxy listen-port and listen-host
    
    def toggle_all_input(self):
        if self.allow_input:
            self.allow_input = False
            self.host_entry.configure(state="disabled")
            self.port_entry.configure(state="disabled")
        else:
            self.allow_input = True
            self.host_entry.configure(state="normal")
            self.port_entry.configure(state="normal")
        
    def on_toggle_proxy(self):
        app_state.toggle_proxy()
        self.after(0, self.toggle_all_input)
        
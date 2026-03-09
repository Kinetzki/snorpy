import psutil
from customtkinter import (
    CTkLabel,
    CTkFrame,
    CTkScrollableFrame
)
from src.core.net_types import NetInterface
from typing import List
import socket

class NetworkTab(CTkFrame):
    def __init__(self, master, width = 200, height = 120, corner_radius = None, **kwargs):
        super().__init__(master, width, height, corner_radius, **kwargs)
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.grid_propagate(False)
        
        self.interfaces: List[NetInterface] = []
        
        self.interfaces_scroll = CTkScrollableFrame(self, width=200, height=120)
        self.interfaces_scroll.grid(column=0, row=0, sticky="nsew")
        
        self._get_interfaces()
    
    def _get_interfaces(self):
        if_list = psutil.net_if_addrs()
        
        for net, addrs in if_list.items():
            for addr in addrs:
                if addr.family == socket.AF_INET:
                    new_int:NetInterface = {
                        "ipv4": addr.address,
                        "name": net,
                        "sub_mask": addr.netmask
                    }

                    self.interfaces.append(new_int)
        
        self.after(1, lambda: self.load_interfaces())
    
    def load_interfaces(self):
        for inet in self.interfaces:
            inet_label = CTkLabel(
                self.interfaces_scroll, 
                text=f"{inet["name"]}: {inet["ipv4"]} {inet["sub_mask"]}"
            )
            inet_label.pack(pady=(3, 0), anchor="w")
    
    
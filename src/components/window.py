from customtkinter import (
    CTk,
    CTkFrame
)
from .state_manager import app_state
from .sidebar import Sidebar
from .tab_view import TabView
from .general_tabs.proxy_tab import ProxyTab
from .tool_tabs.interceptor_tab import InterceptorTab

class MainWindow(CTk):
    def __init__(
        self,
        title: str,
        window_size: str,
        fg_color="#ffffff",
        **kwargs
    ):
        super().__init__(fg_color, **kwargs)
        
        self.geometry(window_size)
        self.title(title)
        
        self.grid_columnconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=0)
        self.grid_rowconfigure(0, weight=1)
        
        self.sidebar = Sidebar(self, width=200)
        
        self.main_panel = CTkFrame(self, corner_radius=0, fg_color="#161616")
        self.main_panel.grid(row=0, column=1, sticky="nsew")
        self.main_panel.grid_rowconfigure(0, weight=0)
        self.main_panel.grid_rowconfigure(1, weight=1)
        self.main_panel.grid_columnconfigure(0, weight=1)
        
        self.general_tabs = TabView(
            self.main_panel,
            tabs=["Proxy", "Network", "Device"],
            height=140
        )
        self.general_tabs.grid(row=0, column=0, padx=8, pady=0, sticky="nsew")
        # Proxy Tab
        self.proxy_tab_frame = self.general_tabs.tab("Proxy")
        
        # Network tab
        self.network_tab_frame = self.general_tabs.tab("Network")
        
        # Device tab
        self.device_tab_frame = self.general_tabs.tab("Device")
        
        # add general tabs
        self.proxy_tab = ProxyTab(self.proxy_tab_frame)
        self.proxy_tab.grid(column=0, row=0, sticky="nsew")
        
        
        
        self.tool_tabs = TabView(
            self.main_panel,
            tabs=["Interceptor", "Repeater", "Fuzzer", "Decoder/Encoder"]
        )
        self.interceptor_tab_frame = self.tool_tabs.tab("Interceptor")
        
        self.interceptor_tab = InterceptorTab(self.interceptor_tab_frame)
        self.interceptor_tab.grid(column=0, row=0, sticky="nsew")
        
        self.interceptor_tab.grid_propagate(False)
        
        self.tool_tabs.grid(column=0, row=1, sticky="nsew", padx=8, pady=8)
    
        
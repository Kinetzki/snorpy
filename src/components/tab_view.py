from customtkinter import (
    CTkTabview
)

class TabView(CTkTabview):
    def __init__(self, master, tabs=[], height = 250, corner_radius = None, width=300, **kwargs):
        super().__init__(master, width, height, corner_radius, anchor="w", **kwargs)

        self.tabs = tabs
        self.load_tabs()
        
    def load_tabs(self):
        for tab in self.tabs:
            tab_frame = self.add(tab)
            tab_frame.grid_columnconfigure(0, weight=1)
            tab_frame.grid_rowconfigure(0, weight=1)
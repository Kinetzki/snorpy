from customtkinter import (
    CTk,
    CTkFrame
)

class Sidebar(CTkFrame):
    def __init__(self, master, width=200, **kwargs):
        super().__init__(master, width, corner_radius=0, fg_color="#0e111a",**kwargs)

        # self.open()
    
    def open(self):
        self.grid(row=0, column=0, sticky="nsew")
        self.grid_propagate(False)
    
    def close(self):
        self.grid_forget()
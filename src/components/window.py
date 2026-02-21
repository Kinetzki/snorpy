import customtkinter as ctk
from .icon_button import StateButton
from .state_manager import app_state

class MainWindow(ctk.CTk):
    def __init__(
        self,
        title: str,
        window_size: str,
        fg_color = None,
        **kwargs
    ):
        super().__init__(fg_color, **kwargs)
        
        self.geometry(window_size)
        self.title(title)
        
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)
        
        self.button = StateButton(self, "Click", app_state.toggle_listener)
        self.button.pack(side="left", padx=4)
    
    
        
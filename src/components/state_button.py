from PIL import Image
from customtkinter import (
    CTkImage,
    CTkButton
)

class StateButton(CTkButton):
    def __init__(self, master, text: str, on_click_event, width = 140, height = 28, corner_radius = None,**kwargs):
        
        super().__init__(master, width, height, corner_radius, command=self.on_click, text=text, **kwargs)

        self.callback = on_click_event
        
    def on_click(self):
        self.callback()
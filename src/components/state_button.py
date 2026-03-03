from PIL import Image
from customtkinter import (
    CTkImage,
    CTkButton
)

class ClickButton(CTkButton):
    def __init__(self, master, text: str, on_click_event, width = 140, height = 28, corner_radius = None,**kwargs):
        
        super().__init__(master, width, height, corner_radius, command=on_click_event, text=text, **kwargs)

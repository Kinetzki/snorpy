from PIL import Image
from customtkinter import (
    CTkImage,
    CTkButton
)
from .state_manager import app_state

class ToggleButton(CTkButton):
    def __init__(self, master, active_text: str, idle_text: str, active_img: str = None, idle_img: str = None, toggle_callback=None, is_active=False, width = 140, height = 28, corner_radius = None, icon_size=(20, 20), **kwargs):
        
        self.idle_text = idle_text
        self.active_text = active_text
        self.active_img = None
        self.idle_img = None
        
        if active_img:
            self.active_img = Image.open(app_state.get_asset_path(f"assets/{active_img}"))
        if idle_img:
            self.idle_img = Image.open(app_state.get_asset_path(f"assets/{idle_img}"))
        
        self.is_active = is_active
        self.icon_size = icon_size
        self.toggle_callback = toggle_callback
        
        default_icon = None
        
        if self.active_img and self.idle_img:
                default_icon = CTkImage(
                    light_image=self.idle_img,
                    dark_image=self.idle_img,
                    size=self.icon_size
                )

        super().__init__(master, width, height, corner_radius, text=idle_text, command=self.toggle, image=default_icon, **kwargs)
        
        # self.toggle()
    
    def toggle(self):
        self.swap()
        
        if self.toggle_callback:
            self.toggle_callback()
    
    def swap(self):
        if not self.is_active:
            icon = None
            new_config = {
                "image": icon,
                "text": self.active_text
            }
            if self.active_img and self.idle_img:
                icon = CTkImage(
                    light_image=self.active_img,
                    dark_image=self.active_img,
                    size=self.icon_size
                )
                new_config["image"] = icon
            self.after(100, self.configure(**new_config))
            self.is_active = True
        else:
            icon = None
            new_config = {
                "image": icon,
                "text": self.idle_text
            }
            if self.active_img and self.idle_img:
                icon = CTkImage(
                    light_image=self.idle_img,
                    dark_image=self.idle_img,
                    size=self.icon_size
                )
                
                new_config["image"] = icon
            self.after(100, self.configure(**new_config))
            self.is_active = False
    
    def set_state(self, **kwargs):
        self.after(0, lambda: self.configure(**kwargs))
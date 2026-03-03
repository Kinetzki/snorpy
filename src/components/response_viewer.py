from customtkinter import (
    CTkFrame,
    CTkEntry,
    CTkTextbox,
    CTkOptionMenu,
    StringVar
)
from mitmproxy.http import HTTPFlow
from .tab_view import TabView
from src.core.http_types import HTTPLog
from src.components.state_button import ClickButton
import json

class ResponseViewer(CTkFrame):
    def __init__(self, master, http_log: HTTPLog = None, width = 200, height = 200, corner_radius = None, **kwargs):
        self.req_res_tabs = None
        # Request viewer
        self.req_tab = None
        self.req_tabs = None
        self.req_raw_tab = None
        self.req_raw_content_tab = None
        self.req_raw_headers_tab = None
        self.req_raw_entry: CTkTextbox = None
        self.req_raw_content_entry: CTkTextbox = None
        self.req_raw_headers_entry: CTkTextbox = None
        
        # Response viewer
        self.res_tab = None
        self.res_tabs = None
        self.res_raw_tab = None
        self.res_raw_content_tab = None
        self.res_raw_headers_tab = None
        self.res_raw_entry: CTkTextbox = None
        self.res_raw_content_entry: CTkTextbox = None
        self.res_raw_headers_entry: CTkTextbox = None
        
        super().__init__(master, width, height, corner_radius, **kwargs)
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=0)
        self.grid_rowconfigure(0, weight=1)
        
        self.http_log = http_log
        # viewable fields
        self.encoding_type = StringVar(self, value="latin-1")
        
        # request tab and conditional response tab
        self.render_req_res_tab()

        # buttons frame
        self.button_utils = CTkFrame(self, width=140)
        self.button_utils.grid(column=1, row=0, sticky="nsew")
        self.button_utils.pack_propagate(False)
        # buttons
        self.encoding_dropdown = CTkOptionMenu(self.button_utils, variable=self.encoding_type, values=("latin-1", "utf-8"), command=lambda _: self.view_http_log())
        self.encoding_dropdown.pack(fill="x", anchor="n", pady=(10, 0))
        
        self.send_to_repeater_btn = ClickButton(self.button_utils, text="Send To Repeater", on_click_event=self.on_send_to_repeater)
        self.send_to_repeater_btn.pack(fill="x", anchor="n", pady=(4, 0))
        
    def set_log(self, log: HTTPLog | None, allow_edit: bool = False):
        self.http_log = log
        self.after(0, self.render_req_res_tab)
        if allow_edit:
            self.after(0, self._enable_fields)
        else:
            self.after(0, self._disable_fields)
    
    def reset_tabs(self):
        self.req_res_tabs = None
                
        self.req_tab = None
        self.req_tabs = None
        self.req_raw_tab = None
        self.req_raw_content_tab = None
        self.req_raw_headers_tab = None
        self.req_raw_entry = None
        self.req_raw_content_entry = None
        self.req_raw_headers_entry = None
        
        self.res_tab = None
        self.res_tabs = None
        self.res_raw_tab = None
        self.res_raw_content_tab = None
        self.res_raw_headers_tab = None
        self.res_raw_entry = None
        self.res_raw_content_entry = None
        self.res_raw_headers_entry = None
    
    def render_req_res_tab(self):
        tabs = []
        if self.http_log:
            print("Viewing LOG")
            tabs.append("Request")
            if self.http_log["response"]:
                tabs.append("Response")
            if not self.req_res_tabs:
                self.req_res_tabs = TabView(self, tabs=tabs)
                self.req_res_tabs.grid(row=0, column=0, sticky="nsew")
                
                self.req_tab = self.req_res_tabs.tab("Request")
                
                self.req_tabs = TabView(self.req_tab, tabs=["Raw", "Content", "Headers"], width=480)
                self.req_tabs.grid(row=0, column=0, padx=4, pady=4, sticky="nsew")
                
                # raw tab
                self.req_raw_tab = self.req_tabs.tab("Raw")
                self.req_raw_tab.grid_columnconfigure(0, weight=1)
                self.req_raw_tab.grid_rowconfigure(0, weight=1)
                
                # content tab
                self.req_raw_content_tab = self.req_tabs.tab("Content")
                self.req_raw_content_tab.grid_columnconfigure(0, weight=1)
                self.req_raw_content_tab.grid_rowconfigure(0, weight=1)
                
                # headers tab
                self.req_raw_headers_tab = self.req_tabs.tab("Headers")
                self.req_raw_headers_tab.grid_columnconfigure(0, weight=1)
                self.req_raw_headers_tab.grid_rowconfigure(0, weight=1)
                
                if "Response" in tabs:
                    self.load_res_tab()
                
            elif "Response" not in self.req_res_tabs._tab_dict and "Response" in tabs:
                self.req_res_tabs.add("Response")
                self.load_res_tab()

            elif self.res_tab:
                if "Response" not in tabs and "Response" in self.req_res_tabs._tab_dict:
                    self.req_res_tabs.delete("Response")
                    
            self.view_http_log()
        else:
            print("Forgetting HTTPLOG view")
            if self.req_res_tabs:
                self.req_res_tabs.destroy()
                self.reset_tabs()
        
    def load_res_tab(self):
        if self.http_log and self.http_log["response"] and self.req_res_tabs:
            self.res_tab = self.req_res_tabs.tab("Response")
            self.res_tab.grid_columnconfigure(0, weight=1)
            self.res_tab.grid_rowconfigure(0, weight=1)
                
            self.res_tabs = TabView(self.res_tab, tabs=["Raw", "Content", "Headers"], width=480)
            self.res_tabs.grid(row=0, column=0, padx=4, pady=4, sticky="nsew")
            
            # raw response
            self.res_raw_tab = self.res_tabs.tab("Raw")
            self.res_raw_tab.grid_columnconfigure(0, weight=1)
            self.res_raw_tab.grid_rowconfigure(0, weight=1)
            
            # raw content
            # content tab
            self.res_raw_content_tab = self.res_tabs.tab("Content")
            self.res_raw_content_tab.grid_columnconfigure(0, weight=1)
            self.res_raw_content_tab.grid_rowconfigure(0, weight=1)

            # headers
            self.res_raw_headers_tab = self.res_tabs.tab("Headers")
            self.res_raw_headers_tab.grid_columnconfigure(0, weight=1)
            self.res_raw_headers_tab.grid_rowconfigure(0, weight=1)
            
    def view_http_log(self):
        self._view_raw_http()
        self._view_raw_content()
        self._view_http_headers()
        # add destroying components here
    
    def _insert_content(self, data: str, target: CTkTextbox):
        max_chunk = 10000
        target.delete("1.0", "end")
        
        for i in range(0, len(data), max_chunk):
            target.insert("end", data[i:i+max_chunk])
            
            if i % (max_chunk * 5) == 0:
                self.update_idletasks()
                
    def _view_raw_http(self):
        if self.http_log and self.req_res_tabs:
            # fields in raw
            # show the raw data of the whole HTTP String
            encoding = self.encoding_type.get()
            raw_req_string = self.http_log["request"]["raw_http_string"].decode(encoding)
            
            # Render Request Raw
            self.req_raw_entry = CTkTextbox(self.req_raw_tab)
            # self.req_raw_entry.insert("1.0", raw_req_string)
            self._insert_content(raw_req_string, self.req_raw_entry)
            self.req_raw_entry._textbox.configure(spacing1=2, spacing3=2)
            self.req_raw_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
            
            if self.http_log.get("response", None):
                raw_res_string = self.http_log["response"]["raw_http_string"].decode(encoding)
            
                # Render Request Raw
                self.res_raw_entry = CTkTextbox(self.res_raw_tab)
                # self.res_raw_entry.insert("1.0", raw_res_string)
                self._insert_content(raw_res_string, self.res_raw_entry)
                self.res_raw_entry._textbox.configure(spacing1=2, spacing3=2)
                self.res_raw_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
    
    
        
    def _view_raw_content(self):
        if self.http_log and self.req_res_tabs:
            encoding = self.encoding_type.get()
            
            raw_content = self.http_log["request"]["content"].decode(encoding)
            
            # Render Request Raw Content
            self.req_raw_content_entry = CTkTextbox(self.req_raw_content_tab)
            self._insert_content(raw_content, self.req_raw_content_entry)
            self.req_raw_content_entry._textbox.configure(spacing1=2, spacing3=2)
            self.req_raw_content_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
            
            if self.http_log.get("response", None):
                raw_res_content_string = self.http_log["response"]["content"].decode(encoding)
            
                # Render Request Raw
                self.res_raw_content_entry = CTkTextbox(self.res_raw_content_tab)
                self._insert_content(raw_res_content_string, self.res_raw_content_entry)
                self.res_raw_content_entry._textbox.configure(spacing1=2, spacing3=2)
                self.res_raw_content_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
            
    def _view_http_headers(self):
        if self.http_log and self.req_res_tabs:
            req_headers = self.http_log["request"]["headers"]
            encoding = self.encoding_type.get()
            
            headers_str = ""
            for header_k, val in req_headers.fields:
                header_entry = f"{header_k.decode(encoding)}: {val.decode(encoding)}\n"
                headers_str += header_entry
                
            
            self.req_raw_headers_entry = CTkTextbox(self.req_raw_headers_tab)
            self.req_raw_headers_entry.insert("1.0", headers_str)
            self.req_raw_headers_entry._textbox.configure(spacing1=2, spacing3=2)
            self.req_raw_headers_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
            
            if self.http_log.get("response", None):
                res_headers = self.http_log["response"]["headers"]
                
                res_headers_str = ""
                for header_k, val in res_headers.fields:
                    res_header_entry = f"{header_k.decode(encoding)}: {val.decode(encoding)}\n"
                    res_headers_str += res_header_entry
                
                
                self.res_raw_headers_entry = CTkTextbox(self.res_raw_headers_tab)
                self.res_raw_headers_entry.insert("1.0", res_headers_str)
                self.res_raw_headers_entry._textbox.configure(spacing1=2, spacing3=2)
                self.res_raw_headers_entry.grid(column=0, row=0, sticky="nsew", ipadx=20)
                
    def _disable_fields(self):
        if self.req_raw_entry:
            self.req_raw_entry.configure(state="disabled")
        if self.req_raw_content_entry:
            self.req_raw_content_entry.configure(state="disabled")
        if self.req_raw_headers_entry:
            self.req_raw_headers_entry.configure(state="disabled")
        
        if self.res_raw_entry:
            self.res_raw_entry.configure(state="disabled")
        if self.res_raw_content_entry:
            self.res_raw_content_entry.configure(state="disabled")
        if self.res_raw_headers_entry:
            self.res_raw_headers_entry.configure(state="disabled")
    
    def _enable_fields(self):
        if self.req_raw_entry:
            self.req_raw_entry.configure(state="normal")
        if self.req_raw_content_entry:
            self.req_raw_content_entry.configure(state="normal")
        if self.req_raw_headers_entry:
            self.req_raw_headers_entry.configure(state="normal")
        
        if self.res_raw_entry:
            self.res_raw_entry.configure(state="normal")
        if self.res_raw_content_entry:
            self.res_raw_content_entry.configure(state="normal")
        if self.res_raw_headers_entry:
            self.res_raw_headers_entry.configure(state="normal")
    
    def on_send_to_repeater(self):
        print("Sent to repeater")
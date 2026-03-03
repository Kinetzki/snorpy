from customtkinter import (
    CTkFrame
)
from tkinter import ttk
from src.core.http_types import HTTPRequest, HTTPResponse
from src.core.arg_types import TableRow
from src.components.tab_view import TabView
from src.components.state_manager import app_state
from src.components.toggle_button import ToggleButton
from src.components.tree_table import TreeTable
from typing import List, Dict, Any

pending_table_cols = [
    {
        "column_name": "method",
        "width": 90,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "host",
        "width": 200,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "status",
        "width": 80,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "url",
        "width": 200,
        "anchor": "w",
        "stretch": True
    }
]

history_table_cols = [
    {
        "column_name": "method",
        "width": 90,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "host",
        "width": 200,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "status",
        "width": 80,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "response length",
        "width": 100,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "url",
        "width": 200,
        "anchor": "w",
        "stretch": True
    }
]

class InterceptorTab(CTkFrame):
    def __init__(self, master, width = 200, height = 200, corner_radius = None, **kwargs):
        super().__init__(master, width, height, corner_radius, **kwargs)
        
        self.is_intercept = False
        self.http_responses: Dict[str, HTTPResponse] = {}
        self.pending_requests: Dict[str, HTTPRequest] = {}
        
        # Intercepted Requests table
        # Target domains
        # Selected Request/Response Util Buttons
        # Tabs for Pending, Logs
        
        self.grid_rowconfigure(0, weight=0)
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)
        
        # Interceptor controls
        self.controls_frame = CTkFrame(self)
        self.controls_frame.grid(column=0, row=0, padx=4, ipady=8, sticky="nsew")
        
        self.intercept_toggle_btn = ToggleButton(
            self.controls_frame,
            "Intercept is On",
            "Intercept is Off",
            toggle_callback=self.toggle_intercept
        )
        self.intercept_toggle_btn.pack(side="left", padx=8)
        
        # tabs for Pending, History
        self.log_tabs = TabView(self, tabs=["Pending", "History"])
        self.log_tabs.grid(row=1, column=0, sticky="nsew")
        
        self.pending_tab_frame = self.log_tabs.tab("Pending")
        self.history_tab_frame = self.log_tabs.tab("History")
        
        # pending table
        self.pending_table = TreeTable(self.pending_tab_frame, columns=pending_table_cols, show="headings")
        self.pending_table.grid(row=0, column=0, pady=0, sticky="nsew")

        # history table
        self.history_table = TreeTable(self.history_tab_frame, columns=history_table_cols, show="headings")
        self.history_table.grid(row=0, column=0, pady=0, sticky="nsew")
        
        app_state.req_subscribe(self.on_http_request)
        app_state.res_subscribe(self.on_http_response)
        
    def reload(self):
        pass
    
    def toggle_intercept(self):
        self.is_intercept = not self.is_intercept
    
    def insert_pending_http_row(self, row: TableRow):
        # sample_rows: List[TableRow] = [
        #     {
        #         "id": "item1",
        #         "pos": 0,
        #         "values": ["200", "POST", "http://sample.url1.com"]
        #     },
        #     {
        #         "id": "item2",
        #         "pos": 0,
        #         "values": ["200", "POST", "http://sample.url1.com"]
        #     },
        #     {
        #         "id": "item3",
        #         "pos": 0,
        #         "values": ["200", "POST", "http://sample.url1.com"]
        #     }
        # ]
        # for row in sample_rows:
        #     self.req_tree.insert_item(row)
        self.pending_table.insert_item(row)
    
    def insert_history_row(self, row: TableRow):
        self.history_table.insert_item(row)

    def on_http_request(self, http_request: HTTPRequest):
        print(f"Request received: {http_request["flow_id"]}")
        if self.is_intercept: 
            new_row: TableRow = {
                "id": http_request["flow_id"],
                "pos": 0,
                "values": [
                    http_request["method"],
                    http_request["host"],
                    "Pending",
                    http_request["url"]
                ]
            }
            self.insert_pending_http_row(new_row)
        else:
            flow_id = http_request["flow_id"]
            flow_response = self.http_responses.get(flow_id, None)
            
            if not flow_response:
                print(f"Pending Request: {flow_id}")
                self.pending_requests[flow_id] = http_request
                
            status_code = flow_response["status_code"] if flow_response else "Pending"
            response_length = flow_response["length"] if flow_response else 0
            
            new_row: TableRow = {
                "id": flow_id,
                "pos": 0,
                "values": [
                    http_request["method"],
                    http_request["host"],
                    status_code,
                    response_length,
                    http_request["url"]
                ]
            }
            
            self.insert_history_row(new_row)
    
    def on_http_response(self, http_response: HTTPResponse):
        flow_id = http_response["flow_id"]
        print(f"Response received: {flow_id}")
        # Set Response just in case
        self.http_responses[flow_id] = http_response
        
        http_request = self.pending_requests.get(flow_id, None)
        
        if not http_request:
            print(f"Missing Request: {flow_id}")
            return
        
        # update the item in the history
        new_row: TableRow = {
            "id": flow_id,
            "pos": 0,
            "values": [
                http_request["method"],
                http_request["host"],
                http_response["status_code"],
                http_response["length"],
                http_request["url"]
            ]
        }
        self.pending_requests.pop(flow_id, None)
        self.insert_history_row(new_row)
        
        
        
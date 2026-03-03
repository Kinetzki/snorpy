from customtkinter import (
    CTkFrame
)
from tkinter import ttk
from src.core.http_types import HTTPRequest, HTTPResponse, HTTPLog
from src.core.arg_types import TableRow
from src.components.tab_view import TabView
from src.components.state_manager import app_state
from src.components.toggle_button import ToggleButton
from src.components.state_button import ClickButton
from src.components.tree_table import TreeTable
from typing import List, Dict, Any
from mitmproxy.http import HTTPFlow
from src.components.response_viewer import ResponseViewer
from src.core.table_columns import (
    pending_table_cols,
    history_table_cols
)

class InterceptorTab(CTkFrame):
    def __init__(self, master, width = 200, height = 200, corner_radius = None, **kwargs):
        super().__init__(master, width, height, corner_radius, **kwargs)
        
        self.is_intercept = False
        self.http_responses: Dict[str, HTTPResponse] = {}
        self.http_requests: Dict[str, HTTPRequest] = {}
        self.intercepted_flows: Dict[str, HTTPFlow] = {}
        self.selected_log: HTTPLog = None
        
        # Intercepted Requests table
        # Target domains
        # Selected Request/Response Util Buttons
        # Tabs for Pending, Logs
        
        self.grid_rowconfigure(0, weight=0)
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=0)
        
        # Interceptor controls
        self.controls_frame = CTkFrame(self)
        self.controls_frame.grid(column=0, row=0, columnspan=2, padx=4, ipady=8, sticky="nsew")
        
        self.intercept_toggle_btn = ToggleButton(
            self.controls_frame,
            "Intercept is On",
            "Intercept is Off",
            toggle_callback=self.toggle_intercept
        )
        self.intercept_toggle_btn.pack(side="left", padx=8)
        
        # release selected pending
        # self.release_intercepted_btn = ToggleButton(
        #     self.controls_frame,
        #     "Release Intercepted Flow",
        #     "Release Intercepted Flow",
        #     toggle_callback=self.release_intercepted_flow,
        #     state="disabled"
        # )
        
        
        # clear history logs
        self.clear_logs_btn = ClickButton(
            self.controls_frame, 
            text="Clear Logs", 
            on_click_event=self.clear_logs
        )
        self.clear_logs_btn.pack(side="left", padx=8)
        
        self.release_intercepted_btn = ClickButton(
            self.controls_frame, 
            text="Release Flow", 
            on_click_event=self.release_intercepted_flow,
            state="disabled"
        )
        self.release_intercepted_btn.pack(side="left", padx=8)
        
        # tabs for Pending, History
        self.log_tabs = TabView(self, tabs=["Pending", "History"])
        self.log_tabs.grid(row=1, column=0, sticky="nsew")
        
        self.pending_tab_frame = self.log_tabs.tab("Pending")
        self.history_tab_frame = self.log_tabs.tab("History")

        # pending table
        self.pending_table = TreeTable(self.pending_tab_frame, columns=pending_table_cols, on_row_select=self.view_held_request, show="headings")
        self.pending_table.grid(row=0, column=0, pady=0, sticky="nsew")

        # history table9
        self.history_table = TreeTable(self.history_tab_frame, columns=history_table_cols, show="headings", on_row_select=self.view_http_log)
        self.history_table.grid(row=0, column=0, pady=0, sticky="nsew")
        
        app_state.req_subscribe(self.on_http_request)
        app_state.res_subscribe(self.on_http_response)
        
        # Request Viewer tabs
        self.req_viewer = ResponseViewer(self, width=400)
    
    def toggle_intercept(self):
        self.is_intercept = not self.is_intercept
        if not self.is_intercept:
            self.release_all_intercepted()
    
    def insert_intercepted_http_row(self, row: TableRow):
        self.pending_table.insert_item(row)
    
    def insert_history_row(self, row: TableRow):
        self.history_table.insert_item(row)

    def on_http_request(self, http_request: HTTPRequest, flow: HTTPFlow):
        
        flow_id = http_request["flow_id"]
        self.http_requests[flow_id] = http_request
        
        if self.is_intercept: 
            print(f"Request Intercepted: {flow_id}")
            flow.intercept()
            self.intercepted_flows[flow_id] = flow
            
            
            new_row: TableRow = {
                "id": flow_id,
                "pos": 0,
                "values": [
                    http_request["method"],
                    http_request["host"],
                    "Pending",
                    http_request["url"]
                ]
            }
            
            self.insert_intercepted_http_row(new_row)
        else:
            print(f"Request Sent: {flow_id}")
            flow_id = http_request["flow_id"]
            flow_response = self.http_responses.get(flow_id, None)
            
            if not flow_response:
                print(f"Pending Request: {flow_id}")
                
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
        
        http_request = self.http_requests.get(flow_id, None)
        
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
        # self.http_requests.pop(flow_id, None)
        
        self.insert_history_row(new_row)
    
    def clear_logs(self):
        print(f"Cleared Logs")
        all_reqs = list(self.http_requests.keys())
        all_res = set(self.http_responses.keys())
        
        if self.selected_log and self.selected_log["flow_id"] in all_res:
            self.set_selected_log(None)
            
        for req_id in all_reqs:
            if req_id in all_res:
                self.history_table.remove_item_row(req_id)
                self.http_requests.pop(req_id)
                self.http_responses.pop(req_id)

        

    def _create_log(self, flow_id: str) -> HTTPLog:
        req = self.http_requests.get(flow_id, None)
        res = self.http_responses.get(flow_id, None)
        
        log: HTTPLog = {
            "flow_id": req["flow_id"],
            "request":  req,
            "response": res
        }
        
        return log
        
        
    def view_held_request(self, req_id: str):
        print(f"Selected Request: {req_id}")

        log = self._create_log(req_id)
        self.set_selected_log(log, allow_edit=True)
        
    def view_http_log(self, req_id: str):
        print(f"Selected Request: {req_id}")

        log = self._create_log(req_id)
        self.set_selected_log(log, allow_edit=False)
        
    def release_intercepted_flow(self):
        if self.selected_log:
            flow = self.intercepted_flows.get(self.selected_log["flow_id"], None)
            if flow:
                flow.resume()
                self.pending_table.remove_item_row(flow.id)
                self.intercepted_flows.pop(flow.id, None)
                self.set_selected_log(None)
    
    def release_all_intercepted(self):
        all_keys = list(self.intercepted_flows.keys())
        
        for flow_id in all_keys:
            flow = self.intercepted_flows.pop(flow_id, None)
            
            if flow:
                self.pending_table.remove_item_row(flow_id)
                flow.resume()
                print(f"Resumed Flow: {flow_id}")
        
        self.set_selected_log(None)
    
    def set_selected_log(self, log: HTTPLog | None, allow_edit: bool = False):
        if not log:
            self.release_intercepted_btn.configure(state="disabled")
            self.req_viewer.set_log(None, allow_edit=allow_edit)
            self.req_viewer.grid_forget()
        else:
            if self.intercepted_flows.get(log["flow_id"]):
                self.release_intercepted_btn.configure(state="enabled")
            else:
                self.release_intercepted_btn.configure(state="disabled")
            self.req_viewer.set_log(log, allow_edit=allow_edit)
            self.req_viewer.grid(row=1, column=1, padx=(8, 0), pady=4, sticky="nsew")

        self.selected_log = log
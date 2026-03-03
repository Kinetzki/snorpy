from tkinter import ttk
from src.core.arg_types import TableColumn, TableRow
from typing import List, Callable
from customtkinter import (
    CTkScrollbar,
    CTkFrame
)

class TreeTable(CTkFrame):
    def __init__(self, master = None, width = 200, height = 200, corner_radius = None, columns: List[TableColumn] = [], on_row_select = None, show="headings", **kwargs):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(
            "Treeview",
            background="#1a1a1a",
            foreground="white",
            fieldbackground="#1a1a1a", 
            borderwidth=0
        )
        
        super().__init__(master, width, height, corner_radius, **kwargs)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=0)
        self.grid_rowconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=0)
        
        self.select_callback: Callable = on_row_select
        self.table = ttk.Treeview(
            self,
            columns=list(map(lambda x: x["column_name"], columns)),
            show=show
        )
        self.table.grid(row=0, column=0, pady=0, sticky="nsew")
        
        self.y_scroll = CTkScrollbar(
            self, 
            orientation="vertical", 
            command=self.table.yview
        ) 
        self.x_scroll = CTkScrollbar(
            self, 
            orientation="horizontal", 
            command=self.table.xview
        )
        
        
        self.table.configure(xscrollcommand=self.x_scroll.set)
        self.table.configure(yscrollcommand=self.y_scroll.set)
        
        self.y_scroll.grid(column=1, row=0, sticky="nsew")
        self.x_scroll.grid(column=0, row=1, sticky="nsew")
        
        self.table.bind("<<TreeviewSelect>>", self.on_row_select)
        self.table.bind("<Double-1>", self.on_double_click_row) #for double click
        
        for col in columns:
            col_name = col["column_name"]
            col_width = col["width"]
            col_anchor = col["anchor"]
            col_stretch = col["stretch"]
            col_minwidth = col["min_width"]
            
            self.table.heading(col_name, text=col_name.title(), anchor=col_anchor)
            self.table.column(col_name, width=col_width, minwidth=col_minwidth, anchor=col_anchor, stretch=col_stretch)
    
    def _table_insert(self, item: TableRow):
        # self.insert("", item["pos"], iid=item["id"], values=item["values"])
        item_id = item["id"]
        if self.table.exists(item_id):
            self.table.item(item_id, values=item["values"])
        else:
            self.table.insert("", item["pos"], iid=item["id"], values=item["values"])
    
    def insert_item(self, item: TableRow):
        self.after(0, lambda: self._table_insert(item))
    
    def clear_rows(self):
        pass
    
    def on_row_select(self, event=None):
        selected_rows = self.table.selection()
        
        if selected_rows:
            item_id = selected_rows[0]
            # trigger callback
            if self.select_callback:
                self.select_callback(item_id)
    
    def on_double_click_row(self, event=None):
        pass
    
    def remove_item_row(self, item_id: str):
        self.after(0, lambda: self.table.delete(item_id))
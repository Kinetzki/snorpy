from tkinter import ttk
from src.core.arg_types import TableColumn, TableRow
from typing import List
from customtkinter import CTkScrollbar

class TreeTable(ttk.Treeview):
    def __init__(self, master = None, columns: List[TableColumn] = [], **kwargs):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(
            "Treeview",
            background="#1a1a1a",
            foreground="white",
            fieldbackground="#1a1a1a", 
            borderwidth=0
        )
        
        super().__init__(
            master,
            columns=list(map(lambda x: x["column_name"], columns)),
            **kwargs
        )
        
        # self.v_scroll = ttk.Scrollbar(self, orient="vertical") 
        # self.x_scroll = ttk.Scrollbar(self, orient="horizontal")
         
        self.bind("<<TreeviewSelect>>", self.on_row_select)
        self.bind("<Double-1>", self.on_double_click_row) #for double click
        
        for col in columns:
            col_name = col["column_name"]
            col_width = col["width"]
            col_anchor = col["anchor"]
            col_stretch = col["stretch"]
            
            self.heading(col_name, text=col_name.title(), anchor=col_anchor)
            self.column(col_name, width=col_width, anchor=col_anchor, stretch=col_stretch)
    
    def _table_insert(self, item: TableRow):
        # self.insert("", item["pos"], iid=item["id"], values=item["values"])
        item_id = item["id"]
        if self.exists(item_id):
            self.item(item_id, values=item["values"])
        else:
            self.insert("", item["pos"], iid=item["id"], values=item["values"])
    
    def insert_item(self, item: TableRow):
        self.after(0, lambda: self._table_insert(item))
    
    def clear_rows(self):
        pass
    
    def on_row_select(self, event=None):
        selected_rows = self.selection()
        
        if selected_rows:
            item_id = selected_rows[0]
            
            print(f"Selected Item Id: {item_id}")
    
    def on_double_click_row(self, event=None):
        pass
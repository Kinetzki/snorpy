from typing import List, Literal
from .arg_types import TableColumn

pending_table_cols: List[TableColumn] = [
    {
        "column_name": "method",
        "width": 90,
        "min_width": 90,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "host",
        "width": 200,
        "min_width": 200,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "status",
        "width": 80,
        "min_width": 80,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "url",
        "width": 2000,
        "min_width": 200,
        "anchor": "w",
        "stretch": False
    }
]

history_table_cols: List[TableColumn] = [
    {
        "column_name": "method",
        "width": 90,
        "min_width": 90,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "host",
        "width": 200,
        "min_width": 200,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "status",
        "width": 80,
        "min_width": 80,
        "anchor": "center",
        "stretch": False
    },
    {
        "column_name": "response length",
        "width": 100,
        "min_width": 100,
        "anchor": "w",
        "stretch": False
    },
    {
        "column_name": "url",
        "width": 2000,
        "min_width": 200,
        "anchor": "w",
        "stretch": False
    }
]
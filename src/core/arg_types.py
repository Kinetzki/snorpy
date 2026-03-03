from typing import TypedDict, Literal, Any

class TableColumn(TypedDict):
    column_name: str
    anchor: Literal['nw', 'n', 'ne', 'w', 'center', 'e', 'sw', 's', 'se']
    stretch: bool
    width: int

class TableRow(TypedDict):
    id: str
    pos: Literal[0, "end"]
    values: Any
from typing import TypedDict

class NetInterface(TypedDict):
    name: str
    ipv4: str
    sub_mask: str
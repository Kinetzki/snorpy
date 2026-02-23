from typing import TypedDict, Union, Literal, Dict, Any

class HTTPRequest(TypedDict):
    id: str
    method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"]
    url: str
    headers: Dict[str, Any]
    body: bytes
    host: str
    port: int
    scheme: Literal["http", "https"]
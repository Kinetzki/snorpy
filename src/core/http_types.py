from typing import TypedDict, Union, Literal, Dict, Any

class HTTPRequest(TypedDict):
    flow_id: str
    method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"]
    url: str
    headers: str
    content: bytes
    host: str
    port: int
    scheme: Literal["http", "https"]
    length: int

class HTTPResponse(TypedDict):
    flow_id: str
    content: bytes
    headers: str
    status_code: int
    length: int

class HTTPLog(TypedDict):
    request: HTTPRequest
    response: HTTPResponse
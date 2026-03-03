from typing import TypedDict, Union, Literal, Dict, Any
from mitmproxy.http import Headers

class HTTPRequest(TypedDict):
    flow_id: str
    raw_http_string: bytes
    method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"]
    url: str
    headers: Headers
    content: bytes
    host: str
    port: int
    scheme: Literal["http", "https"]
    length: int

class HTTPResponse(TypedDict):
    flow_id: str
    raw_http_string: bytes
    content: bytes
    headers: Headers
    status_code: int
    length: int

class HTTPLog(TypedDict):
    flow_id: str
    request: HTTPRequest
    response: HTTPResponse
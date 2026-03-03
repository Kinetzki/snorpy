# 🛠️ Sidequest Proxy
### A Scriptable, Python-Native Interception Proxy for Hackers.

**Sidequest** is a lightweight, extensible HTTP/HTTPS interception suite built on **mitmproxy** and **CustomTkinter**. It is designed for developers and security researchers who find Burp Suite’s UI clunky, its Java overhead heavy, and its Pro license prohibitive.

If you can write a Python dictionary, you can forge a request.

---

## 🏗️ The Engineering Approach

Most proxies are black boxes. **Sidequest** is a "Glass Box." It is a playground for automation, designed to be modified while it's running.

* **Python-Centric:** No XML configs or proprietary DSLs. Everything from the UI components to the network logic is pure, PEP-8 compliant Python.
* **Decoupled Architecture:** The proxy core runs in an `asyncio` loop on a dedicated background thread, keeping the **CustomTkinter** UI responsive even during heavy traffic or large binary transfers.
* **Direct Memory Access:** Hook directly into the `mitmproxy` flow object. Modify `flow.request.content` or `flow.request.headers` using standard Python methods without needing a complex SDK.



---

## ⚙️ Core Stack

* **Network Engine:** `mitmproxy` (The industry standard for scriptable proxies).
* **Frontend:** `CustomTkinter` (Modern, hardware-accelerated UI elements).
* **Concurrency:** `threading` + `asyncio` (Cross-thread communication managed via `self.after()` for UI safety).
* **Data Handling:** Automatic UTF-8/Byte management for HTTP headers.

---

## ⚡ Developer Features

### 1. Unified Flow Management
We treat a Request and its corresponding Response as a single lifecycle entity. Using `flow.id`, Sidequest maps server responses back to their original UI rows instantly, providing a seamless "Pending -> Complete" state transition.

### 2. Binary-Safe Interception
HTTP headers are handled as raw bytes to ensure protocol integrity but are presented in the UI as editable text. You get the protocol safety of bytes with the development ease of strings.

### 3. Smart Table Logic
The `ttk.Treeview` implementation is optimized for high-volume traffic:
* **Top-down insertion:** Newest traffic is always at index `0`.
* **Horizontal scrolling:** Full support for long URLs and nested paths.
* **Thread-Safe Updates:** UI updates are decoupled from the network thread to prevent deadlocks.



---

## 🛠️ Quick Start (Dev Mode)

```bash
# We recommend a virtual environment
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows

# Install dependencies
pip install mitmproxy customtkinter

# Launch the suite
python src/main.py
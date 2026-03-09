# 🛠️ Snorpy
### The Python-Native Proxy for people who tired of Burp's "Professional" price tag.

**Snorpy** is a lightweight, modern HTTP/HTTPS interception suite in Windows. It’s built for the developer who needs Burp Suite Pro features—like a responsive Repeater and scriptable interception—but doesn't want to deal with Java overhead, clunky 2005-era UI, or a $450/year subscription.

Built by humans, for hackers. 🍕

---

## 🍕 Why Snorpy? (The "Burp Pro" Alternative)

Let’s be real: Burp Suite is the industry standard, but it’s heavy. Snorpy gives you that "Pro" workflow for free:

* **Zero Java:** Snorpy is 100% Python. It’s light on your RAM and doesn't require a JVM to get out of bed.
* **Modern UI:** Built with `CustomTkinter`. It looks like a tool from 2026, not a legacy enterprise app.
* **Actually Scriptable:** No complex Java SDK or Jython bridges. If you know Python, you can extend Snorpy.
* **Free as in Beer:** Everything we build is open-source. No "Community Edition" limitations on the features you actually need.

---

## 🏗️ The Engineering Approach

We didn't just wrap a proxy; we built a developer tool.

* **Async Logic:** The proxy engine runs on an `asyncio` loop in a background thread. This means the UI stays buttery smooth even if you're capturing a 50MB binary response.
* **Direct Memory Access:** You get direct access to the `mitmproxy` flow object. Want to change a header? It’s `flow.request.headers["User-Agent"] = "Snorpy"`. Simple.
* **Thread-Safe UI:** We use `self.after()` scheduling to bridge the gap between the network thread and the UI, ensuring zero deadlocks during high-traffic bursts.

---

## ⚡ Key Features

* **Live Interception:** Hold requests, modify them in-flight, and forward them—just like Burp's Intercept tab.
* **Unified Flow:** Requests and Responses are mapped via `flow.id`, so you never lose track of which response belongs to which request.
* **Horizontal-Ready Table:** Finally, a table that handles long URLs properly. No more squashed columns or missing data.
* **Binary-Safe:** We handle raw bytes under the hood so protocol integrity stays perfect, but we show you strings in the editor for your sanity.

---

## 📦 Distribution & Installation

### Option 1: The "I just want to hack" (EXE)
Download the latest `.exe` from the [Releases](https://github.com/Kinetzki/snorpy/releases) page.

> **⚠️ A Note on Windows Defender:** > Because Snorpy uses `WinDivert` to intercept network traffic at the kernel level, Windows will think it's a "HackTool" or Malware. It isn't—it's just doing its job. You will likely need to **Run as Administrator** and add an exclusion to your Antivirus.

### Option 2: The "I'm a Developer" (Source)
```bash
# 1. Clone the repo
git clone [https://github.com/Kinetzki/snorpy.git](https://github.com/Kinetzki/snorpy.git)
cd snorpy

# 2. Set up a virtual environment (don't skip this!)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install the stack
pip install mitmproxy customtkinter

# 4. Fire it up
python main.py
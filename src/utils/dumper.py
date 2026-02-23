from mitmproxy.tools.dump import DumpMaster
from mitmproxy.options import Options
from threading import Thread
from asyncio import AbstractEventLoop

class Dumper:
    def __init__(self, options: Options, loop: AbstractEventLoop, addons=[]):
        self.dumper = None
        self.loop = loop
        self.thread: Thread = None
        self.options = options
        self.addons = addons
        
    def _run_proxy(self):
        dumper = DumpMaster(
            self.options,
            loop=self.loop,
            with_dumper=False,
            with_termlog=True
        )
        self.dumper = dumper
        for addon in self.addons:
            self.dumper.addons.add(addon)
        
        self.loop.run_until_complete(self.dumper.run())
        
    def start(self):
        if self.thread and self.thread.is_alive():
            return
        self.thread = Thread(target=self._run_proxy, daemon=True)
        self.thread.start()
    
    def stop(self):
        if self.dumper:
            self.loop.call_soon_threadsafe(self.dumper.shutdown)
            
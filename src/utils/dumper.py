from mitmproxy.tools.dump import DumpMaster
from mitmproxy.options import Options
from threading import Thread
from asyncio import AbstractEventLoop
import asyncio

class Dumper:
    def __init__(self, options: Options, loop: AbstractEventLoop = None, addons=[]):
        self.dumper = None
        self.loop = loop
        self.thread: Thread = None
        self.options = options
        self.addons = addons
        
    def _run_proxy(self):
        # self.loop = asyncio.new_event_loop()
        options_copy =  Options(
            listen_host=self.options.listen_host,
            listen_port=self.options.listen_port
        )
        
        dumper = DumpMaster(
            options_copy,
            loop=self.loop,
            with_dumper=False,
            with_termlog=True
        )
        self.dumper = dumper
        for addon in self.addons:
            self.dumper.addons.add(addon)
        
        try:
            self.loop.run_until_complete(self.dumper.run())
        except Exception as e:
            print(f"Proxy Error: {str(e)}")
        finally:
            pending = asyncio.all_tasks(self.loop)
            for task in pending:
                task.cancel()
            
            if pending:
                self.loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
            
            self.loop.run_until_complete(self.loop.shutdown_asyncgens())
            
            self.dumper = None
        
    def start(self):
        if self.thread and self.thread.is_alive():
            return
        self.thread = Thread(target=self._run_proxy, daemon=True)
        self.thread.start()
    
    def stop(self):
        if self.dumper:
            try:
                self.loop.call_soon_threadsafe(self.dumper.shutdown)
            except RuntimeError:
                pass
            if self.thread:
                self.thread.join(timeout=2)
                if not self.thread.is_alive():
                    self.thread=None
            self.dumper = None
        else:
            print("No dumper")
            
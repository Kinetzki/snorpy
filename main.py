from src.components import MainWindow
from src.components.state_manager import app_state
import os
import sys
import ctypes
import multiprocessing

def initialize_proxy_binaries():
    if getattr(sys, 'frozen', False):
        # Standard streams are None in --noconsole mode
        if sys.stdout is None:
            sys.stdout = open(os.devnull, "w")
        if sys.stderr is None:
            sys.stderr = open(os.devnull, "w")
    
    if hasattr(sys, '_MEIPASS'):
        # 1. Get the path where PyInstaller extracted the files
        base_path = sys._MEIPASS
        bin_dir = os.path.join(base_path, "binaries")
        
        # 2. Tell Windows explicitly where to look for DLLs
        # This is the "Magic Fix" for Windows 10/11 security
        os.add_dll_directory(bin_dir)
        
        # 3. Force the environment variables for the libraries
        os.environ["WINDIVERT_DLL_PATH"] = bin_dir
        os.environ["PATH"] = bin_dir + os.pathsep + os.environ["PATH"]

initialize_proxy_binaries()

def main():
    app = MainWindow(
        "MITM Master",
        "1200x700"
    )
    app.iconbitmap(app_state.get_asset_path("assets/logo.ico"))
    app.mainloop()

if __name__ == "__main__":
    multiprocessing.freeze_support()
    main()
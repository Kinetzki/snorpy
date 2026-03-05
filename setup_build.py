import PyInstaller.__main__
import os
import customtkinter
import mitmproxy_windows
import pydivert

ctk_path = os.path.dirname(customtkinter.__file__)
mitm_win_bin = os.path.dirname(mitmproxy_windows.__file__)
pydivert_bin = os.path.join(os.path.dirname(pydivert.__file__), "windivert_dll")

PyInstaller.__main__.run([
    'main.py',
    '--onefile',
    '--noconsole',
    "--uac-admin",
    f'--add-data={ctk_path}{os.pathsep}customtkinter/',
    f'--add-data=assets{os.pathsep}assets',
    f'--add-data={pydivert_bin}{os.pathsep}binaries',
    f'--add-data={mitm_win_bin}{os.pathsep}binaries',
    '--icon=assets/logo.ico',
    '--name=Snorpy',
    '--clean'
])
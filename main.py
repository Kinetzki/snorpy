from src.components import MainWindow

def main():
    app = MainWindow(
        "MITM Master",
        "700x700",
    )
    
    app.mainloop()

if __name__ == "__main__":
    main()
import subprocess
import os
import signal

PYTHON_PATH = r"venv\Scripts\python.exe"


services = [
    "anemia/app.py",
    "brain_tumor_segmentation/app.py",
    "pneumonia/app.py",
    "TB/app.py"
]

processes = []

try:
    for service in services:
        full_path = os.path.join(os.getcwd(), service)
        service_dir = os.path.dirname(full_path)
        # Set cwd=service_dir so each app runs in its own folder
        p = subprocess.Popen([PYTHON_PATH, "app.py"], cwd=service_dir)
        print(f"Started {service} with PID {p.pid}")
        processes.append(p)

    print("All services started. Press Ctrl+C to stop.")
    for p in processes:
        p.wait()

except KeyboardInterrupt:
    print("\nShutting down all services...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    for p in processes:
        try:
            p.wait(timeout=5)
        except Exception:
            p.kill()
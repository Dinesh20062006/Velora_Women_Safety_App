import os
import json

def update_ai_service():
    service_path = os.path.join(os.path.dirname(__file__), "src", "services", "aiService.js")
    if os.path.exists(service_path):
        print(f"Verified aiService.js exists at {service_path}")
    else:
        print(f"File not found: {service_path}")

if __name__ == "__main__":
    update_ai_service()

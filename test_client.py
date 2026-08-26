import requests

URL = "http://localhost:8000/transform"

# 1. Test raw text input
text_payload = {
    "format_type": "linkedin",
    "raw_text": (
        "Groundwater levels in rural aquifers have dropped by 14% over the past two years. "
        "Deploying IoT-enabled Digital Water Level Recorders allows real-time telemetry, "
        "enabling proactive interventions before total depletion occurs."
    )
}

print("Testing Raw Text Transformation...")
response = requests.post(URL, data=text_payload)
print("Status Code:", response.status_code)
print("Response JSON:\n", response.json())

# 2. Test PDF upload (Optional)
# with open("sample.pdf", "rb") as f:
#     files = {"pdf_file": f}
#     data = {"format_type": "advisory"}
#     response = requests.post(URL, data=data, files=files)
#     print("PDF Upload Response:\n", response.json())
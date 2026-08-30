import requests

TRANSFORM_URL = "http://localhost:8000/transform"
INFOGRAPHIC_URL = "http://localhost:8000/generate-infographic"

print("=== Testing standard transform endpoint ===")
text_payload = {
    "format_type": "linkedin",
    "raw_text": (
        "Groundwater levels in rural aquifers have dropped by 14% over the past two years. "
        "Deploying IoT-enabled Digital Water Level Recorders allows real-time telemetry, "
        "enabling proactive interventions before total depletion occurs."
    )
}

response = requests.post(TRANSFORM_URL, data=text_payload, timeout=120)
print("Status Code:", response.status_code)
print("Response JSON:\n", response.json())

print("\n=== Testing infographic generation from raw text ===")
infographic_payload = {
    "format_type": "advisory",
    "raw_text": (
        "Urban congestion costs the city an estimated $2.4B annually. "
        "Traffic signal optimization, bus-priority lanes, and real-time route analytics can "
        "cut commute times by up to 22% while reducing emissions and improving public transit reliability."
    )
}

response = requests.post(INFOGRAPHIC_URL, data=infographic_payload, timeout=120)
print("Status Code:", response.status_code)
print("Content-Type:", response.headers.get("content-type"))

if response.ok and response.headers.get("content-type", "").startswith("image/png"):
    with open("infographic_output.png", "wb") as f:
        f.write(response.content)
    print("Saved infographic PNG to: infographic_output.png")
else:
    print("Response body:", response.text)

# Optional PDF-based infographic test
# with open("sample.pdf", "rb") as f:
#     files = {"pdf_file": f}
#     data = {"format_type": "advisory"}
#     response = requests.post(INFOGRAPHIC_URL, data=data, files=files, timeout=120)
#     print("PDF infographic status:", response.status_code)
#     if response.ok and response.headers.get("content-type", "").startswith("image/png"):
#         with open("infographic_from_pdf.png", "wb") as f:
#             f.write(response.content)
#         print("Saved PDF-based infographic to: infographic_from_pdf.png")
#     else:
#         print(response.text)
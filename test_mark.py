import requests

url = "http://127.0.0.1:5000/mark"
headers = {"Content-Type": "application/json"}
data = {
    "question": "Assess the impact of artificial intelligence on modern legal systems.",
    "pdf_path": "papers/8021_m24_in_12.pdf",
    "answer": "Artificial intelligence has a huge impact on modern legal systems...",
    "marks": 30
}

try:
    response = requests.post(url, json=data, headers=headers)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except requests.exceptions.ConnectionError:
    print("Connection Error: Is the Flask server running?")

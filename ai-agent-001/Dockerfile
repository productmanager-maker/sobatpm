FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py sales_agent.py service-account.json ./

CMD ["python", "app.py"]

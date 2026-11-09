FROM python:3.9-slim

WORKDIR /app

# Copia PRIMERO requirements.txt para cachear dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install cryptography pymysql  

# Copia TODO el contenido (incluyendo auth/)
COPY . .

# Asegúrate que Python pueda encontrar auth/
ENV PYTHONPATH=/app

CMD ["python", "app.py"]
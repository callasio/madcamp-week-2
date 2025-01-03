FROM python:3.11-slim

WORKDIR /api

COPY ./api/requirements.txt .
RUN pip install -r requirements.txt

COPY ./api . 

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
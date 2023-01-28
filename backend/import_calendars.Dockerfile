FROM python:3-slim

COPY ./*.py ./requirements.txt ./
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1

FROM python:3-slim
COPY ./requirements.txt ./
RUN pip install -r requirements.txt
COPY ./mitaffald_ids.txt ./*.py ./
ENV PYTHONUNBUFFERED=1

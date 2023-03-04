ARG gunicorn_version=20.0

FROM node:hydrogen-buster-slim AS frontend
WORKDIR /build
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

FROM python:3-slim-buster
WORKDIR /app
COPY ./backend/requirements.txt .
ARG gunicorn_version
RUN pip install \
    --disable-pip-version-check \
    --no-cache-dir \
    --root-user-action=ignore \
    -r requirements.txt \
    gunicorn~=${gunicorn_version}
COPY ./backend/*.py ./
COPY --from=frontend /build/build ./frontend
ENV FLASK_FRONTEND_PATH='./frontend'
#ENTRYPOINT ["flask", "--app=./app.py", "run", "--host=0.0.0.0", "--port=8080"]
ENTRYPOINT ["gunicorn", "--bind=0.0.0.0:8080", "app:app"]
EXPOSE 8080

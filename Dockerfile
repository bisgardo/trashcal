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
# The container should be run with `--tty` to ensure that line buffering rather than file buffering is being used.
# Alternatively, buffering can be disabled entirely using `ENV PYTHONUNBUFFERED=1`.
# Bind on 0.0.0.0 to expose server to the container's host.
# Add `--access-logfile=-` to log access to stdout (https://docs.gunicorn.org/en/latest/settings.html#logging).
# This can be done in the run command using `--env=GUNICORN_CMD_ARGS=--access-logfile=-`.
# If a reverse proxy sitting in front of the container, then the logged IP will be that of the host, i.e. 172.17.0.1,
# not that of the actual client. The reverse proxy will be able to log access more accurately.
# (I vaguely recall that the proxy can be set up to expose the real IP to the downstream service in a header.)
ENTRYPOINT ["gunicorn", "--bind=0.0.0.0:8080", "app:app"]
# To run without WSGI server, do `ENTRYPOINT ["flask", "--app=./app.py", "run", "--host=0.0.0.0", "--port=8080"]` instead.
EXPOSE 8080

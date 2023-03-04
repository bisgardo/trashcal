FROM node:hydrogen-buster-slim AS frontend
WORKDIR /build
COPY ./frontend/package*.json ./
RUN ls
RUN npm ci
COPY ./frontend .
RUN ls
RUN npm run build


FROM python:3-slim-buster
WORKDIR /app
COPY ./backend/*.py ./backend/requirements.txt ./
RUN pip install -r requirements.txt
COPY --from=frontend /build/build ./frontend
RUN ls
#ENV PYTHONUNBUFFERED=1
ENV FLASK_FRONTEND_PATH='./frontend'
ENV FLASK_RUN_HOST='0.0.0.0'
ENTRYPOINT ["flask", "--app", "./app.py", "run"]

A simple React App using Typescript and a Python backend for fetching unemployement data from ESTAT.

Run using (sudo) docker-compose up --build or start both services individually with set .env for both backend and frontend

Environment variables:

Backend:

DATA_URL = https://webgate.ec.europa.eu/empl/redisstat/api/dissemination/sdmx/2.1/data/lmp_ind_actru?format=json&compressed=false

Frontend:

REACT_APP_BASE_URL = Adress for backend, eg: localhost:5000

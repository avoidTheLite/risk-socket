# risk-socket

## Risk Socket Service
This service is the second iteration of the risk server to support an online Risk game. Iteration #1 (v1) can be found here: https://github.com/avoidTheLite/risk-server

## Why rewrite instead of modify?
While my first risk service was built while learning many fundamental things and accrued technical debt, many of the issues would have been decent exercises to cleanup and refactor, however the following issues really nececitated a rewrite: 

1) The v1 service was built using stateless HTTP methods. Websockets are a much more appropriate protocol for real time games.  Player rotation, as well rendering up to date game state demands that clients perform many requests to stay in sync the game state (while keeping track of all new actions/events on the server). 

2) Data models were setup with tables for countries, players, cards, and multiple ownership tables with lots of joins. A risk game will have low, static number of countries and players, so this complexity provides very little performance benefit. Furthermore, each game has its own set of countries, players, and cards.

## Setup and Instructions

1) Ensure Node, NPM, and Docker are installed on your system.
Node version >=18 is required, but I'm currently running v20.2.0

2) Clone repo with
```bash
git clone https://github.com/avoidTheLite/risk-socket.git
``` 

3) From project directory install dependencies with npm

```bash
npm install
```
4) Add .env file with:

```ENV
SERVER_PORT=3001
SOCKET_PORT=8080
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=risk-socket
DB_URL=localhost
DB_PORT=5432

```
4) Setup postgreSQL database to run locally (refer to scripts in package.json)

Run the image using docker compose   
```bash
npm run docker:db
```
Migrate database tables
```bash
npm run db:migrate
```
Seed the database with test game and default globe of 'Earth' (game map) 
```bash
npm run db:seed
```

5) Start the server using:

```bash
npm run dev
```

## Testing
### Automated Testing:
Tests are currently setup to run using SQLite from memory. Run the tests using 
```bash
npm test
```
### Manual Testing:
To test using Postman, first start the database and server. 
1) Set URL to
```
ws://localhost:8080/
```
2) Click 'connect'
3) Start a new game with the following message:

```JSON
{
    "data": {
        "action": "newGame",
        "message": "",
        "players": [{
            "id": "0",
            "name": "Your name here",
            "color": "red"
        },{
            "id": "1",
            "name": "Your Friend/enemy Name here",
            "color": "blue" 
        }
        ],
        "globeID": "defaultGlobeID"
    }
}
```

Expected response for success:
```JSON
{
    "data": {
        "action": "newGame",
        "message": {
            "saveName": "jfh7q8qS6d - autosave turn 0",
            "id": "jfh7q8qS6d",
            "name": null,
            "players": [
                {
                    "id": "0",
                    "name": "Your name here",
                    "color": "red"
                },
                {
                    "id": "1",
                    "name": "Your Friend/enemy Name here",
                    "color": "blue"
                }
            ],
            "countries": ['Array of country objects, truncated for brevity],
            "continents": ['Array of continent objects, truncated for brevity'],
            "globeID": "defaultGlobeID",
            "turn": 0,
            "phase": "deploy",
            "created_at": "2025-02-24T17:04:46.694Z",
            "updated_at": "2025-02-24T17:04:46.694Z"
        },
        "status": "success"
    }
}
```

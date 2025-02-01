# risk-socket

## Risk Socket Service
This service is the second iteration of the risk server to support an online Risk game. Iteration #1 (v1) can be found here: https://github.com/avoidTheLite/risk-server

## Why rewrite instead of modify?
While my first risk service was built while learning many fundamental things and accrued technical debt, many of the issues would have been decent exercises to cleanup and refactor, however the following issues really nececitated a rewrite: 

1) The v1 service was built using stateless HTTP methods. Websockets are a much more appropriate protocol for real time games.  Player rotation, as well rendering up to date game state demands that clients perform many requests to stay in sync the game state (while keeping track of all new actions/events on the server). 

2) Data models were setup with tables for countries, players, cards, and multiple ownership tables with lots of joins. A risk game will have low, static number of countries and players, so this complexity provides very little performance benefit. Furthermore, each game has its own set of countries, players, cards, and adding where clauses on GameID for every 
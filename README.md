# DashboardBMTH

Dashboard is a webapplication which allows you to add some widgets containing interesting informations

## Installation

### Requirements
* git
* DockerCE
* npm

Clone the DashboardBMTH's repository :

`git clone git@git.epitech.eu:/bryan.medica@epitech.eu/DEV_dashboard_2018`

To run the Dashboard, please run this command in your command-line :

`docker-compose build && docker-compose up`

## Usage

When your ran the command above, search <http://localhost:8080> in your web browser.

## Services and Widgets

Here is a complete list of the widgets associated to their services proposed by DashboardBMTH :

|Services|Widget|Params|Connection needed|
|:---:|:---:|:---:|:---:|
|Weather|Get a city temperature|City name|No|
|Weather|Get a city climate|City name|No|
|Twitch|Get a followed channel's followers|Channel name|Yes|
|Steam|Get time played on a game|Game name|Yes|
|Le Monde|Get the last article concerning a keyword|Keyword|No|
|Clash Royale|Get the next chest of a player|Player ID|No|

In order to connect to Twitch and Steam services go to the <http://localhost:8080/profile> page

## Possible errors

In order to get all the modules related to the project, please run in this repository the following command :

`npm install`

In case of rights problems on the database (particularly under **SE Linux** security systems), please run this command in your command-line :

`sudo docker-compose build && sudo docker-compose`

## License
[MIT](https://choosealicense.com/licenses/mit/)
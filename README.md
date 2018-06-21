# BOOK-A-MEAL
https://travis-ci.org/Pomile/BOOK-A-MEAL.svg?branch=chore%2Ftravis-postgres-integration

[![Coverage Status](https://coveralls.io/repos/github/Pomile/BOOK-A-MEAL/badge.svg?branch=chore%2Ftravis-postgres-integration)](https://coveralls.io/github/Pomile/BOOK-A-MEAL?branch=chore%2Ftravis-postgres-integration)

Book-A-Meal is an application that allows customers to make food orders and helps the food  vendor know what the customers want to eat.

#Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

#Prerequisites
1. nodejs: 
2. PostgresSQL including pgAdmin 
3. visual studio code;
   
#Installation

STEP1
INSTALL THE FOLLOWING PREREQUISITES ON THE DEVELOPMENT MACHINE:
>nodejs
>Postgres 9.x or 10.x - PostgreSQL can be installed by any unprivileged user; no superuser (root) access is required.
>visual studio code or equivalent

STEP2

> clone central repository
> open command prompt in the OS
> change directory to the project root folder
> run npm install

STEP 3
> create database for test and development environment;
   By default postgres installation  create a user - postgres with blank password
  >> change user to postgres
  >> create user
  >> create database
  >> Access the postgres Shell
  >> Provide privileges to the postgres user
     
# Example

In Linux Envrionment:

$ su <user>
$ createuser <testuser>
$ createdb <testdb>
$ psql ( enter the password for postgressql)
$ alter user <testuser> with encrypted password <pass>;
$ grant all privileges on database <testdb> to <testuser>;

In Windows Envrionment:

Depending on how postgres is installed, you might need to change directory to the path where postgres is installed
example: C:\Program Files\PostgreSQL\10\bin\

> createuser --host=<localhost> --port=<port>  --username=postgres <username>
> createdb --host=<localhost> --port=<port> --username=<postgres> <dbname>
> psql --host=<localhost> --port=<port>  --username=postgres <username> --dbname=<dbname>
> alter user <root> with encrypted password <pass>;
> grant all privileges on database <testdb> to <testuser>;
>\q

STEP 3

> run npm install

#Deploy database schema with sequelize

>run sequelize db:migrate


#Running the tests
1. get google authorization code through the link below which will be used to access google api (https://mail.google.com/).
https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fmail.google.com%2F&response_type=code&client_id=689151234993-7bcjnid76h639skieoqc4qkiafv8hbi6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fv1%2Fauth%2Foauth2callback

2. copy the google authorization code (eg: 4/AABViH_-dANgUQqvHmCXtGoTFZLORrLJwX3oAlm-AVVPezo8qyj1GaPmC-Xt96wIfeGSmGvm2j7AnJEwFDpRwxo) and pastes in the googleAuthCode.json file as value for code property in the JSON content.-{ code: <authcode>}

3. open cmd prompt and cd to the project root directory
4. run npm test in the command prompt

#end to end tests


#Give an example
And coding style tests
Explain what these tests test and why

#Give an example
Deployment
Add additional notes about how to deploy this on a live system

#Technologies
Express - web framework
Postgres - Relational database Management System
Nodejs- Runtime Environment for Javascript.
NodeMailer - Email library for nodejs
Sequelize - object relational Mapper
Mocha, Chai, and supertest - Test framework and other dependencies
nyc and coveralls - for coverage test.
morgan - logging library
express fileupload - middleware used to handle files(image format - jpg, png, doc formats-docx, pdf)
opn


#Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

#Authors
Babatunde Ogedengbe
#Contributor
Mayowa Makinde
License
This project is licensed under the MIT License - see the LICENSE.md file for details

Acknowledgments
I salute the Andela software developers for their support and encouragement.

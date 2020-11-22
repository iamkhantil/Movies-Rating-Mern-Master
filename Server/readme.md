## Introduction

This project is the backend of Movies System.

## Setup

Make sure to use Node Version >= 12.0.8, If you are a linux user then you have to manaully install NodeJs >= 12.0.8 from source Code

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm install

### .env File

You need to create an .env file on your machine for storing secrets and passwords.

### Start the Server

    node index.js

This will launch the Node server on port 3900. If that port is busy, you can set a different point in config/default.json.

# node_rbac

rbac api developed in node.js

## Features
- Role Based Access Control
- User Authentication
- CRUD Operations
- REST API

## Tech Stack
- Node.js
- Express.js
- MySQL
- Sequelize
- JWT

## Installation

In your terminal perform the following commands

```
<!-- clone repo -->
git clone https://github.com/Priya434/node_rbac.git

cd node_rbac
npm install

<!-- create config.env file and enter following details -->
DATABASE_NAME=your_db_name
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_HOST=localhost
JWT_SECRET=your_secret_key

<!-- start the server -->
npm run dev
```
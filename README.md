# RareTrades

RareTrades is a web application where users can search, rank, and recommend rare trading cards. It includes features for login and registration, as well as various sections for browsing card information.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [License](#license)

## Features

- User authentication (Login/Signup)
- Browse rare trading cards
- Search for specific cards
- Ranking system
- Responsive design

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Styling**: CSS, Bootstrap (optional)
- **Authentication**: bcrypt for secure password handling
- **API**: REST API using Express.js

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (for the backend database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/raretrades.git
   cd raretrades
   ```

2. **Install dependencies for the frontend**:
    ```bash
    npm install
    ```

3. **Set up the backend**: If your backend is in the same repository, continue; otherwise, navigate to the backend folder and run:
    ```bash
    npm install
    ```

4. **Set up environment variables**: Create a .env file in the root of your backend folder with the following content:
    ```js
    PGUSER=your_pg_user
    PGPASSWORD=your_pg_password
    PGHOST=localhost
    PGDATABASE=raretrades_db
    PGPORT=5432
    ```

5. **Run the PostgreSQL database**: Ensure your PostgreSQL server is running and the database is set up with the correct schema (users, cards, etc.). You can create a database using the following SQL command:
    ```sql
    CREATE DATABASE raretrades_db;
    ```

    Then, create the necessary tables with:

    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
    );
    ```

6. **Start the backend server**: If the backend is in the same project, run the following command in the root directory:
    ```bash
    npm run server
    ```
    If you have a separate backend folder, navigate there and start the backend:

    ```bash
    npm start
    ```
    The backend server should run on `http://localhost:4000`.

## Folder Structure
The basic folder structure for this project:

## License
This is licensed by Sanghyup Lee

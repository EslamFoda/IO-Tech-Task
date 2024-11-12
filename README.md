
Application Url -> https://io-tech-task-gamma.vercel.app/


# Getting Started
This guide provides instructions on how to set up and run this React project locally, which includes a JSON server for API functionality.

## Prerequisites
Make sure you have the following installed on your machine:

Node.js (https://nodejs.org/)
npm (comes with Node.js)
json-server (for the local API)

## Setup and Run Instructions

### 1. Clone the Repository

Clone the repository to your local machine by running:

git clone https://github.com/EslamFoda/io-tech-task.git

Then navigate into the project directory:

cd io-tech-task

---

### 2. Install Dependencies
Install all the necessary dependencies by running:

npm install

---

### 3. Set Up the JSON Server
This project uses json-server to create a local REST API. Follow these steps:

=> Install json-server globally (if you haven’t already):

npm install -g json-server

---

=> Create a db.json file in the root of the project if it doesn’t already exist. This file will store your API data.

Here’s an example structure for db.json:

{
  "items": [
    {
      "title": "Sample Item",
      "body": "This is a sample item."
      "id":"a3d1",
    }
  ]
}

---

=> Start the JSON Server by running:

json-server --watch db.json --port 3001

This command watches for changes in db.json and starts the server on http://localhost:3001.

---

### 4. Start the React Application
Open another terminal in the project directory and run:

npm start

This will start the React app on http://localhost:3000.

### 5. Verify the Setup
Ensure the JSON server is running at http://localhost:3001.
Make sure the React app is accessible at http://localhost:3000.
Your React app should now be able to make API requests to the local JSON server.




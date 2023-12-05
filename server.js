// server.js
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var routes = require('./routes/routes');
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:4200"
}));

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'avrox-pto';

async function main() {
    try {
        await client.connect();
        console.log('Database Server Running');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

app.listen(9992, () => {
    console.log('Web Server Running');
    main(); 
});

app.use(express.json());
app.use(routes);

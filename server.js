/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Stephen Suresh         Student ID: 117916213      Date: 2023-01-15
*  Cyclic Link: https://modern-calf-vest.cyclic.app/
*
********************************************************************************/ 


// Setup
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

//This route uses the body of the request to add a new "Movie" document to the collection and return the newly created movie object / fail message to the client.
app.post('/api/movies', (req, res) => {
    if (!req.body) {
        res.status(204).json({ message: 'Nothing in req.body' });
    }
    else () => {
        db.addNewMovie(req.body)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }
})

app.get("/api/movies", (req, res) => {
    if (!req.query || !req.query.page || !req.query.perPage) {
        res.status(500).json({ message: "Invalid query/parameter entered" });
    } else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
            .then(
                (data) => {
                    res.status(201).json(data);
                })
            .catch((err) => {
                // res.status(500).json({message : err});
                res.status(500).json(err);
            });
    }
});

app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

app.put('/api/movie/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
})

app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

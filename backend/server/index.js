const {
    getData,
    initializeUser,
    updateUser,
    verifyUser,
    runScrapers,
} = require('../src')

const express = require("express");
const app = express(); // create express app
const cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/init-user', (req, res, next) => {
    console.log('initialize user');

    initializeUser(req.query.username, req.query.pass)
        .then(
            () => {
                res.status(200).send('Success');
            }, 
            (err) => {
                console.log(err)
                res.status(200).send('Failed to update user' + err);
            }
        );
});

app.get('/verify-user', (req, res, next) => {
    console.log('verifying user');

    verifyUser(req.query.username, req.query.pass)
        .then(
            (result) => {
                res.status(200).send(result);
            }, 
            (err) => {
                console.log(err)
                res.status(200).send('Failed to verify user' + err);
            }
        );
});

app.get('/update-user', (req, res, next) => {
    console.log('update user');
    const username = req.query.username;
    delete req.query.username;

    updateUser(username, req.query)
        .then(
            () => {
                res.status(200).send('Success');
            }, 
            (err) => {
                console.log(err)
                res.status(200).send('Failed to update user' + err);
            }
    );
});

app.get('/get-data', (req, res, next) => {
    console.log('get stats');
    getData(req.query.username)
        .then(
            (result) => {
                res.status(200).send(result);
            }, 
            (err) => {
                console.log(err)
                res.status(200).send('Failed to get stats: ' + err);
            }
        );
});

app.get('/run-scrapers', (req, res, next) => {
    console.log('running scraper');

    runScrapers(req.query.username)
        .then(
            () => {
                res.status(200).send();
            }, 
            (err) => {
                console.log(err)
                res.status(200).send('Failed to run scrapers: ' + err);
            }
        );
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});
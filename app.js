const express = require('express');
const bodyParser = require('body-parser')
const Sequelize = require('sequelize');

const app = express();
const port = 3000;
const path = 'postgresql://victorhuerta@localhost:5432/disney'; //Modify this path with your local DB string
const sequelize = new Sequelize(path);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

sequelize.authenticate()
    .then(() => {
        console.log('Succesfully connected to DB ' + path)
    })
    .catch(err => {
        console.log('Failed to connect to DB ' + path)
    })

//Models
const Character = sequelize.define('characters', {
    character_id: {type: Sequelize.SMALLINT, autoIncrement: true, primaryKey: true},
    character_name: Sequelize.STRING,
    character_age: Sequelize.INTEGER
},{
    timestamps: false
});
const Movie = sequelize.define('movies', {
    movie_id: {type: Sequelize.SMALLINT, autoIncrement: true, primaryKey: true},
    movie_title: {type: Sequelize.STRING, allowNull: false},
    movie_year: {type: Sequelize.INTEGER, defaultValue:0 },
    movie_rate: {type: Sequelize.INTEGER, defaultValue: 0}
},{
    timestamps: false
});

//Routes
app.get('/', (req, res) => res.send('Welcomet to the Disney API'));

app.get('/characters', (req, res) => {
    Character.findAll({
        attributes: ['character_name'] 
    })
    .then(characters => {
        res.json(characters)
    })
    .catch(err => {
        console.log(err)
    })
});

app.post('/characters', (req, res) => {
    Character.create({
        character_name: req.body.character_name,
        character_age: req.body.character_age
    }).then(data => {
        let query_response = data ? res.send(`Character with name: ${req.params.character_name} has been added to the DB.`) : res.send(`The character ${req.params.character_name} has not been added to the DB`);
    }).catch(err => {
        console.log(err);
    })
});

app.delete('/characters/:character_name', (req, res) => {
    Character.destroy({
        where :{
            character_name: req.params.character_name
        }
    })
    .then(data => {
        console.log(`Record with name ${re.body.character_name} added to de DB`);
        let query_response = data ? res.send(`Character with name: ${req.params.character_name} and name ${req.params.character_name} was succesfullty deleted.`) : res.send(`The character ${req.params.character_name} does not exist.`)
    })
    .catch(err => {
        console.log(err);
    })
});

app.get('/movies', (req, res) => {
    Movie.findAll({ attributes: ['movie_title', 'movie_year', 'movie_rate'] })
        .then(movies => {
            res.json(movies)
        })
        .catch(err => {
            console.log(err)
        })
    });

app.post('/movies', (req, res) => {
    Movie.create({
        movie_title: req.body.movie_title,
        movie_year: req.body.movie_year,
        movie_rate: req.body.movie_rate
    }).then(data => {
        console.log(`Record with name ${re.body.movie_title} added to de DB`);
        let query_response = data ? res.send(`Movie with name: ${req.params.movie_title} has been added to the DB.`) : res.send(`The Movie ${req.params.movie_title} has not been added to the DB`);
    }).catch(err => {
        console.log(err);
    })
});

app.delete('/movies/:movie_title', (req, res) => {
    Movie.destroy({
        where :{
            movie_title: req.params.movie_title
        }
    })
    .then(data => {
        let query_response = data ? res.send(`Movie with name: ${req.params.movie_title} and name ${req.params.movie_title} was succesfullty deleted.`) : res.send(`The movie ${req.params.movie_title} does not exist.`)
    })
    .catch(err => {
        console.log(err);
    })
});
 
app.listen(port, () => console.log(`Disney API listening on port: ${port}`));
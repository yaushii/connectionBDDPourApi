// chargement du serveur en utilisant express
const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('./public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
    console.log("trying to create a new user")

    console.log("first name: " + req.body.create_firstname)
    const firstName = req.body.create_firstname
    const lastName = req.body.create_lastname

    const queryString = "INSERT INTO users (firstname, lastname) VALUE (?, ?)"
    getConnection().query(queryString, [firstName, lastName], (err, results, fields)=> {
        if(err) {
            console.log("failed to insert to new user: " + err)
            res.sendStatus(500)
            return
        }
        console.log("inserted a new user with id", results.insertId);
        res.end()
    })

})
function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        passwornd: "",
        database: "nodeexpress"
    })
}

app.get('/users/:id', (req, res) => {
    console.log("fetching user with id: " + req.params.id)
    const connection = getConnection()
    const userId = req.params.id
    const queryId = "SELECT * from users WHERE id = ?"
    connection.query(queryId, [userId], (err, rows, files) => {
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            return
        }

        console.log("i think we fetched users success")
        const users = rows.map((row) => {

            return {
                id: row.id,
                firstName: row.firstname,
                lastName: row.lastname,
            }
        })

        res.json(users)
    })
    //res.end()
})

app.get("/", (req, res) => {
    console.log("responding to root route")
    res.send("Bonjour bienvenue sur l'api de Telmann Justine qui est conecter a une bdd phpmyadmin")
})

app.get("/users", (req, res) => {
    const connection = getConnection()

    const queryString = "SELECT * from users"
    connection.query(queryString, (err, rows, files) => {
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            return
        }

        console.log("i think we fetched users success")
        const users = rows.map((row) => {

            return {
                id: row.id,
                firstName: row.firstname,
                lastName: row.lastname,
            }
        })

        res.json(users)
    })









    //var user1 = { firstname: "Justine", lastname: "Telmann" }
    //const user2 = { firstname: "Jordan", lastname: "Fievet" }
    //res.json([user1, user2])
})


//localhost:3000
app.listen(3000, () => {
    console.log("server fonctionne et ecoute au 3000...")
})
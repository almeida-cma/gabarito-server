const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


const app = express();

// Configurar SQLite
const db = new sqlite3.Database('./sampleDB.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful connection to the database");
});

// Criar tabelas para Leads
const sql_create_leads = `CREATE TABLE IF NOT EXISTS leads (
    name text NOT NULL,
    email text NOT NULL,
	celular text
);`;

db.run(sql_create_leads, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of the 'leads' table");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Por conta do acionamento em return.html


// Static files
app.use(express.static('public'));


//Adicionar rota para return
app.get('/return.html', (req, res) => {
    res.sendFile(__dirname + '/public/return.html');
});


// Endpoint para inserir dados no leads:
app.post('/dados', (req, res) => {
    let sql = `INSERT INTO leads (name, email, celular) VALUES (?, ?, ?)`;
    let values = [req.body.name, req.body.email, req.body.celular];

    db.run(sql, values, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Rows inserted ${this.changes}`);
    });

    res.redirect('/return.html');
});

// Rota para pegar todos os leads:
app.get('/leads', (req, res) => {
    let sql = "SELECT name, email, celular FROM leads";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
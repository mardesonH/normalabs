const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(express.static('.'));

//Rotas da aplicação
//Página padrão, index
server.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    server.get('/portal', (req, res) => {
      res.sendFile(__dirname + '/portal.html');
  });

    server.post('/login', (req, res) => {
      var user = req.body.usuario;
      var senha = req.body.senha;
      console.log(user);
      res.end(user);
    });

let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('DB Conectado');
  });


createDB = `CREATE TABLE IF NOT EXISTS 'USERS_NORMA' (id INTEGER PRIMARY KEY, user TEXT, email TEXT, setor TEXT, cargo TEXT, senha TEXT, token TEXT, foto BLOB)`;
console.log('Tabela criada')
db.run(createDB);


//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
  console.log('Server Rodando');
});
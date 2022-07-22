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

  server.post('/registrar', (req, res) => {
    //Criar objeto com os dados
    let dados = new Object();
    dados.user = req.body.usuario;
    dados.email = req.body.email;
    dados.setor = req.body.setor;
    dados.cargo = req.body.cargo;
    dados.senha = req.body.senha;
    let token = '';
    for (var i = 80; i > 0; --i) token += (Math.floor(Math.random()*256)).toString(16);
    dados.token = token;

    let realUser = req.body.usuario;
    realUser = realUser.toUpperCase();

    //Checar se usuário ou email já existe
    

    let criar = `INSERT INTO USERS_NORMA (realUser, user, email, setor, cargo, senha, token) VALUES ( '${realUser}','${req.body.usuario}','${req.body.email}','${req.body.setor}','${req.body.cargo}','${req.body.senha}','${token}')`;
    db.run(criar);
    console.log(criar);

    const json = JSON.stringify(dados);
    console.log(dados);
    res.send(json);
  });

  //usuario: dados[0], email: dados[1], setor: dados[2], cargo: dados[3], senha: dados[4], foto: dados[5]

    server.post('/login', (req, res) => {
      let user = req.body.usuario;
      let senha = req.body.senha;
      console.log(user);
      res.end(user);
    });

let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('DB Conectado');
  });


createDB = `CREATE TABLE IF NOT EXISTS 'USERS_NORMA' (id INTEGER PRIMARY KEY, realUser TEXT, user TEXT, email TEXT, setor TEXT, cargo TEXT, senha TEXT, token TEXT, foto BLOB)`;
console.log('Tabela criada')
db.run(createDB);


//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
  console.log('Server Rodando');
});
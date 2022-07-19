const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();

server.use(express.static('.'));

//Rotas da aplicação
//Página padrão, index
server.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    server.get('/portal', (req, res) => {
      res.sendFile(__dirname + '/portal.html');
  });

let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('DB Conectado '+db.name);
  });

/*  
let teste = 'users';  
sql = `CREATE TABLE ${teste} (id INTEGER PRIMARY KEY,user TEXT, setor TEXT, cargo TEXT, senha TEXT)`;
console.log('Tabela criada')
db.run(sql);
*/

//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
  console.log('Server Rodando');
});
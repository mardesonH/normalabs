const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
var crypto = require('crypto');


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
    dados.senha = sha512(req.body.senha, gerarSalt());
    dados.senha = dados.senha.salt.concat(dados.senha.hash);
    let token = '';
    for (var i = 80; i > 0; --i) token += (Math.floor(Math.random()*256)).toString(16);
    dados.token = token;

    let realUser = req.body.usuario;
    realUser = realUser.toUpperCase();
    const data = new Date();
    let dataRegistro = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
    //console.log(dataRegistro);


    //Checar se usuário ou email já existem
    const checaNomeText = `SELECT realUser FROM USERS_NORMA WHERE realUser = '${realUser}'`;

      db.all(checaNomeText, (err, result, fields) => {
      if (err) throw err;
      function checaNome(result){
        let mesmoNome = JSON.stringify(result);
        mesmoNome = mesmoNome.length - 2;
          if (mesmoNome <= 0){
            console.log('Usuário não existe')
            const json = JSON.stringify(dados);
            console.log(dados);
            let criar = `INSERT INTO USERS_NORMA (realUser, user, email, setor, cargo, senha, token) VALUES ( '${realUser}','${req.body.usuario}','${req.body.email}','${req.body.setor}','${req.body.cargo}','${dados.senha}','${token}')`;
            db.run(criar);
            res.send(json);   
          }
          else{
            console.log('Usuário já existe')
            res.send('false')
          };
      };
      checaNome(result);
    });
  });

//Criando a criptografia para a senha
  function gerarSalt(){
    return  crypto.randomBytes(16).toString('hex');
};

function sha512(senha, salt){
  var hash = crypto.createHmac('sha512', salt); // Algoritmo de cripto sha512
  hash.update(senha);
  var hash = hash.digest('hex');
  return {
      salt,
      hash,
  };
};

//Função para autenticar a senha
function login(senhaDoLogin, saltNoBanco, hashNoBanco) {
  var senhaESalt = sha512(senhaDoLogin, saltNoBanco)
  return hashNoBanco === senhaESalt.hash;
};

  //usuario: dados[0], email: dados[1], setor: dados[2], cargo: dados[3], senha: dados[4], foto: dados[5]

    server.post('/login', (req, res) => {
      //Pegar os valores do login para buscar no banco de dados
      let user = req.body.usuario;
      let senha = req.body.senha;
      const checaLogin = `SELECT * FROM USERS_NORMA WHERE realUser = '${user}'`;
      user = user.toUpperCase();
      console.log(user);
      console.log(checaLogin);
    });


let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('DB Conectado');
  });


createDB = `CREATE TABLE IF NOT EXISTS 'USERS_NORMA' (id INTEGER PRIMARY KEY, realUser TEXT, user TEXT, email TEXT, setor TEXT, cargo TEXT, senha TEXT, token TEXT, data TEXT, foto BLOB)`;
console.log('Tabela criada')
db.run(createDB);


//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
  console.log('Server Rodando');
});
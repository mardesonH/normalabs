const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
var crypto = require('crypto');

server.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
server.use(bodyParser.json({limit: "50mb"}));
server.use(express.static('.'));


//Aponta para o banco de dados
let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('DB Conectado');
});

//Cria o banco de dados caso ele não já tenha sido inicializado
createDB = `CREATE TABLE IF NOT EXISTS 'USERS_NORMA' (id INTEGER PRIMARY KEY, realUser TEXT, user TEXT, email TEXT, setor TEXT, cargo TEXT, salt TEXT, hash TEXT, token TEXT, data TEXT, foto BLOB)`;
console.log('Tabela criada')
db.run(createDB);

//Cria o banco de dados para os chamados, caso ele não exista
createDBDesk = `CREATE TABLE IF NOT EXISTS 'CHAMADOS' (id INTEGER PRIMARY KEY, titulo TEXT, descr TEXT, user TEXT, resposta TEXT)`;
console.log('Tabela Service Desk criada')
db.run(createDBDesk);

//Rotas da aplicação
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.get('/portal', (req, res) => {
  res.sendFile(__dirname + '/portal.html');
});

server.get('/contra-cheque', (req, res) => {
  res.sendFile(__dirname + '/contra-cheque.html');
});

server.get('/cracha', (req, res) => {
  res.sendFile(__dirname + '/cracha.html');
});

server.get('/service-desk', (req, res) => {
  res.sendFile(__dirname + '/service-desk.html');
});



//Rotas Post  

//Dados para registrar o usuário
server.post('/registrar', (req, res) => {
  //Criar objeto com os dados
  let dados = new Object();
  dados.user = req.body.usuario;
  dados.email = req.body.email;
  dados.setor = req.body.setor;
  dados.cargo = req.body.cargo;
  senha = sha512(req.body.senha, gerarSalt());
  dados.salt = senha.salt;
  dados.hash = senha.hash;
  let token = '';
  for (var i = 80; i > 0; --i) token += (Math.floor(Math.random() * 256)).toString(16);
  dados.token = token;
  dados.foto = req.body.foto;

  let realUser = req.body.usuario;
  realUser = realUser.toUpperCase();
  const data = new Date();
  let dataRegistro = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
  //console.log(dataRegistro);


  //Checar se usuário ou email já existem
  const checaNomeText = `SELECT realUser FROM USERS_NORMA WHERE realUser = '${realUser}'`;

  db.all(checaNomeText, (err, result, fields) => {
    if (err) throw err;
    function checaNome(result) {
      let mesmoNome = JSON.stringify(result);
      mesmoNome = mesmoNome.length - 2;
      if (mesmoNome <= 0) {
        console.log('Usuário não existe')
        const json = JSON.stringify(dados);
        console.log(dados);
        let criar = `INSERT INTO USERS_NORMA (realUser, user, email, setor, cargo, salt, hash, token, data, foto) VALUES ( '${realUser}','${req.body.usuario}','${req.body.email}','${req.body.setor}','${req.body.cargo}','${dados.salt}','${dados.hash}','${token}','${dataRegistro}','${req.body.foto}')`;
        db.run(criar);
        res.send(json);
      }
      else {
        console.log('Usuário já existe')
        res.send('false')
      };
    };
    checaNome(result);
  });
});

//Criando a criptografia para a senha
function gerarSalt() {
  return crypto.randomBytes(16).toString('hex');
};

function sha512(senha, salt) {
  var hash = crypto.createHmac('sha512', salt); // Algoritmo de cripto sha512
  hash.update(senha);
  var hash = hash.digest('hex');
  return {
    salt,
    hash,
  };
};

//Rota para o Login
server.post('/login', (req, res) => {
  //Pegar os valores do login para buscar no banco de dados
  let userEmail = req.body.usuario;
  let senha = req.body.senha;
  let ConfirmDados = new Object();
  ConfirmDados.login = false;
  const checaLogin = `SELECT * FROM USERS_NORMA WHERE email = '${userEmail}'`;

  db.all(checaLogin, (err, result, fields) => {
    console.log(result);
    if (err) throw err;
    function validarSenha(result) {
      let dadosLogin = JSON.stringify(result);
      let loginSize = Object.keys(result).length;

      //Confirma se o Banco de Dados retornou algum valor
      if (loginSize == 0) {
        console.log('Login inválido')
        dadosLogin = false;
        res.send(dadosLogin);
      }
      else {
        //Caso o retorno seja positivo, checa de as senhas batem
        let confirmSalt = login(senha, result[0].salt, result[0].hash);
        if (confirmSalt == false) {
          console.log('Login inválido')
          dadosLogin = false;
          res.send(dadosLogin);
        }
        else {
          //Rota para confirmação do Login
          console.log('Login válido')
          console.log(result[0].user);
          res.send(dadosLogin);
        };
      }
    }
    validarSenha(result);
  });
  //Função para autenticar a senha
  function login(senhaDoLogin, saltNoBanco, hashNoBanco) {
    var senhaESalt = sha512(senhaDoLogin, saltNoBanco)
    return hashNoBanco === senhaESalt.hash;
  };
});

server.post('/dados-service', (req, res) => {
  const dadosService = `SELECT * FROM CHAMADOS`;
  db.all(dadosService, (err, result, fields) => {
  console.log(result);
  const json = JSON.stringify(result);
  console.log(json);
  res.send(json);
})
});

server.post('/fechar-chamado', (req, res) => {
  var resposta = req.body.resp;
  var idChamado = req.body.id;
  idChamado = parseInt(idChamado) + 1;
  var userLocal = req.body.user;
 console.log(idChamado);
  const consultaChamado = `SELECT * FROM CHAMADOS WHERE id = '${idChamado}'`;
  db.all(consultaChamado, (err, result, fields) => {
    let id = result[0].id;
    console.log(result);
    let user = result[0].user;
    
    checaChamado(id,resposta, user);

    function checaChamado (id, resp, user){
      console.log(id);
      console.log(resp);
      if (user != userLocal){
        
        console.log(resp);
        res.send('Não')
      }
      else{
        console.log('Iguais');
        let UpaResposta = `UPDATE CHAMADOS SET resposta =  ('${resp}'), status = 'fechado' WHERE id = ${id}`;
        db.all(UpaResposta, (err, result, fields) => {
        console.log(UpaResposta);
        res.send('Sim')
        });
      }
    }

  });


});



//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
  console.log('Server Rodando');
});
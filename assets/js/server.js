const express = require('express');
const server = express();

//Rotas da aplicação
//Página padrão, index
server.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

server.get('/bulma.css', (req, res) => {

        res.sendFile(__dirname + '/assets/css/bulma.css');
      
      });
//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
        console.log('Rodando');
    });


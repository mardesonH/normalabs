const express = require('express');
const server = express();

server.use(express.static('.'));

//Rotas da aplicação
//Página padrão, index
server.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

//Porta do localhost para iniciar o servidor
server.listen(8081, () => {
        console.log('Rodando');
    });


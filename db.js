const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db-normalabs/db-normalabs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conectado');
  });

  var selectQuery = 'SELECT * FROM users ;' /* Here users is table name */
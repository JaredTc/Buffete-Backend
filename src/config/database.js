// import {DB_HOST} from '../config';
const DB_HOST = require('../config')
let connections = {
    host: DB_HOST.DB_HOST,
    user: DB_HOST.DB_USER,
    password: DB_HOST.DB_PASSWORD,
    database: DB_HOST.DB_NAME
}


const mysql = require('mysql');

const connection = mysql.createConnection(
    {
        host: connections.host,
        user: connections.user,
        password: connections.password,
        database: connections.database
    

    }

)

connection.connect( ( error ) => {
    if (error){
        console.log('El error de conexion es: ' + error );
        return;
    }else{
        console.log('¡Conectado a la base de datos!')
    }
});

module.exports = connection;
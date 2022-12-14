let connections = {
    host: "localhost",
    user: "root",
    password: "",
    database: "buffette"
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
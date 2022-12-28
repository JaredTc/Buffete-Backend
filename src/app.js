const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');

const connection = require('./config/database');

const PORT = require('./config.js')

app.use(cors());
app.use(bodyParser.json());

//ver las tablas de las base de datos
app.get('/', (req, res) => {

    // res.send('WELCOME TO SERVER')
    connection.query("SHOW TABLES", async (err, rows) => {
        if (err) {
            res.json({ msg: err })
        }

        if (!rows) {
            return res.status(403)
        }
        else {
            res.send({
                msg: 'Query Success',
                data: rows
            })
        }
    })

})

//Validacion de inicio de sesion
app.post('/sigIn', (req, res) => {
    const n_usuario = req.body.username;
    const u_password = req.body.password
 
    connection.query('SELECT n_usuario, u_password FROM usuarios WHERE n_usuario = ? AND u_password = ?',
        [n_usuario, u_password], async (err, rows) => {
            if (err) {
                console.log(err)
            }

            if (!rows.length) {
                return res.send("Usuario y/o clave no valida");
            }
            else {
                console.log(rows)

                jwt.sign(n_usuario, 'secret_key', (err, token) => {

                    if (err) {
                        res.status(400).send({ msg: 'Error' });
                    }
                    else {
                        res.send({
                            status: 200,
                            msg: 'Succes',
                            data: {
                                user: n_usuario,
                                token: token
                            }
                        })
                    }
                    res.end();
                })

            }
        });

})

//Insertar Usuarios
app.post('/signUp', (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    connection.query('INSERT INTO usuarios SET ?', {
        n_usuario: username,
        u_password: password
    }, async (err) => {
        if (err) {
            res.send({ msg: err });
        } else {
            res.send({ msg: 'Registro Exitoso' });

        }
    })
})

//Seleccionar los tipos de datos
app.get('/tipoAsuntos', (req, res) => {
    connection.query('SELECT id_tipo_asunto, descripcion FROM tipo_asunto', (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.json(rows)
        }
    })
})

//informacion de los clientes
app.get('/clientes', (req, res) => {
    connection.query('SELECT * FROM cliente', (err, rows) => {
        if (rows == null) {
            res.status(403);
        } else {
            res.json(rows)
        }
    })
})


app.post('/abogados', (req,res) => {

    const paterno = req.body.paterno;
    const materno = req.body.materno;
    const nombre = req.body.nombre;
    const rfc = req.body.rfc;
    const cedula = req.body.cedula;
    const id_grado = req.body.id_grado;

    connection.query('INSERT INTO abogado set ? ', {
        paterno: paterno,
        materno: materno,
        nombre: nombre,
        rfc: rfc,
        cedula: cedula,
        id_grado: id_grado

    }, async (err) => {
        if (err) {
            res.send({ msg: err });
        } else {
            res.send({ msg: 'Registro Exitoso' });

        }
    })

}

)

app.get('/estudio', (req,res) => {
    connection.query("SELECT * FROM estudio", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.json(rows)
        }
    })
});

app.listen(PORT.PORT, () => console.log(`Server Enabled to ${PORT.PORT}`))
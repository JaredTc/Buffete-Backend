const connection = require('../config/database');
const jwt = require('jsonwebtoken');

const controller = {}



controller.index = (req,res) => {
    res.send('WELCOME TO SERVER HAPPY HACKING!')
 
}

controller.login = (req, res) => {
    const n_usuario = req.body.username;
    const u_password = req.body.password

    connection.query('SELECT n_usuario, u_password FROM usuarios WHERE n_usuario = ? AND u_password = ?',
        [n_usuario, u_password], async (err, rows) => {
            if (err) {
                console.log(err)
            }

            if (rows == null) {
                return res.send("Usuario y/o clave no valida");
            }
            else {
                // console.log(rows)

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

}


controller.signUp = (req, res) => {
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
}

    controller.tipoAsuntos = (req, res) => {
    connection.query('SELECT id_tipo_asunto, descripcion FROM tipo_asunto', (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })

    }


controller.clientes = (req, res) => {
    connection.query('SELECT * FROM cliente', (err, rows) => {
        if (rows == null) {
            res.status(403);
        } else {
            res.status(200).send(rows)
        }
    })
}

controller.qcliente =  (req, res) => {

    connection.query('SELECT cl.*, em.cuenta, tl.numero, fb.usuario FROM cliente cl, correo em, facebook fb, telefono tl, contacto cn WHERE cl.id_cliente = cn.id_cliente AND  em.id_contacto = cn.id_contacto AND tl.id_contacto = cn.id_contacto AND fb.id_contacto = cn.id_contacto',
        (err, rows) => {
            if (rows == null) {
                res.send()
            } else {
                res.status(200).send(rows)
            }
        })
}

controller.getAbogados = (req, res) => {
    connection.query("SELECT ab.*, et.descripcion FROM abogado ab , estudio et WHERE ab.id_grado = et.id_grado ORDER BY id_abogado ASC", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
}

module.exports = controller;
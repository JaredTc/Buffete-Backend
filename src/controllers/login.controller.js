const express = require('express');
const router = express.Router();

const connection = require('../config/database');
const jwt = require('jsonwebtoken');

router.post('/sigIn', (req, res) => {
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

})

module.exports = router;
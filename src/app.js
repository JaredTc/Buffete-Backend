const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./config/database');
const PORT = require('./config.js');
const router = require('./routes/routes')
const controller = require('./controllers/app.controller');



app.use(cors());
app.use(bodyParser.json());
router(app);
//ver las tablas de las base de datos
// app.get('/', controller.inde)

//Validacion de inicio de sesion
// app.post('/sigIn', controller.login)

//Insertar Usuarios
app.post('/signUp', controller.signUp);





// INSERT ABOGADOS
app.post('/abogados', (req, res) => {


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

// INSERT ASESORIAS
app.post('/asesorias', (req, res) => {

    const fecha = req.body.fecha;
    const tema = req.body.tema;
    const hora = req.body.hora;
    const id_asunto = req.body.id_asunto;
    const asesor = req.body.asesor;
    const asesorado = req.body.asesorado;


    try {
        connection.query('INSERT INTO asesora SET ?', {
            fecha: fecha,
            tema: tema,
            hora: hora,
            id_asunto: id_asunto,
            asesor: asesor,
            asesorado: asesorado,

        }, (err) => {
            if (err) {
                res.send({ msg: err })
            } else {
                res.status(200).send({ msg: 'Registro Exitoso' })
            }

        })
    } catch (error) {

    }

});

// INSERT AUDIENCIA
app.post('/audiencia', (req, res) => {
    const id_lugar = req.body.id_lugar;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const resolucion = req.body.resolucion;
    const id_asunto = req.body.id_asunto;


    connection.query('INSERT INTO audiencia SET ?', {
        id_lugar: id_lugar,
        fecha: fecha,
        hora: hora,
        resolucion: resolucion,
        id_asunto: id_asunto
    }, (err) => {

        if (err) {
            res.status(403)
        } else {
            res.status(200).send({ msg: 'Registro Exitoso' })
        }
    })


});


// INSERT ASUNTOS
app.post('/asunto', (req, res) => {

    const id_cliente = req.body.id_cliente;
    const id_demandado = req.body.id_demandado;
    const id_estado = req.body.id_estado;
    const id_tipo_asu = req.body.id_tipo_asu;
    const id_abogado = req.body.id_abogado;
    const F_inicio = req.body.F_inicio;
    const F_final = req.body.F_final;


    connection.query('INSERT INTO asunto SET ?', {

        id_cliente: id_cliente,
        id_demandado: id_demandado,
        id_estado: id_estado,
        id_tipo_asu: id_tipo_asu,
        id_abogado: id_abogado,
        F_inicio: F_inicio,
        F_final: F_final

    }, (err) => {
        if (err) {

            res.status(403);

        } else {

            res.status(200).send({ msg: 'Registro Exitoso' })
        }
    })


});



app.post('/demandado', (req, res) => {
    const paterno = req.body.paterno;
    const materno = req.body.materno;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const id_tipo = req.body.id_tipo;
    const razon_social = req.body.razon_social;

    connection.query('INSERT INTO demandado set ?', {
        direccion: direccion,
        id_tipo: id_tipo
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            let id_demandado = result.insertId;
            res.status(200).send({ msg: 'Registro Exitoso' });
            persona(id_demandado, paterno, materno, nombre);
            empresa(id_demandado, razon_social);


        }

    })



})

function persona(id_demandado, paterno, materno, nombre) {
    connection.query('INSERT INTO persona SET ?', {
        id_demandado: id_demandado,
        paterno: paterno,
        materno: materno,
        nombre: nombre
    }, (err) => {
        if (err) {
            throw err
        } else {
            console.log('Persona registrada')
        }
    })
}

function empresa(id_demandado, razon_social) {
    connection.query('INSERT into empresa set ?', {
        id_demandado: id_demandado,
        razon_social: razon_social
    }, (err) => {
        if (err) {
            throw err
        } else {
            console.log('Empresa registrada')
        }
    })

}


// INSERT CLIENTES
app.post('/cliente', async (req, res) => {


    const paterno = req.body.paterno;
    const materno = req.body.materno;
    const nombre = req.body.nombre;
    const CURP = req.body.CURP;
    const RFC = req.body.RFC;
    const telefono = req.body.telefono;
    const usuario = req.body.usuario;
    const cuenta = req.body.cuenta;


    connection.query('INSERT INTO cliente SET ?', {
        paterno: paterno,
        materno: materno,
        nombre: nombre,
        CURP: CURP,
        RFC: RFC
    }, (err, result, fields) => {
        if (err) {

            res.status(403);

        } else {
            let id_cliente = result.insertId
            res.status(200).send({
                msg: 'Cliente Registrado Con Exito',
                // id_cliente: result.insertId
            })
            InsertContacto(result.insertId);
            InsertarTelefono(id_cliente, telefono);
            InsertarFB(id_cliente, usuario);
            InsertarEmail(id_cliente, cuenta);
        }
    })



})

function InsertContacto(id_cliente) {

    connection.query('INSERT INTO contacto SET ?', { id_cliente }, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log('Contacto Registrado con id: ', result.insertId)

        }

    })
}


function InsertarTelefono(id_cliente, numero) {

    connection.query(`SELECT id_contacto FROM contacto WHERE id_cliente = ${id_cliente}`,
        (err, fields) => {
            if (err) {
                throw err
            } else {

                fields.forEach(fila => {

                    connection.query('INSERT INTO telefono SET ?', {
                        id_contacto: fila.id_contacto,
                        numero: numero
                    }, (err, result) => {
                        if (err) {
                            throw err
                        } else {
                            console.log(result)
                        }
                    });
                })

            }
        })
}
function InsertarFB(id_cliente, usuario) {

    connection.query(`SELECT id_contacto FROM contacto WHERE id_cliente = ${id_cliente}`, (err, fields) => {
        if (err) {
            throw err
        } else {

            fields.forEach(fila => {

                connection.query('INSERT INTO facebook SET ?', {
                    id_contacto: fila.id_contacto,
                    usuario: usuario
                }, (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        console.log(fila.id_contacto)
                    }
                });
            })

        }
    })
}
function InsertarEmail(id_cliente, cuenta) {

    connection.query(`SELECT id_contacto FROM contacto WHERE id_cliente = ${id_cliente}`, (err, fields) => {
        if (err) {
            throw err
        } else {

            fields.forEach(fila => {

                connection.query('INSERT INTO correo SET ?', {
                    id_contacto: fila.id_contacto,
                    cuenta: cuenta
                }, (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        console.log(fila.id_contacto)
                    }
                });
            })

        }
    })
}






//Seleccionar los tipos de datos
// app.get('/tipoAsuntos', (req, res) => {
//     connection.query('SELECT id_tipo_asunto, descripcion FROM tipo_asunto', (err, rows) => {
//         if (rows == null) {
//             res.status(403);
//         }
//         else {
//             res.status(200).send(rows)
//         }
//     })
// })
app.get('/tipoAsuntos', controller.tipoAsuntos);
//informacion de los clientes
app.get('/clientes', controller.clientes);
// INFORMACION ESÉCIFICA DE LOS CLIENTES
app.get('/qcliente', controller.qcliente)
// GET ABOGADOS
app.get('/abogado', controller.getAbogados)

app.get('/asesoria', (req, res) => {
    connection.query("SELECT ase.*, ab.nombre  FROM asesora ase, abogado ab WHERE ase.asesorado = ab.id_abogado", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
})
app.get('/audiencias', (req, res) => {
    connection.query("SELECT au.*, lg.descripcion FROM audiencia au, lugar lg WHERE au.id_lugar = lg.id_lugar ", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
})
app.get('/asuntos', (req, res) => {
    connection.query("SELECT * FROM asunto", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
})
// SELECT  d.id_demandado, p.nombre FROM demandado d, persona p WHERE p.id_demandado = d.id_demandado ORDER BY id_demandado ASC
app.get('/demandados', (req, res) => {
    connection.query("Select d.id_demandado, p.nombre, p.paterno, p.materno, d.direccion, t.descripcion , ep.razon_social from demandado d, persona p, tipo t , empresa ep WHERE d.id_demandado = p.id_demandado AND t.id_tipo = d.id_tipo AND ep.id_demandado = d.id_demandado ORDER BY d.id_demandado ASC", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
})


app.get('/estudio', (req, res) => {
    connection.query("SELECT * FROM estudio", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
});

app.get('/lugar', (req, res) => {
    connection.query("SELECT * FROM lugar", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
});

app.get('/estado', (req, res) => {
    connection.query("SELECT * FROM estado", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
});
app.get('/type', (req, res) => {
    connection.query("SELECT * FROM tipo_asunto", (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
});
app.get('/queryAsuntos', (req, res) => {
    connection.query(`SELECT asn.id_asunto as Asuntos, cl.nombre ,  ps.nombre as demandado, st.descripcion as estado, ta.descripcion, ab.nombre as abogado, asn.F_inicio, asn.F_final 
    FROM asunto asn , cliente cl, estado st, abogado ab, tipo_asunto ta , persona ps
   WHERE asn.id_cliente = cl.id_cliente
      AND asn.id_estado = st.id_estado
      AND asn.id_tipo_asu = ta.id_tipo_asunto
      AND asn.id_abogado = ab.id_abogado
      AND asn.id_demandado = ps.id_demandado
      `, (err, rows) => {
        if (rows == null) {
            res.status(403);
        }
        else {
            res.status(200).send(rows)
        }
    })
});

app.get('/tipo', (req, res) => {
    connection.query('SELECT * FROM tipo', (err, rows) => {
        if (err) {
            throw err
        } else {

            res.status(200).send(rows)
        }
    })
})
app.get('/empresa', (req, res) => {
    connection.query('SELECT * FROM empresa', (err, rows) => {
        if (err) {
            throw err
        } else {

            res.status(200).send(rows)
        }
    })
})



// DELETE ABOGADO
app.delete('/abogado/:id', (req, res) => {


    try {
        const id_abogado = req.params;

        connection.query('DELETE FROM abogado WHERE id_abogado = ?', [id_abogado.id], (err) => {

            if (err) {

                res.status(500)

            } else {
                res.status(200).send({ msg: 'Abogado Eliminado con exito!!!' })
            }
        })

    } catch (error) {

    }
})

// DELETE ASESORIAS
app.delete('/asesorias/:id', (req, res) => {

    try {
        const id = req.params;
        connection.query('DELETE FROM asesora WHERE id_asesoria = ?', [id.id], (err) => {
            if (err) {

                res.status(500);

            } else {

                res.status(200).send({ msg: 'Aseosria Eliminada' })
            }
        })
    } catch (error) {

    }

})

app.delete('/audiencias/:id', (req, res) => {

    try {
        const id_audiencia = req.params;

        connection.query('DELETE FROM audiencia WHERE id_audiencia = ? ', [id_audiencia.id], (err) => {

            if (err) {
                res.status(500)
            } else {

                res.status(200).send({ msg: 'Audiencia Eliminada Correctamente' })
            }
        })
    } catch (error) {

    }
})
app.delete('/asuntos/:id', (req, res) => {

    try {
        const id_asunto = req.params;


        connection.query('DELETE FROM asunto WHERE id_asunto = ? ', [id_asunto.id], (err) => {

            if (err) {
                res.status(500)
            } else {

                res.status(200).send({ msg: 'Asunto Eliminada Correctamente' })
            }
        })
    } catch (error) {

    }
})

//END POINT FOR DELETE CLIENTES
app.delete('/delete/cliente/:id', (req, res) => {


    const { id } = req.params


    connection.query('DELETE FROM cliente WHERE id_cliente = ?', [id], (e) => {
        if (e) {
            res.status(500).send({ msg: 'Error' })
        } else {
            res.status(200).send({ msg: 'Registro Eliminado con Exito' })
        }


    })

})


app.delete('/demandado/:id', (req, res) => {

    try {

        const id_persona = req.params;
        connection.query('DELETE FROM persona WHERE id_demandado = ? ', [id_persona.id], (err) => {

            if (err) {
                res.status(500)
            } else {

                res.status(200).send({ msg: 'Cliente Eliminada Correctamente' })
            }
        })
    } catch (error) {

    }
})



// UPDATE DATA

app.put('/update/abogado/:id', (req, res) => {
    const data = { paterno, materno, nombre, RFC, cedula , id_grado} = req.body;

    const id_abogado = req.params.id;


    connection.query(`
        UPDATE abogado 
        SET paterno = "${data.paterno}",
        materno = "${data.materno}",
        nombre = "${data.nombre}",
        RFC = "${data.RFC}",
        cedula = "${data.cedula}",
        id_grado = ${id_grado}
        WHERE id_abogado = ${id_abogado}`, (err, result) => {
        if (err) {
            res.status(500)
        } else {
            res.status(200).send({ msg: 'Actualizacion con Exito' });

        }
    });
})


app.put('/update/asesoria/:id', (req,res) => {

    const id = req.params.id;
    const data = {fecha, tema, hora, id_asunto, asesor,asesorado} = req.body;

   
    connection.query(`UPDATE asesora 
    SET fecha = "${data.fecha}",
    tema = "${data.tema}",
    hora = "${data.hora}",
    id_asunto = ${data.id_asunto},
    asesor = ${data.asesor},
    asesorado = ${data.asesorado}
    WHERE id_asesoria = ${id}
    
    
    `, (err) => {
        if (err) {
            res.status(500)
        } else {
            res.status(200).send({ msg: 'Actualizacion con Exito' });

        }
    });
})

app.put('/update/audiencia/:id', ( req, res ) => {

    const id = req.params.id;
    const data = { id_lugar, fecha, hora, resolucion, id_asunto } = req.body;

    connection.query(`UPDATE audiencia SET id_lugar = ${data.id_lugar},
    fecha = "${data.fecha}",
    hora = "${data.hora}",
    resolucion = "${data.resolucion}",
    id_asunto = "${id_asunto}"
    WHERE id_audiencia = ${id}
    `, (err) => {
        if (err) {
            res.status(500)
        } else {
            res.status(200).send({ msg: 'Actualizacion con Exito' });

        }
    })

});


app.put('/update/asuntos/:id', (req, res) => {
    const id = req.params.id;
    const  data = { id_cliente, id_demandado, id_estado, id_tipo_asu, id_abogado, F_inicio, F_final} = req.body;

    connection.query(`UPDATE asunto 
    SET id_cliente = ${data.id_cliente},
     id_demandado = ${data.id_demandado},
     id_estado = ${data.id_estado},
     id_tipo_asu = ${data.id_tipo_asu},
     id_abogado = ${data,id_abogado},
     F_inicio = "${data.F_inicio}",
     F_final = "${data.F_final}"
     WHERE id_asunto = ${id}
    `, (err) => {
        if (err) {
            res.status(500)
        } else {
            res.status(200).send({ msg: 'Actualizacion con Exito' });

        }
    });
});


app.put('/update/clientes/:id', ( req, res ) => {

    const id = req.params.id;
    const data = { paterno, materno, nombre, CURP , RFC } = req.body;
    
    // console.log(data);
    connection.query(`UPDATE cliente
    SET paterno = "${data.paterno}",
    materno = "${data.materno}",
    nombre = "${data.nombre}",
    CURP = "${data.CURP}",
    RFC = "${data.RFC}"
    WHERE id_cliente = ${id}`, (err) => {

        if (err) {
            res.status(500)
        } else {
            res.status(200).send({ msg: 'Actualizacion con Exito' });

        }
    })

});
app.listen(PORT.PORT, () => console.log(`Server Enabled to ${PORT.PORT}`))



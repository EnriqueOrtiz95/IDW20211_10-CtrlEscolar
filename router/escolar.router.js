const router = require("express").Router();
const mongoose = require("mongoose");
var status = require("http-status");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/scholarCtrl', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Scholar = require('../models/escolar.model.js');

module.exports = () => {
    // INSERT STUDENT
    router.post('/student', (req, res) => {
        Scholar = req.body;

        Scholar.create(scholar)
            .then((data) => {
                      console.log(data)
                      res.json({
                        code: status.OK,
                        msg: "Se insertó correctamente",
                        data: data
                            })                   
                })
            .catch((err) => {
                    res.status(status.BAD_REQUEST).json({
                      code: status.BAD_REQUEST,
                      msg: 'Ocurrió un error',
                      err: err.name,
                      default: err.message
                            } )
                })
    })
    /* Consulta gral de estudiantes */
    router.get("/", (req, res) => {
        Scholar.find({}).then((scholars) => {
                    res.json({
                        code: status.OK,
                        msg: "Consulta correcta",
                        data: scholars
                    })
                })
            .catch((err) => {
                    res.status(status.BAD_REQUEST).json({
                            code: status.BAD_REQUEST,
                            msg: "Error de peticion",
                            err: err.name,
                            detail: err.message
                        })
                })
    })
    /* Eliminar estudiante por número de control */
    router.delete('/:id', (req, res) => {
        id = req.params.id;
        Scholar.findByIdAndRemove(id).then((data) => {
                    if(data)
                        res.json({
                            code: status.OK,
                            msg: "Eliminado correctamente",
                            data: data
                        })
                    else 
                        res.status(status.NOT_FOUND)
                        .json({
                            code: status.NOT_FOUND,
                            msg: "Estudiante no encontrado"
                        })
                }
            )
            .catch((err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: "Error en la petición",
                            err: err.name,
                            detail: err.message
                        })
                })
    })

    /* Consulta un estudiante por número de control */
    router.get('/:id', (req, res) => {

        const id = req.params.id;

        Scholar.findOne({ _id: id })
            .then((scholar) => {
                    if (scholar)
                        res.json({
                            code: status.OK,
                            msg: "Consulta correcta",
                            data: scholar
                        })
                    else
                        res.status(status.NOT_FOUND).json({
                                code: status.NOT_FOUND,
                                msg: "Elemento no encontrado"
                            })
                } )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

    /*Actualizar la calificación de un estudiante*/
    router.put('/:id', (req, res) => {
        id = req.params.id;
        scholar = req.body;
        Scholar.findByIdAndUpdate(id, scholar, { new: true })
            .then(
                (data) => {
                    console.log(data);
                    res.json({
                        code: status.OK,
                        msg: "Se actualizó correctamente",
                        data: data
                    });
                }
            )
            .catch((err) => {
                    console.log(err);
                    res.status(status.BAD_REQUEST);
                    res.json({
                        code: status.BAD_REQUEST,
                        msg: "Error en la petición",
                        err: err.name,
                        detail: err.message
                    })
                })})
    
    /* Estadística de estudiantes hombres y mujeres por carrera */
    router.post("/gender/", (req, res) => {
        Scholar.find({})
          .then((data) => {
            iscH = 0;
            iscM = 0;
            //ISC H o M
            imH = 0;
            imM = 0;
            //IM H o M
            igeH = 0;
            igeM = 0;
            //IGE H o M
            icH = 0;
            icM = 0;
            //IC H o M
    
            //for male/females careers
            data.forEach((scholar, i) => {
              if (data[i].career === "ISC") {
                data[i].curp.charAt(10) == "H" ? iscH++ : iscM++
              }
              if (data[i].career === "IM") {
                data[i].curp.charAt(10) == "H" ? imH++ : imM++
              }
              if (data[i].career === "IGE") {
                data[i].curp.charAt(10) == "H" ? igeH++ : igeM++
              }
              if (data[i].career === "IC") {
                data[i].curp.charAt(10) == "H" ? icH++ : icM++
              }
            })    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Hombres: " + iscH, "Mujeres: " + iscM]],
                ["IM", ["Hombres: " + imH, "Mujeres: " + imM]],
                ["IGE", ["Hombres: " + igeH, "Mujeres: " + igeM]],
                ["IC", ["Hombres: " + icH, "Mujeres: " + icM]],
              ],
            })})
          .catch((err) => {
            res.status(status.BAD_REQUEST)
            .json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      })
    
    /**Estadística de estudiantes foráneos por carrera */  
    router.post("/foreign/", (req, res) => {
        Scholar.find({})
          .then((data) => {
            iscF = 0
            imF = 0
            igeF = 0
            icF = 0

            //for foreigns
            data.forEach((scholar, i) => {
              if (data[i].career === "ISC") {
                //a traves del curp sabremos si es o no foraneo
                data[i].curp.substr(11,2) != "NT" ? iscF++ : 0
              }
              if (data[i].career === "IM") {
                data[i].curp.substr(11,2) != "NT" ? imF++ : 0
              }
              if (data[i].career === "IGE") {
                data[i].curp.substr(11,2) != "NT" ? igeF++ : 0
              }
              if (data[i].career === "IC") {
                data[i].curp.substr(11,2) != "NT" ? icF++ : 0
              }})
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Foraneos: " + iscF]],
                ["IM", ["Foraneos: " + icF]],
                ["IGE", ["Foraneos: " + igeF]],
                ["IC", ["Foraneos: " + imF]],
              ],
            })})
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          }) })

    /**Estadística de estudiantes aprobados y no aprobados por carrera*/
    router.post("/aprovedifnot/", (req, res) => {
        Scholar.find({})
          .then((data) => {
            //A=aproveds;R=reprobados
            iscA = 0
            iscR = 0
            imA = 0
            imR = 0
            igeA = 0
            igeR = 0
            icA = 0
            icR = 0
    
            //for resultados
            data.forEach((escolar, i) => {
              if (data[i].career === "ISC") {
                data[i].grade >= 70 ? iscA++ : iscR++
              }
              if (data[i].career === "IM") {
                data[i].grade >= 70 ? imA++ : imR++
              }
              if (data[i].career === "IGE") {
                data[i].grade >= 70 ? igeA++ : igeR++
              }
              if (data[i].career === "IC") {
                data[i].grade >= 70 ? icA++ : icR++
              }
            });
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["Aprobados: " + iscA, "Reprobados: " + iscR]],
                ["IM", ["Aprobados: " + iscA, "Reprobados: " + imR]],
                ["IGE", ["Aprobados: " + iscA, "Reprobados: " + igeR]],
                ["IC", ["Aprobados: " + iscA, "Reprobados: " + icR]],
              ],
            })  })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      })
    
    /**Estadística de estudiantes mayores y menores de edad por carrera */
    
    /* 
    router.post("/mayormenoredad/", (req, res) => {
      Scholar.find({})
        .then((data) => {
  
          stMen = 0
          stMay = 0
          //for resultados mayor/menor
          data.forEach((scholar, i) => {
            if (data[i].curp === "ISC") {
              data[i].curp.substr(6,2) >= "01" ? stMay++ : stMen++
            }
            if (data[i].career === "IM") {
              data[i].curp.substr(6,2) >= "01" ? stMay++ : stMen++
            }
            if (data[i].career === "IGE") {
              data[i].curp.substr(6,2) >= "01" ? stMay++ : stMen++
            }
            if (data[i].career === "IC") {
              data[i].curp.substr(6,2) >= "01" ? stMay++ : stMen++
            }
          });
  
          res.json({
            code: status.OK,
            msg: "Consulta correcta",
            data: [
              ["ISC", ["Mayores: " + stMay, "Menores: " + stMen]],
              ["IM", ["Mayores: " + stMay, "Menores: " + stMen]],
              ["IGE", ["Mayores: " + stMay, "Menores: " + stMen]],
              ["IC", ["Mayores: " + stMay, "Menores: " + stMen]],
            ],
          })  })
        .catch((err) => {
          res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            msg: "Error en la petición",
            err: err.name,
            detail: err.message,
          })
        })
    })

    */

    return router;
}
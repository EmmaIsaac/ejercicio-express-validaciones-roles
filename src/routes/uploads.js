const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarArchivo } = require("../middlewares/validar-archivo");
const { cargarArchivo, actualizarImagen } = require("../controllers/uploads");

const { coleccionesPermitidas } = require("../helpers/db-validators");

const router = Router();

router.post("/", validarArchivo, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "No es un ID válido").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagen
);

module.exports = router;

const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const coleccionesPermitidas = ["usuarios", "categorias", "productos"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE si es un ID válido

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);

    return res.json({ results: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({ results: usuarios });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE si es un ID válido

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);

    return res.json({ results: categoria ? [categoria] : [] });
  }

  const regex = new RegExp(termino, "i");

  const categorias = await Categoria.find({
    $or: [{ nombre: regex }, { estado: true }],
  });
  res.json({ results: categorias });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); // TRUE si es un ID válido

  if (esMongoID) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );

    return res.json({ results: producto ? [producto] : [] });
  }

  const regex = new RegExp(termino, "i");

  const productos = await Producto.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  }).populate("categoria", "nombre");

  res.json({ results: productos });
};
const buscar = (req, res = response) => {
  try {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
      res.status(400).json({
        msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
      });
    }

    switch (coleccion) {
      case "usuarios":
        buscarUsuarios(termino, res);
        break;
      case "categorias":
        buscarCategorias(termino, res);
        break;
      case "productos":
        buscarProductos(termino, res);
        break;

      default:
        res.status(500).json({
          msg: "Se me olvidó hacer esta búsqueda",
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { buscar };

const { response } = require("express");
const Categoria = require("../models/categoria");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre"),
    ]);

    res.json({ total, categorias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req, res = response) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate(
      "usuario",
      "nombre"
    );

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearCategoria = async (req, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoriaDB.nombre}, ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
    };

    const categoria = new Categoria(data);

    //Guardar en BD
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualizarCategoria
const actualizarCategoria = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// borrarCategoria
const borrarCategoria = async (req, res = response) => {
  try {
    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json(categoriaBorrada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};

const { response } = require("express");
const Producto = require("../models/producto");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre")
        .populate("categoria", "nombre"),
    ]);

    res.json({ total, productos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtenerProducto - populate {}
const obtenerProducto = async (req, res = response) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre");

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearProducto = async (req, res = response) => {
  try {
    const { estado, usuario, disponible, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe`,
      });
    }

    //Generar la data a guardar
    const data = {
      nombre: body.nombre.toUpperCase(),
      precio: body.precio,
      categoria: body.categoria,
      descripcion: body.descripcion,
      img: body.img,
      usuario: req.usuario._id,
    };

    const producto = new Producto(data);

    //Guardar en BD
    await producto.save();

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// actualizarProducto
const actualizarProducto = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// borrarProducto
const borrarProducto = async (req, res = response) => {
  try {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.json(productoBorrado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};

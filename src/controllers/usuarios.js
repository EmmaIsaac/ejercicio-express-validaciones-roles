const { response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;

    //estado en true para filtrar los inactivos

    // const usuarios = await Usuario.find({ estado: true })
    //   .skip(Number(desde))
    //   .limit(Number(limite));

    // const total = await Usuario.countDocuments({ estado: true });

    //Otra forma de hacerlo para que las promesas se ejecuten de manera paralela
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments({ estado: true }),
      Usuario.find({ estado: true }).skip(Number(desde)).limit(Number(limite)),
    ]);

    res.json({ total, usuarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const usuariosPost = async (req, res = response) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña. Por defecto esta en 10
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar en BD
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const usuariosPut = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    if (password) {
      //Encriptar la contraseña. Por defecto esta en 10
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const usuariosPatch = (req, res = response) => {
  res.json({ msg: "patch API - controlador" });
};

const usuariosDelete = async (req, res = response) => {
  try {
    const { id } = req.params;

    //borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    //borrado logico: dejo el objeto inactivo, pero no los elimino de la BD
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};

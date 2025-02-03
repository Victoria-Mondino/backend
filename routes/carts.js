const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsPath = './data/carts.json';

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = { id: Date.now(), products: req.body.products || [] };
  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err);
    const carts = JSON.parse(data);
    carts.push(newCart);
    fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(newCart);
    });
  });
});

// Ver los productos de un carrito
router.get('/:cid', (req, res) => {
  const cid = parseInt(req.params.cid);
  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err);
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart.products);
  });
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const quantity = 1; // Por defecto, se agrega 1 producto

  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err);
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), (err) => {
      if (err) return res.status(500).send(err);
      res.status(201).json(cart.products);
    });
  });
});

module.exports = router;

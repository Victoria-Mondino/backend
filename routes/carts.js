// cart.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const cartsPath = path.join(__dirname, '..', 'data', 'carts.json');

// POST: Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = parseInt(req.params.pid);

  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err);
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);

    if (!cart) return res.status(404).send('Carrito no encontrado');

    fs.readFile(productsPath, 'utf8', (err, data) => {
      if (err) return res.status(500).send(err);
      const products = JSON.parse(data);

      const product = products.find(p => p.id === pid);
      if (!product) return res.status(404).send('Producto no encontrado');

      const existingProduct = cart.products.find(p => p.product === pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), err => {
        if (err) return res.status(500).send(err);
        res.status(201).json(cart.products);
      });
    });
  });
});

module.exports = router;

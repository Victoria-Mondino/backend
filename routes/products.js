// products.js (dentro de routes)
const express = require('express');
const fs = require('fs');
const router = express.Router();

const productsPath = './data/products.json';

// GET para obtener un producto por ID
router.get('/:id', (req, res) => {
  const productId = req.params.id;

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err);
    const products = JSON.parse(data);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }

    res.status(200).json(product);
  });
});

module.exports = router;


// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const productsPath = path.join(__dirname, 'data', 'products.json');
const cartsPath = path.join(__dirname, 'data', 'carts.json');

// GET: Listar todos los productos
app.get('/api/products', (req, res) => {
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer productos.' });
    res.json(JSON.parse(data));
  });
});

// GET: Obtener producto por ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer productos.' });
    const products = JSON.parse(data);
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  });
});

// POST: Agregar un producto a un carrito
app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = parseInt(req.params.pid);

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer productos.' });
    const products = JSON.parse(data);
    const product = products.find(p => p.id === pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    fs.readFile(cartsPath, 'utf8', (err, cartData) => {
      if (err) return res.status(500).json({ message: 'Error al leer carritos.' });

      let carts = JSON.parse(cartData);
      const cart = carts.find(c => c.id === cid);
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

      const existingProduct = cart.products.find(p => p.product === pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), err => {
        if (err) return res.status(500).json({ message: 'Error al actualizar carrito.' });
        res.status(201).json(cart.products);
      });
    });
  });
});

// POST: Crear un carrito
app.post('/api/carts', (req, res) => {
  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer carritos.' });
    const carts = JSON.parse(data);
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), err => {
      if (err) return res.status(500).json({ message: 'Error al crear carrito.' });
      res.status(201).json(newCart);
    });
  });
});

// GET: Ver productos de un carrito
app.get('/api/carts/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile(cartsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer carritos.' });
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart.products);
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

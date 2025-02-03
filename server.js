// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware para manejar JSON en el body
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  const productsPath = path.join(__dirname, 'data', 'products.json');  // Ruta actualizada

  // Verificar si el archivo products.json existe
  fs.access(productsPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Archivo de productos no encontrado.' });
    }

    fs.readFile(productsPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      const products = JSON.parse(data);
      res.json(products);
    });
  });
});

// Ruta para obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productsPath = path.join(__dirname, 'data', 'products.json');  // Ruta actualizada

  // Verificar si el archivo products.json existe
  fs.access(productsPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Archivo de productos no encontrado.' });
    }

    fs.readFile(productsPath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }
      const products = JSON.parse(data);
      const product = products.find(p => p.id === productId);

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json(product);
    });
  });
});

// Ruta para agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  const productsPath = path.join(__dirname, 'data', 'products.json');  // Ruta actualizada

  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const products = JSON.parse(data);

    // Generar un id único para el nuevo producto
    newProduct.id = (products.length ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1).toString();
    
    products.push(newProduct);

    fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(newProduct);
    });
  });
});

// Iniciar el servidor en el puerto 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

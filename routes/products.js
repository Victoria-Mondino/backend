const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsPath = './data/products.json';

// GET: Obtener todos los productos
router.get('/', (req, res) => {
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer productos.');
        const products = JSON.parse(data);
        res.json(products);
    });
});

// GET: Obtener un producto por ID
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer productos.');
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.json(product);
    });
});

// POST: Crear un nuevo producto
router.post('/', (req, res) => {
    const newProduct = req.body;
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer productos.');
        const products = JSON.parse(data);
        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1; // Asignar nuevo ID
        products.push(newProduct);
        fs.writeFile(productsPath, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send('Error al guardar producto.');
            res.status(201).json(newProduct);
        });
    });
});

// PUT: Actualizar un producto por ID
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer productos.');
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) return res.status(404).send('Producto no encontrado');

        products[productIndex] = { ...products[productIndex], ...req.body }; // Actualizar producto
        fs.writeFile(productsPath, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).send('Error al actualizar producto.');
            res.status(200).json(products[productIndex]);
        });
    });
});

// DELETE: Eliminar un producto por ID
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer productos.');
        let products = JSON.parse(data);
        const newProducts = products.filter(p => p.id !== productId);

        if (products.length === newProducts.length) return res.status(404).send('Producto no encontrado');

        fs.writeFile(productsPath, JSON.stringify(newProducts, null, 2), err => {
            if (err) return res.status(500).send('Error al eliminar producto.');
            res.status(204).send();
        });
    });
});

module.exports = router;

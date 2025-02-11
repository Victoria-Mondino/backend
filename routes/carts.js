const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsPath = './data/carts.json';

// POST: Crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = { id: Date.now().toString(), products: [] };
    fs.readFile(cartsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer carritos.');
        const carts = JSON.parse(data);
        carts.push(newCart);
        fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), err => {
            if (err) return res.status(500).send('Error al guardar carrito.');
            res.status(201).json(newCart);
        });
    });
});

// POST: Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid); // Asegúrate de que esto sea un número

    fs.readFile(cartsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer carritos.');
        let carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.id === pid);
        if (productIndex === -1) {
            cart.products.push({ id: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }

        fs.writeFile(cartsPath, JSON.stringify(carts, null, 2), err => {
            if (err) return res.status(500).send('Error al actualizar carrito.');
            res.status(200).json(cart);
        });
    });
});



// GET: Ver productos de un carrito
router.get('/:cid', (req, res) => {
    const cid = req.params.cid; // Este debe ser tratado como string ya que el id en carts.json es string
    fs.readFile(cartsPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer carritos.');
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cid); // Comparar el id del carrito
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.json(cart); // Devolver el carrito encontrado
    });
});



module.exports = router;

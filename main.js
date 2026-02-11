const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- IN-MEMORY DATABASE (Array) ---
let products = [
    { id: 1, name: 'Gaming Laptop', price: 1200 },
    { id: 2, name: 'Wireless Mouse', price: 45 },
    { id: 3, name: 'Mechanical Keyboard', price: 85 }
];

// --- ROUTES ---

// 1. GET /products (Show all items)
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. GET /products/:id (Show one item)
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// 3. POST /products (Add new item)
app.post('/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
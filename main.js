require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- DATABASE CONNECTION ---
// Connect to MongoDB using the string from your .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// --- SCHEMA & MODEL ---
// Define the structure of a Product
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
    // Note: MongoDB creates a unique '_id' automatically, so we don't need to define 'id'
});

// Create the Model (this is what allows us to run queries)
const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---

// 1. GET /products (Show all items)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all docs from DB
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET /products/:id (Show one item)
app.get('/products/:id', async (req, res) => {
    try {
        // Mongoose uses _id (an ObjectId), not a simple integer 'id'
        const product = await Product.findById(req.params.id);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        // If the ID format is invalid (not a Mongo ObjectId), return 404 or 400
        res.status(500).json({ message: "Invalid ID format or Server Error" });
    }
});

// 3. POST /products (Add new item)
app.post('/products', async (req, res) => {
    // Create a new product instance
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        // Save to the database
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
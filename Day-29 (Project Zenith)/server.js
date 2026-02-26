const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json()); 
app.use(express.static('public')); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;
async function connectDB() {
    await client.connect();
    db = client.db('zenith_cms');
    console.log('Connected to Cloud Database');
}
connectDB();

app.get('/api/posts', async (req, res) => {
    const posts = await db.collection('blogs').find().toArray();
    res.json(posts);
});

app.post('/api/posts', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = { title, content, author, date: new Date() };
    await db.collection('blogs').insertOne(newPost);
    res.status(201).json({ message: 'Post Created!' });
});
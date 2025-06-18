// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const auth = require('../middleware/auth');
// const Book = require('../models/Book');
// const router = express.Router();

// // Configuration de Multer pour le stockage des images
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Recherche de livres
// router.get('/search', async (req, res) => {
//   const { query, level, condition } = req.query;
//   const filters = {};

//   if (query) filters.title = new RegExp(query, 'i');
//   if (level && level !== 'Tous') filters.level = level;
//   if (condition && condition !== 'Tous') filters.condition = condition;

//   try {
//     const books = await Book.find(filters).populate('owner', 'name');
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// // Ajout d’un livre
// router.post('/add', auth, upload.single('image'), async (req, res) => {
//   const { title, level, condition, author } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
// // Pour Cloudinary, installer le package 'cloudinary' et configurer :
// // const cloudinary = require('cloudinary').v2;
// // cloudinary.config({ cloud_name: '...', api_key: '...', api_secret: '...' });
// // const result = await cloudinary.uploader.upload(req.file.path);
// // const imageUrl = result.secure_url;

//   try {
//     const book = new Book({
//       title,
//       author,
//       level,
//       condition,
//       imageUrl,
//       owner: req.user.userId,
//     });

//     await book.save();
//     res.status(201).json({ success: true, book });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

// module.exports = router;





const express = require('express');
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const router = express.Router();

// Recherche de livres
router.get('/search', async (req, res) => {
  const { query, level, condition } = req.query;
  const filters = {};

  if (query) filters.title = new RegExp(query, 'i');
  if (level && level !== 'Tous') filters.level = level;
  if (condition && condition !== 'Tous') filters.condition = condition;

  try {
    const books = await Book.find(filters).populate('owner', 'name');
    res.status(200).json(books);
    console.log('Books retrieved successfully');
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajout d’un livre
router.post('/add', auth, async (req, res) => {
  const { title, level, condition, author, imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'URL de l’image requise' });
  }

  try {
    const book = new Book({
      title,
      author,
      level,
      condition,
      imageUrl,
      owner: req.user.userId,
    });

    await book.save();
    res.status(201).json({ success: true, book });
    console.log('Book added successfully:', book.title);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
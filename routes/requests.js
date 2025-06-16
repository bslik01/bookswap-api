const express = require('express');
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const Book = require('../models/Book');
const router = express.Router();

// Création d’une demande
router.post('/create', auth, async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const request = new Request({
      userId: req.user.userId,
      bookId,
      status: 'pending',
    });

    await request.save();
    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
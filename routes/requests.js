const express = require('express');
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const Book = require('../models/Book');
const User = require('../models/User');
const admin = require('firebase-admin');
const router = express.Router();

// Initialiser Firebase Admin
const serviceAccount = require('../bookswap-v1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Création d’une demande
router.post('/create', auth, async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId).populate('owner');
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const request = new Request({
      userId: req.user.userId,
      bookId,
      status: 'pending',
    });

    await request.save();

    // Envoyer une notification au propriétaire
    const owner = await User.findById(book.owner._id);
    if (owner.fcmToken) {
      const message = {
        notification: {
          title: 'Nouvelle demande',
          body: `Quelqu’un est intéressé par votre livre "${book.title}"`,
        },
        token: owner.fcmToken,
      };
      await admin.messaging().send(message);
    }

    res.status(201).json({ success: true, request });
    console.log('Demande créée avec succès pour le livre:', book.title);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;

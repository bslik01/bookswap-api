const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

const FeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Soumettre un commentaire
router.post('/submit', auth, async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: 'Commentaire requis' });
  }

  try {
    const feedbackEntry = new Feedback({
      userId: req.user.userId,
      feedback,
    });
    await feedbackEntry.save();
    res.status(201).json({ success: true, message: 'Commentaire envoyé' });
    console.log('Commentaire soumis avec succès');
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
const express = require('express');
const auth = require('../middleware/auth');
const Supply = require('../models/Supply');
const router = express.Router();

// Liste des fournitures
router.get('/list', async (req, res) => {
  const { type } = req.query;
  const filters = {};

  if (type && type !== 'Tous') filters.type = type;

  try {
    const supplies = await Supply.find(filters);
    res.status(200).json(supplies);
    console.log('Fournitures récupérées avec succès');
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Contacter un fournisseur
router.post('/contact', auth, async (req, res) => {
  const { itemId } = req.body;

  try {
    const supply = await Supply.findById(itemId);
    if (!supply) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Logique pour contacter le fournisseur (ex. envoyer un email ou notification)
    // Pour cet exemple, on retourne une réponse simple
    res.status(200).json({ success: true, message: 'Demande de contact envoyée' });
    console.log('Demande de contact envoyée pour l’article:', supply.name);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Mettre à jour le profil
router.put('/profile', auth, async (req, res) => {
  const { name, phone, address, level } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.level = level || user.level;

    await user.save();
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        level: user.level,
      },
      token,
    });
    console.log('Profil mis à jour avec succès pour l’utilisateur:', user.name);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Sauvegarder le token FCM
router.post('/fcm-token', auth, async (req, res) => {
  const { fcmToken } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    user.fcmToken = fcmToken;
    await user.save();
    res.status(200).json({ success: true });
    console.log('FCM token saved successfully');
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
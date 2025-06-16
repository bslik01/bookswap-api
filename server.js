const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const requestRoutes = require('./routes/requests');
const supplyRoutes = require('./routes/supplies');
const path = require('path');
const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/requests', requestRoutes);
app.use('/supplies', supplyRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur', details: err.message });
});

// Route pour vérifier l'état du serveur
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialisation des données (exemple)
  initializeData();
});

// Fonction pour initialiser des données de test
// async function initializeData() {
//   const Supply = require('./models/Supply');
//   const User = require('./models/User');
//   try {
//     const supplyCount = await Supply.countDocuments();
//     const userCount = await User.countDocuments();
//     if (supplyCount === 0) {
//       await Supply.insertMany([
//         { name: 'Cahier A4', e: 'Cahiers', supplier: 'Fournisseur A' },
//         { name: 'Stylo bleu', type: 'Stylos', supplier: 'Fournisseur B' },
//         { name: 'Sac à dos', type: 'Sacs', supplier: 'Fournisseur C' },
//       ]);
//       console.log('Données de fournitures initialisées');
//     }
//       // {
//       //   "name": "Charlie",
//       //   "email": "charlie@example.com",
//       //   "password": "password123",
//       //   "phone": "123-456-7890",
//       //   "address": "123 Main St",
//       //   "level": "Seconde"
//       // },
//       // {
//       //   "name": "Diana",
//       //   "email": "diana@example.com",
//       //   "password": "password123",
//       //   "phone": "987-654-3210",
//       //   "address": "456 Elm St",
//       //   "level": "Terminal"
//       // }
//   } catch (error) {
//     console.error('Erreur lors de l’initialisation des données:', error);
//   }
// }
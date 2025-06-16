const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Cahiers', 'Stylos', 'Sacs', 'Autres'] },
  supplier: { type: String, required: true },
});

module.exports = mongoose.model('Supply', supplySchema);
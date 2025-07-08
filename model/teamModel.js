const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String, // Project name
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  members: [
    {
      invitedEmail: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // after confirmation
      status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
    }
  ],
});


module.exports = mongoose.model('Team', teamSchema);

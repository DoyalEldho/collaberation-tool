const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String ,
 } ,{ _id: false } // prevent extra _id in each history item
);

const subtaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  assignedTo:{ type: String },
   status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },
  comments: [
  {
    email: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }
],
   history: [historySchema], 
});



const taskSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  projectName: String, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subtasks: [subtaskSchema], // Multiple subtasks within one task 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);

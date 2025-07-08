const Team = require('../model/teamModel');
const Task = require('../model/taskModel')
const userModel=require('../model/userModel')
const express = require('express');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config(); 


const BASE_URL = process.env.BASE_URL;

//sending
exports.createTeamAndSendInvites = async (req, res) => {
  const { name, emails } = req.body;
  const adminId = req.user.id;

  try {
    const members = emails.map(email => ({ invitedEmail: email }));
    const team = await Team.create({ name, admin: adminId, members });

    for (let email of emails) {
      const token = jwt.sign({ teamId: team._id, email }, process.env.JWT_SECRET, { expiresIn: '2d' });
      const link = `${BASE_URL}/api/team/confirm?token=${token}`;

      const html = `
        <div style="font-family: Arial, sans-serif;">
          <h2>You’ve been invited to join the team: <b>${name}</b></h2>
          <p>Please login and click the button below to confirm your invitation:</p>
          <a href="${link}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          ">
            Accept Invitation
          </a>
          <p style="margin-top: 20px;">This invitation will expire in 2 days.</p>
        </div>
      `;

      await sendEmail(email, `Invitation to join ${name}`, html);
    }

    res.json({ message: 'Invites sent!' });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};


//confirmation
exports.confirmInvite = async (req, res) => {
  const token  = req.query.token; //extract token part

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    //we are passing email and teamId from jwt
    const { teamId, email } = jwt.verify(token, process.env.JWT_SECRET);
    const team = await Team.findById(teamId);

    const member = team.members.find(m => m.invitedEmail === email);
    if (!member) return res.status(404).json({ error: 'Invite not found' });

    //link user._id using userModel and email from token
    const user = await userModel.findOne({ email });  
    if (!user) return res.status(404).json({ error: 'User not registered' });

    member.user = user._id;
    member.status = 'confirmed';
    await team.save();

  res.send(`
  <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
    <h2 style="color: #4CAF50;">Congratulations!</h2>
    <p>You have successfully joined the team <strong>${team.name}</strong>.</p>
  </div>
`);


  } catch (err) {
    console.log(err);
    
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

//my teams
exports.getTeam = async(req,res)=>{
  
    try {
        const team = await Team.find({admin:req.user.id});
        
    if (!team || team.length === 0) {
      return res.status(404).json({ message: 'No teams found for this admin' });
    }
        const teamData = team.map(team => {
      const confirmedMembers = team.members.filter(member => member.status === 'confirmed');
      const invitedEmails = confirmedMembers.map(member => member.invitedEmail);
      
      return {
        teamName: team.name,
        invitedEmails: invitedEmails,
      };
    });

    // console.log(teamData);
    
    res.json({ teams: teamData });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//delete team memebrs

exports.delTeam = async(req,res)=>{
  
  const {email,teamName} = req.body ;
  try {

    const team = await Team.findOne({name:teamName});
     if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    } 
    const delMember = team.members.filter(res=>res.invitedEmail!==email);
    
    //delMember returns a new array and updating that array to team array
     team.members = delMember
    await team.save();
      res.json({message:"deleted"});
    
  } catch (error) {
    console.log(error);
      res.status(500).json({ error: error.message });
  }
}

exports.createTask = async (req, res) => {
  const { projectName, subtasks } = req.body;

  try {
    const team = await Team.findOne({ name: projectName });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const newTask = new Task({
      team: team._id,
      projectName,
      createdBy:req.user.id,
      subtasks
    });

    await newTask.save();

    res.status(201).json({ message: 'Task with subtasks created', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


//All Tasks created
exports.getAllTasks = async(req,res)=>{

  try {
   
    const userId = req.user.id;
    const userEmail = req.user.email;

    const tasks = await Task.find({
      $or:[{createdBy:userId }, {"subtasks.assignedTo":userEmail }]  //nested so use ""
    })
    
        res.json(tasks);
 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

exports.dragAndDropTask =async(req,res)=>{

 try {
   
   const taskId = req.params.id; 
    const userEmail = req.user.email;

    const tasks = await Task.findById(taskId)

    const data = tasks.subtasks;
 
        res.json(data);
 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}




exports.kambanStyleDashboord = async (req, res) => {
  const { subtaskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findOne({ "subtasks._id": subtaskId });

    if (!task) {
      return res.status(404).json({ error: 'Parent task not found' });
    }
    const subtask = task.subtasks.id(subtaskId);

    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    subtask.status = status;

    await task.save();

    res.status(200).json({ message: 'Subtask status updated successfully', subtask });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.commentbox = async (req, res) => {
  const { subtaskId } = req.params;
  const { text, email } = req.body;
  
  if (!text || !email) {
    return res.status(400).json({ message: 'Text and email required' });
  }

  try {
    const task = await Task.findOne({ "subtasks._id": subtaskId });
    if (!task) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found in task' });
    }

    // Add the comment
    subtask.comments = subtask.comments || [];
    subtask.comments.push({ text, email });

    await task.save(); // Save the parent document

    res.status(200).json({ subtask });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// gantt chart
  exports.ganttChart = async (req, res) => {
  try {
     
    
     const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    // console.log(task);
    // const subtask = Task.subtasks;
    res.json(task)
    
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

//get all tasks to admin
exports.taskList = async(req,res)=>{
  try {
    
       const task = await Task.find({createdBy:req.user.id});
    if (!task) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.allEmail = async(req,res)=>{
  try {
      const task = await Task.find({createdBy:req.user.id});
    if (!task) {
      return res.status(404).json({ message: 'Subtask not found' });
    }
       const emails = task.flatMap(task => 
      task.subtasks.map(sub => sub.assignedTo)
    );
   
    // Remove duplicates using Set
    const uniqueEmails = [...new Set(emails)];

    res.json(uniqueEmails);

  } catch (error) {
        res.status(500).json({ message: 'Server error' });
  }
}

exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, assignedTo } = req.body;

  try {
    const task = await Task.findOne({ "subtasks._id": id });

    if (!task) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    const subtask = task.subtasks.id(id);
    const changes = [];

    if (title !== undefined && title !== subtask.title) {
      changes.push({ field: 'title', oldValue: subtask.title, newValue: title });
      subtask.title = title;
    }

    if (description !== undefined && description !== subtask.description) {
      changes.push({ field: 'description', oldValue: subtask.description, newValue: description });
      subtask.description = description;
    }

    if (dueDate !== undefined && new Date(dueDate).toISOString() !== subtask.dueDate?.toISOString()) {
      changes.push({ field: 'dueDate', oldValue: subtask.dueDate, newValue: dueDate });
      subtask.dueDate = dueDate;
    }

    if (assignedTo !== undefined && assignedTo !== subtask.assignedTo) {
      changes.push({ field: 'assignedTo', oldValue: subtask.assignedTo, newValue: assignedTo });
      subtask.assignedTo = assignedTo;
    }

    // Save change logs
    changes.forEach(change => {
      subtask.history.push({
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        updatedAt: new Date(),
        updatedBy: req.user?.email || 'admin' 
      });
    });
    await task.save();
    res.json({ message: "Subtask updated successfully", subtask });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//delete task
exports.deleteTeam=async(req,res)=>{
   const { id } = req.params;

  try {

    const task = await Task.findOne({ "subtasks._id": id });

    if (!task) {
      return res.status(404).json({ message: "Subtask not found" });
    }
    //find subtask id
    task.subtasks.id(id).remove();
    await task.save();

    res.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//activity log
exports.activityLog = async(req,res)=>{
   const  id = req.params.id;

  try {

    const task = await Task.findById(id);
  
    if (!task) {
      return res.status(404).json({ message: "Subtask not found" });
    }
 
     const subtask = task.subtasks.flatMap(res=>res.history);
     res.json(subtask)
   
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ message: "Server error" });
  }
}
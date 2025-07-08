const express = require('express');
const { createTeamAndSendInvites, confirmInvite, getTeam, delTeam, createTask, getAllTasks, dragAndDropTask, kambanStyleDashboord, commentbox, ganttChart, taskList, allEmail, editTask, deleteTeam, activityLog } = require('../controller/teamController');
const teamRouter =express.Router();
const auth = require('../middleware/auth');

teamRouter.post('/api/send',auth,createTeamAndSendInvites);  
teamRouter.get('/api/team/confirm',confirmInvite);  
teamRouter.get('/api/team/members',auth,getTeam)
teamRouter.delete('/api/cancel/members',auth,delTeam);
teamRouter.post('/api/create/task',auth,createTask)
teamRouter.get('/api/tasks',auth,getAllTasks);
teamRouter.get('/api/my/projects/:id',auth,dragAndDropTask)
teamRouter.put('/tasks/:taskId/subtask/:subtaskId', auth, kambanStyleDashboord);
teamRouter.post('/api/subtasks/:subtaskId/comments', auth, commentbox);
teamRouter.get('/subtasks/:id',auth,ganttChart)
teamRouter.get('/activity-log/:id',auth,activityLog)
teamRouter.get('/task/admin',auth,taskList);
teamRouter.get('/task/emails',auth,allEmail);
teamRouter.put('/subtasks/update/:id',auth,editTask);
teamRouter.delete('/subtasks/delete/:id',auth,deleteTeam);
module.exports = teamRouter;
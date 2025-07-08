import React, { useEffect, useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [ganttTasks, setGanttTasks] = useState([]);
  const { id } = useParams();

  const getProgressFromStatus = (status) => {
    switch (status) {
      case 'todo': return 0;
      case 'doing': return 50;
      case 'done': return 100;
      default: return 0;
    }
  };

  const getColorFromStatus = (status) => {
    switch (status) {
      case 'todo': return '#ef4444';
      case 'doing': return 'orange';
      case 'done': return 'green';
      default: return 'grey';
    }
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/subtasks/${id}`, {
          withCredentials: true,
        });

        const fetchedTask = response.data;
        setTask(fetchedTask);

        const ganttData = fetchedTask.subtasks.map((subtask) => {
          const start = new Date(fetchedTask.createdAt);
          const end = new Date(subtask.dueDate);

          return {
            id: subtask._id,
            name: `${subtask.title}`, 
            start,
            end,
            type: 'task',
            progress: getProgressFromStatus(subtask.status),
            isDisabled: false,
            styles: {
              progressColor: getColorFromStatus(subtask.status),
              progressSelectedColor: getColorFromStatus(subtask.status),
              backgroundColor: getColorFromStatus(subtask.status),
            },
          };
        });

        setGanttTasks(ganttData);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return <p style={{ padding: '2rem', fontSize: '18px' }}>Loading task details...</p>;
  }

  return (
    <div style={{ padding: '32px', maxWidth: '100%', backgroundColor: '#f4f4f4' }}>

      <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>
         Project: {task.projectName}
      </h2>
      <p style={{ fontSize: '16px', textAlign: 'center', marginBottom: '24px' }}>
        <strong>Created At:</strong> {new Date(task.createdAt).toLocaleDateString()}
      </p>

      <div style={{ position: 'relative', backgroundColor: '#f4f4f4', borderRadius: '8px', padding: '40px' }}>

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '12px',
            marginTop:'-100px',
            zIndex: 10,
            width: '180px',
          }}
        >
          <h4 style={{ marginBottom: '12px', fontSize: '16px' }}>Status</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '18px', height: '18px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
            <span>To Do</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '18px', height: '18px', backgroundColor: 'orange', borderRadius: '4px' }}></div>
            <span>Doing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '18px', height: '18px', backgroundColor: 'green', borderRadius: '4px' }}></div>
            <span>Done</span>
          </div>
        </div>

        {/* Gantt Chart */}
        <div style={{ overflowX: 'auto', paddingTop: '70px' }}>
          <Gantt tasks={ganttTasks} viewMode={ViewMode.Day} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

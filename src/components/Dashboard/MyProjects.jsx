import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchSubTask, updateSubtaskStatus } from '../../features/teamSlice';
import axios from 'axios';
import { getPriority } from '../../utils';

const statusTypes = ['todo', 'doing', 'done'];

const columnColors = {
  todo: 'grey',    
  doing: 'lightblue',   
  done: 'lightgreen',   
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};

const MyProjects = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { subtasks } = useSelector((state) => state.subtask);

  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});


  useEffect(() => {
    if (id) {
      dispatch(fetchSubTask(id)).then((action) => {
        if (Array.isArray(action.payload)) {
          const formatted = action.payload.map((task) => ({
            ...task,
            id: task._id,
            taskId: task.taskId,
            comments: task.comments || [],
          }));
          setTasks(formatted);
        }
      });
    }

    axios
      .get('http://localhost:5000/auth/api/info', { withCredentials: true })
      .then((res) => setUserEmail(res.data.email))
      .catch((err) => console.error('Error fetching user email:', err));
  }, [dispatch, id]);

  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = draggableId;
    const movedTask = tasks.find((task) => task.id.toString() === taskId);
    if (!movedTask || movedTask.assignedTo !== userEmail) return;

    const newStatus = destination.droppableId;

    try {
      await dispatch(
        updateSubtaskStatus({
          taskId: movedTask.taskId,
          subtaskId: movedTask.id,
          status: newStatus,
        })
      );

      const updatedTask = { ...movedTask, status: newStatus };
      const updatedTasks = [...tasks];
      updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, updatedTask);
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleCommentChange = (taskId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleAddComment = async (taskId) => {
    const commentText = commentInputs[taskId];
    if (!commentText || commentText.trim() === '') return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/subtasks/${taskId}/comments`,
        {
          text: commentText.trim(),
          email: userEmail,
        },
        { withCredentials: true }
      );

      if (!res?.data?.subtask) throw new Error('Invalid response from server');

      const updatedSubtask = res.data.subtask;

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, comments: updatedSubtask.comments } : task
      );

      setTasks(updatedTasks);
      setCommentInputs((prev) => ({
        ...prev,
        [taskId]: '',
      }));
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again later.');
    }
  };

  const toggleComments = (taskId) => {
  setVisibleComments((prev) => ({
    ...prev,
    [taskId]: !prev[taskId],
  }));
};

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
     <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '0 20px'
  }}
>
  <h2
    style={{
      fontWeight: '600',
      fontSize: '24px',
      color: '#111827',
      margin: 0
    }}
  >
    📋 My Tasks
  </h2>

  <div style={{ display: 'flex', gap: '20px' }}>
    <Link
      to={`/task/${id}`}
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        backgroundColor: 'green',
        color: 'white',
        fontSize: '14px',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#059669')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'green')}
    >
      View Chart
    </Link>

    <Link
      to={`/activity-log/${id}`}
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        backgroundColor: 'blue',
        color: 'white',
        fontSize: '14px',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#2563eb')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'blue')}
    >
      Activity Log
    </Link>
  </div>
</div>



      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
          {statusTypes.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    backgroundColor: columnColors[status],
                    borderRadius: '12px',
                    padding: '18px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    minHeight: '500px',
                  }}
                >
                  <h3
                    style={{
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: '#374151',
                    }}
                  >
                    {status}
                  </h3>

                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => {
                      if (!task || !task.id) return null;
                      const isDraggable = task.assignedTo === userEmail;

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={!isDraggable}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...(isDraggable ? provided.dragHandleProps : {})}
                              style={{
                                ...provided.draggableProps.style,
                                background: '#ffffff',
                                padding: '16px',
                                marginBottom: '14px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                opacity: isDraggable ? 1 : 0.6,
                                cursor: isDraggable ? 'grab' : 'not-allowed',
                                boxShadow: snapshot.isDragging
                                  ? '0 6px 20px rgba(0,0,0,0.1)'
                                  : '0 1px 3px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s',
                              }}
                            >
                              <h4 style={{ marginBottom: '6px', fontSize: '16px', color: '#111827' }}>
                                <strong>Title:</strong> {task.title}
                              </h4>
                          
                              <p style={{ color: '#4B5563', fontSize: '14px' }}>
                                <strong>Description:</strong> {task.description}
                              </p>

                              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
                                <strong>Due:</strong> {formatDate(task.dueDate)}
                                &nbsp;|&nbsp;
                                <strong style={{ color: getPriority(task.dueDate).color }}>
                                  {getPriority(task.dueDate).label} Priority
                                </strong>
                              </p>

                              <p style={{ fontSize: '13px', color: '#6B7280' }}>
                                <strong>Assigned to:</strong> {task.assignedTo}
                              </p>

                              <div style={{ marginTop: '10px' }}>
                               
                                <div style={{ marginTop: '10px' }}>
                                  <div
                                    style={{ cursor: 'pointer', fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center' }}
                                    onClick={() => toggleComments(task.id)}
                                  >
                                    <strong style={{ marginRight: '4px' }}>
                                      {visibleComments[task.id] ? '▼' : '►'} Comments:
                                    </strong>
                                  </div>

                                  {visibleComments[task.id] && (
                                    <>
                                      <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                                        {(task.comments ?? []).map((comment, i) => (
                                          <li key={i} style={{ marginBottom: '8px' }}>
                                            <span style={{ color: '#111827' }}>{comment.text}</span>
                                            <br />
                                            <small style={{ color: '#9CA3AF' }}>— {comment.email}</small>
                                          </li>
                                        ))}
                                      </ul>

                                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                        <input
                                          type="text"
                                          placeholder="Add a comment"
                                          value={commentInputs[task.id] || ''}
                                          onChange={(e) => handleCommentChange(task.id, e.target.value)}
                                          style={{
                                            flex: 1,
                                            padding: '6px 8px',
                                            fontSize: '13px',
                                            borderRadius: '6px',
                                            border: '1px solid #d1d5db',
                                          }}
                                        />
                                        <button
                                          onClick={() => handleAddComment(task.id)}
                                          style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          OK
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>

                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MyProjects;

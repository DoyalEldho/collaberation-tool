import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditTask = () => {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null); // subtask ID
  const [editedData, setEditedData] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
    const res = await axios.get('http://localhost:5000/task/admin', {
     withCredentials: true
});
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/task/emails',{
     withCredentials: true
});      
      setUsers(res.data); 
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleEdit = (subtask) => {
    setEditing(subtask._id);
    setEditedData({ ...subtask });
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (editingd) => {
    try {
        await axios.put(
      `http://localhost:5000/subtasks/update/${editingd}`,  editedData, { withCredentials: true, }
    );
      setEditing(null);
      fetchTasks();
         toast.success('Task updated successfully!');
    } catch (err) {
      console.error("Error updating subtask:", err);
    }
  };

  const deleteSubtask = async (delId) => {
    try {
      await axios.delete(`http://localhost:5000/subtasks/delete/${delId}`, { withCredentials: true, }
    );
      fetchTasks();
    toast.success('Task Deleted', {
     style: {
    border: '1px solid #713200',
    padding: '16px',
    color: '#713200',
  },
  iconTheme: {
    primary: '#713200',
    secondary: '#FFFAEE',
  },
  });
    } catch (err) {
      console.error("Error deleting subtask:", err);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Tasks</h2>
      {tasks.map((task) => (
        <div key={task._id} className="mb-6 p-4 border rounded shadow-sm bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{task.projectName}</h3>
          {task.subtasks.map((sub) => (
            <div key={sub._id} className="p-3 mb-2 border rounded bg-white">
              {editing === sub._id ? (
                <>
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) => handleEditChange('title', e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <input
                    type="text"
                    value={editedData.description}
                    onChange={(e) => handleEditChange('description', e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <input
                    type="date"
                    value={editedData.dueDate?.slice(0, 10)}
                    onChange={(e) => handleEditChange('dueDate', e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <select
                    value={editedData.assignedTo}
                    onChange={(e) => handleEditChange('assignedTo', e.target.value)}
                    className="border p-1 mr-2"
                  >
                    <option value="">Select User</option>
                              {users.map((email, i) => (
                                  <option key={i} value={email}>
                                      {email}
                                  </option>
                        ))}
                  </select>
                  <button
                    onClick={()=>saveEdit(sub._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Title:</strong> {sub.title}</p>
                  <p><strong>Description:</strong> {sub.description}</p>
                  <p><strong>Due:</strong> {new Date(sub.dueDate).toLocaleDateString()}</p>
                  <p><strong>Assigned:</strong> {sub.assignedTo}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubtask(sub._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EditTask;

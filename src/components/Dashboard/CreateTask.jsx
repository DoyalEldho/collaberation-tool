import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, fetchMembers, fetchTaskMembers } from '../../features/teamSlice';
import EditTask from './EditTask';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const [projectName, setProjectName] = useState('');
  const [users,setUsers]=useState([]);
  const dispatch =useDispatch();
  const { history: teamList, status, error } = useSelector(state => state.member);
  // const {  taskArray } = useSelector(state => state.task);

  const [subtasks, setSubtasks] = useState([
    { title: '', description: '', dueDate: '', assignedTo: '' },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index][field] = value;
    setSubtasks(updated);
  };

  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { title: '', description: '', dueDate: '', assignedTo: '' },
    ]);
  };

  const removeSubtask = (index) => {
    const updated = subtasks.filter((_, i) => i !== index);
    setSubtasks(updated);
  };


useEffect(() => {
  dispatch(fetchMembers())
    .then((data) => {
      const teams = data?.payload?.teams;

      if (Array.isArray(teams)) {
        const users = teams.flatMap(team => team.invitedEmails || []);
        setUsers(users);
      } else {
        console.warn('No teams found in payload:', data);
      }
    })
    .catch((err) => {
      console.error('Error fetching members:', err);
    });

    // dispatch(fetchTaskMembers()).then(data=>console.log(data.payload) )
}, [dispatch]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { projectName, subtasks };
    dispatch(createTask(payload));
   toast.success('Task added successfully!');
     setProjectName('');
    setSubtasks([{ title: '', description: '', dueDate: '', assignedTo: '' }]);
    dispatch(fetchTaskMembers());
  };

  return (
    <>

    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700">Create Project Task</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
      </div>

      <div className="space-y-6">
        {subtasks.map((subtask, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-md bg-gray-50 relative"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Subtask {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="text-red-500 font-bold text-xl hover:text-red-700"
                title="Remove Subtask"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={subtask.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                <input
                  type="date"
                  value={subtask.dueDate}
                  onChange={(e) => handleChange(index, 'dueDate', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Assigned To (Email)</label>
                <select
                  value={subtask.assignedTo}
                  onChange={(e) => handleChange(index, 'assignedTo', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((email,i) => (
                    <option key={i} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={addSubtask}
          className="text-blue-600 font-medium hover:underline"
        >
          + Add Subtask
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>
    </form>
       
       <EditTask/>
       </>
  );
};

export default CreateTask;

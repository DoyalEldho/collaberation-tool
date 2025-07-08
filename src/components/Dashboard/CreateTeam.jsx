import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTeam } from '../../features/teamSlice';



const CreateTeam = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.team);

  const [projectName, setProjectName] = useState('');
  const [emails, setEmails] = useState(['']);

  const handleAddEmail = () => setEmails([...emails, '']);

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleRemoveEmail = (index) => {
    const updated = [...emails];
    updated.splice(index, 1);
    setEmails(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   const teamData = {
  name: projectName,
  emails: emails.filter(e => e.trim()),
};


    dispatch(createTeam(teamData))
    .then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setProjectName('');
        setEmails(['']);
      }
    });
  };

  return (
    <>
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white via-gray-100 to-white shadow-2xl rounded-3xl p-10 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Create a New Team</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="Enter project name"
            required
          />
        </div>

        {/* Emails */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Team Member Emails</label>
          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder={`Email ${index + 1}`}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="text-red-500 hover:text-red-700 text-xl"
                    title="Remove email"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddEmail}
            className="mt-4 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm"
          >
            + Add another email
          </button>
        </div>

        {/* Status Feedback */}
        {status === 'loading' && (
          <p className="text-blue-500 text-sm text-center">Creating team...</p>
        )}
        {status === 'succeeded' && (
          <p className="text-green-500 text-sm text-center">Team created successfully!</p>
        )}
        {status === 'failed' && (
          <p className="text-red-500 text-sm text-center">Error: {error}</p>
        )}

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
   
      </>
  );
};

export default CreateTeam;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMember, fetchMembers } from '../../features/teamSlice';

const MyTeams = () => {
  const dispatch = useDispatch();
  const { history: teamList, status, error } = useSelector(state => state.member);

  useEffect(() => {
    dispatch(fetchMembers()).then(data => console.log(data));
  }, [dispatch]);

  const handleDeleteMember = (email, teamName) => {
    dispatch(deleteMember({ email, teamName }));
    alert("Deleted");
  };

  return (
    <div className="grid gap-6">
      {teamList?.length > 0 ? (
        teamList.map((team, index) => (
          <div
            key={index}
            className="team-box bg-white border border-gray-300 rounded-lg shadow-sm p-6"
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              📁 {team.teamName}
            </h2>
            <h3 className="text-lg text-gray-700 font-medium mb-2">👤 Members</h3>
            <ul className="space-y-3">
              {team.invitedEmails.map((email, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  <span className="text-gray-800">{email}</span>
                  <button
                    onClick={() => handleDeleteMember(email, team.teamName)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    🗑 Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No teams available</p>
      )}
    </div>
  );
};

export default MyTeams;

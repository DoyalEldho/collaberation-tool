import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTaskMembers } from '../../features/teamSlice';

const Sidebar = () => {
    const {  taskArray:projects } = useSelector(state => state.task);
    const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(fetchTaskMembers())
      .then(data=>console.log(data)
      )
    },[dispatch])
  return (
    <div className="w-64 bg-gradient-to-br from-gray-700 to-gray-400 text-white p-6 min-h-screen font-[Inter] flex flex-col justify-between">
      {/* Navigation Links */}
      <nav className="flex flex-col gap-6 text-base">
        <Link to="/dashboard/create-team" className="flex items-center gap-3 hover:text-blue-400 transition-all">
          <span className="text-lg">👥</span>
          <span className="font-medium tracking-wide">Create Team</span>
        </Link>
        
        <Link to="/dashboard/create-task" className="flex items-center gap-3 hover:text-blue-400 transition-all">
          <span className="text-lg">📝</span>
          <span className="font-medium tracking-wide">Create Task</span>
        </Link>

        <Link to="/dashboard/my-teams" className="flex items-center gap-3 hover:text-green-400 transition-all">
          <span className="text-lg">🧑‍🤝‍🧑</span>
          <span className="font-medium tracking-wide">My Teams</span>
        </Link>

        
      {/* Projects List */}
      <div className="mt-10 border-t border-gray-500 pt-4">
        <h2 className="text-sm font-semibold text-gray-200 mb-2 tracking-wider">📁PROJECTS</h2>
        <ul className="space-y-2">
          {Array.isArray(projects) && projects.length >0 ? (
            projects.map(project => (
              <li key={project._id}>
                <Link
                  to={`/dashboard/project/${project._id}`}
                  className="text-sm text-blue-200 hover:text-white transition-all"
                  >
                  {project.projectName}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-white-300 text-xs">No projects</li>
          )}
        </ul>
      </div>
        </nav>
    </div>
  );
};

export default Sidebar;

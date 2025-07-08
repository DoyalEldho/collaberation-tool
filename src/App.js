import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CreateTeam from './components/Dashboard/CreateTeam';
import CreateTask from './components/Dashboard/CreateTask';
import MyProjects from './components/Dashboard/MyProjects';
import MyTeams from './components/Dashboard/MyTeams';
import TaskDetails from './components/Dashboard/TaskDetails';
import ActivityLog from './components/Dashboard/ActivityLog';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
                  <Toaster position="top-center" reverseOrder={false} />
        <Navbar/>
         <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />


                {/*  NESTED DASHBOARD ROUTES */}
               <Route path="/dashboard" element={<Dashboard />}>
               <Route path="create-team" element={<CreateTeam />} />
              <Route path="create-task" element={<CreateTask />} />
              <Route path="project/:id" element={<MyProjects />} />
              <Route path="my-teams" element={<MyTeams/>} />
             </Route>

              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/activity-log/:id" element={<ActivityLog />} />
              </Routes>
    </div>
  );
}

export default App;

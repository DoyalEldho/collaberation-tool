import { configureStore } from '@reduxjs/toolkit';
import { memberReducer, subTaskReducer, taskReducer, teamReducer } from '../features/teamSlice';


const store = configureStore({
  reducer: {
    team: teamReducer,
    member:memberReducer,
    task:taskReducer,
    subtask:subTaskReducer
  },
});

export default store;

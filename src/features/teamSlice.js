import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//api
export const createTeam = createAsyncThunk('team/createTeam', async (teamData) => {
  const res = await axios.post('http://localhost:5000/api/send', teamData, {
    withCredentials: true,
  });
  return res.data;
});


// Update subtask status

export const updateSubtaskStatus = createAsyncThunk(
  'subtask/updateStatus',
  async ({ taskId, subtaskId, status }) => {
    const response = await axios.put(`http://localhost:5000/tasks/${taskId}/subtask/${subtaskId}`, 
      {status},{withCredentials:true},
    );
    return response.data.subtask; // updated subtask
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    team: null,
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.team = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
     .addCase(fetchSubTask.fulfilled, (state, action) => {
      state.subtasks = action.payload;
      state.loading = false;
      state.error = null;
    })
       .addCase(updateSubtaskStatus.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.subtasks.findIndex((s) => s._id === updated._id);
      if (index !== -1) {
        state.subtasks[index] = updated;
      }
    });
      
  },
});

export const teamReducer = teamSlice.reducer;

//get teams
export const fetchMembers = createAsyncThunk('leaves/fetchMembers', async () => {
  const res = await axios.get('http://localhost:5000/api/team/members',{withCredentials: true});
  return res.data;
});

const memberSlice = createSlice({
  name: 'members',
  initialState: {
    history: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload.teams; 
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const memberReducer= memberSlice.reducer;

//delete memeber
export const deleteMember = createAsyncThunk('leaves/deleteMember', async ({email,teamName}, { dispatch }) => {
  await axios.delete('http://localhost:5000/api/cancel/members',{ data: { email, teamName },withCredentials: true});
  dispatch(fetchMembers()); 
});


//create task
export const createTask = createAsyncThunk('team/createTask', async (teamData) => {
  const res = await axios.post('http://localhost:5000/api/create/task', teamData, {
    withCredentials: true,
  });
});


//fetch task+assign member
export const fetchTaskMembers = createAsyncThunk('leaves/fetchTaskMembers', async () => {
  const res = await axios.get('http://localhost:5000/api/tasks',{withCredentials: true});
  return res.data;
});


const taskSlice = createSlice({
  name: 'task',
  initialState: {
    taskArray: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskMembers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTaskMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
         state.taskArray = action.payload;
      })
      .addCase(fetchTaskMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const taskReducer = taskSlice.reducer;

//fetch subtasks
export const fetchSubTask = createAsyncThunk(
  'project/fetchSubTask',
  async (projectId, { rejectWithValue }) => {
    try {
            console.log('Fetching subtask for project:', projectId);
      const response = await axios.get(
        `http://localhost:5000/api/my/projects/${projectId}`,
        { withCredentials: true } 
      );
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const subtaskSlice = createSlice({
  name: 'subtasks',
  initialState: {
    subtaskArray: [],
    status: 'idle', 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
         state.subtaskArray = action.payload;
      })
      .addCase(fetchSubTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

  },
});

export const subTaskReducer = subtaskSlice.reducer;


import { configureStore, createSlice } from '@reduxjs/toolkit';
import socket from './create_socket';

const initialState = {
  socket: socket,
};

const counterSlice = createSlice({
  name: 'socket',
  initialState: initialState,
  reducers: {
    
  }
})

const store = configureStore({
  reducer: counterSlice.reducer,
});

export const {  } = counterSlice.actions;
export default store;
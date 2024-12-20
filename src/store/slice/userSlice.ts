// src/store/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    userId: null,
    userName: null,
    accessToken: null,
    refreshToken: null,
};

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { userId, userName, accessToken, refreshToken } = action.payload;
            state.userId = userId;
            state.userName = userName;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logout: (state) => {
            state.userId = null;
            state.userName = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

// Actions
export const { setUser, logout } = userSlice.actions;

// Reducer
export default userSlice.reducer;
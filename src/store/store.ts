// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apiSlice';

export const store = configureStore({
    reducer: {
        // Add the RTK Query API reducer
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // Adding the middleware for RTK Query
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

// Optional: setupListeners enables refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Define RootState and AppDispatch for type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

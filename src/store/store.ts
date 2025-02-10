// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './apiSlice';  // Import your apiSlice
import { persistStore, persistReducer } from 'redux-persist'; // Redux persist
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for persistence
import userReducer from './slice/userSlice'; // Import the user slice
import locationReducer from './slice/locationSlice';
// Persist configuration for the user slice
const persistConfig = {
    key: 'root',
    storage: AsyncStorage, // Use AsyncStorage as the storage engine
    // whitelist: ['user'], // Only persist the user slice
    // blacklist: ['user.register'], // If `register` is in the `user` state, blacklist it
};

// Persisted reducer for user slice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure the store
export const store = configureStore({
    reducer: {
        // RTK Query API slice
        [apiSlice.reducerPath]: apiSlice.reducer,
        // Persisted user slice
        user: persistedUserReducer,
        location:locationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore actions and state paths containing non-serializable values
                ignoredActions: ['persist/PERSIST'],
                ignoredPaths: ['user.register'], // Ignore non-serializable `register`
            },
        }).concat(apiSlice.middleware), // Add RTK Query middleware
});

// Optional: setupListeners enables refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Persistor for redux-persist
export const persistor = persistStore(store);

// Define RootState and AppDispatch for type safety
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

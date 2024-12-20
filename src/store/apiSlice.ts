import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';  // Import RootState type for type safety

// Base URLs for the API and images
export const BASE_URL = 'http://192.168.1.3:3000/v1';
export const IMAGE_URL = 'http://192.168.1.3:3000/uploads';

// Define the RTK Query API slice
export const apiSlice = createApi({
    reducerPath: 'apiSlice', // Unique key for the API slice reducer
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL, // Set the base URL for all requests
        prepareHeaders: (headers, { getState }) => {
            // Access token from the Redux store via getState
            const token = (getState() as RootState).user.accessToken;
            console.log(token, 'what is token');
            if (token) {
                // Add Authorization header if token exists
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        fetchFn: async (url, options) => {
            const response = await fetch(url, options);
            if (response.status === 401) {
                // Token expired or unauthorized, remove token and handle login flow
                // Optionally, dispatch a logout action here
            }
            return response;
        },
    }),
    endpoints: (builder) => ({
        // Endpoint to fetch all services
        getServices: builder.query<any[], void>({
            query: () => '/services?sortBy=-createdAt&page=1&limit=10&search=service',
        }),

        // Endpoint to fetch a single service by its ID
        getServiceById: builder.query<any, number>({
            query: (id) => `/services/${id}`,
        }),

        // Endpoint for user login
        login: builder.mutation<any, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

// Export hooks for use in React components
export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useLoginMutation,
} = apiSlice;

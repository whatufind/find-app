// services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseUrl = 'http://192.168.1.3:3000/v1';
export const imageUrl = 'http://192.168.1.3:3000/uploads';

// Define the RTK Query API
export const apiSlice = createApi({
    reducerPath: 'apiSlice', // Unique key for the API reducer
    baseQuery: fetchBaseQuery({ baseUrl }), // Replace with your API URL
    endpoints: (builder) => ({
        // Endpoint to fetch all products
        getServices: builder.query<any[], void>({
            query: () => '/services?sortBy=-createdAt&page=1&limit=10',
        }),
        // Endpoint to fetch a single product
        getServiceById: builder.query<any, number>({
            query: (id) => `/services/${id}`,
        }),
    }),
});

// Export hooks for usage in components
export const { useGetServicesQuery, useGetServiceByIdQuery } = apiSlice;

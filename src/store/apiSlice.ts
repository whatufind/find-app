import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '../store/store'; // Import RootState type for type safety
import {navigate} from '@/utils/navigationHelper';
import { socket } from '@/config/socketConfig';

// Base URLs for the API and images
export const BASE_URL = 'http://173.249.59.88/v1';

// Define the RTK Query API slice
export const apiSlice = createApi({
  reducerPath: 'apiSlice', // Unique key for the API slice reducer
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // Set the base URL for all requests
    prepareHeaders: (headers, {getState}) => {
      const state = getState() as RootState;
      const token = state.user?.accessToken; // Access token from Redux store

      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Add Authorization header
      }

      return headers;
    },
    fetchFn: async (url, options) => {
      const response = await fetch(url, options);

      if (response.status === 401) {
        //do navigate to Login route
        navigate('Login');
      }

      return response;
    },
  }),
  tagTypes: ['Messages'],
  endpoints: builder => ({
    // Fetch all services
    getServices: builder.query<any[], any>({
      query: dynamicQuery => ({
        url: 'services',
        params: {...dynamicQuery},
      }),
    }),

    getServiceCategories: builder.query<any, any>({
      query: () => '/services/categories/all',
    }),

    // Fetch a single service by ID
    getServiceById: builder.query<any, number>({
      query: id => `/services/${id}`,
    }),

    // User login
    login: builder.mutation<any, {email: string; password: string}>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // User logout
    logout: builder.mutation<any, {refreshToken:string}>({
      query: credentials => ({
        url: '/auth/logout',
        method: 'POST',
        body: credentials,
      }),
    }),

    changePassword: builder.mutation({
      query: ({ password, token }) => ({
          url: `/auth//reset-password?token=${token}`,
          method: 'POST',
          body: { password },
      }),
  }),

    // Register a new user
    register: builder.mutation<
      any,
      {email: string; name: string; password: string}
    >({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Request a service (e.g., booking)
    requestAService: builder.mutation<any, {id: string; data: any}>({
      query: ({id, data}) => ({
        url: `/services/requests/${id}`,
        method: 'POST',
        body: data,
      }),
    }),

    // Create a new service
    createService: builder.mutation<any, FormData>({
      query: data => ({
        url: '/services',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),

    // Fetch user details by ID
    getUser: builder.query<any, string>({
      query: id => `/users/${id}`,
    }),

    createPost: builder.mutation<any, FormData>({
      query: formData => ({
        url: '/posts',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
    likeAService: builder.mutation<void, { serviceId: string }>({
      query: ({ serviceId }) => ({
          url: `/services/${serviceId}/like`,
          method: 'PATCH',
      }),
  }),

    getPosts: builder.query<any[], void>({
      query: () => 'posts?sortBy=-createdAt&page=1&limit=10',
    }),
    getServieReviews: builder.query<any[], any>({
      query: dynamicQuery => ({
        url: 'services/reviews/all',
        params: {...dynamicQuery},
      }),
    }),
    geUser: builder.query<any[], {userId: any}>({
      query: dynamicQuery => ({
        url: `/users/${dynamicQuery.userId}`,
        params: {...dynamicQuery},
      }),
    }),
    getServiceRequesters: builder.query<any[], any>({
      query: dynamicQuery => ({
        url: 'services/requests/all',
        params: {...dynamicQuery},
      }),
    }),
    updateServiceRequest: builder.mutation<any, any>({
      query: ({id, status}) => ({
        url: `services/requests/${id}`, // Use dynamic ID
        method: 'PATCH',
        body: {
          status, // Pass the actual status
          requestDetails: 'updated request today', // Fix typo
        },
        headers: {
          'Content-Type': 'application/json', // Change to correct content type
        },
      }),
    }),
    updateUser: builder.mutation<void, {id: string; userData: FormData}>({
        query: ({id, userData}) => {
          return {
            url: `users/${id}`,
            method: 'PATCH',
            body: userData,
          };
        },
      }),


    getSkills: builder.query<any[], void>({
      query: () => 'skills',
    }),

    getProfessions: builder.query<any[], void>({
      query: () => 'professions',
    }),

    createChat: builder.mutation<any, {userId:string}>({
      query: formData => ({
        url: '/chats',
        method: 'POST',
        body: formData,
      }),
    }),

    getChats: builder.query<any, void>({ query: () => '/chats' }),

    sendMessage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/messages',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Messages'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          socket.emit('new message', data); // Emit message event after a successful request
        } catch (error) {
          console.error('Message sending failed:', error);
        }
      },
    }),

    getAllMessagesFromAChat: builder.query<any[], string>({
      query: (chatId) => `/messages/${chatId}`,
      providesTags: ['Messages'],
    }),

  }),
});

// Export hooks for use in React components
export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useRequestAServiceMutation,
  useCreateServiceMutation,
  useGetUserQuery,
  useGetServiceCategoriesQuery,
  useCreatePostMutation,
  useGetPostsQuery,
  useGetServieReviewsQuery,
  useGeUserQuery,
  useGetServiceRequestersQuery,
  useUpdateServiceRequestMutation,
  useGetSkillsQuery,
  useGetProfessionsQuery,
  useUpdateUserMutation,
  useCreateChatMutation,
  useGetChatsQuery,
  useSendMessageMutation,
  useGetAllMessagesFromAChatQuery,
  useLikeAServiceMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = apiSlice;

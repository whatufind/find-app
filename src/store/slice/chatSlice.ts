import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  selectedChat: string | null;
}

const initialState: ChatState = {
  selectedChat: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;

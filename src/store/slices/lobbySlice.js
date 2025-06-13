import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLobby: null,
  availableLobbies: [],
  loading: false,
  error: null
};

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentLobby: (state, action) => {
      state.currentLobby = action.payload;
    },
    setAvailableLobbies: (state, action) => {
      state.availableLobbies = action.payload;
    },
    updateLobby: (state, action) => {
      if (state.currentLobby) {
        state.currentLobby = { ...state.currentLobby, ...action.payload };
      }
    },
    addPlayerToLobby: (state, action) => {
      if (state.currentLobby) {
        state.currentLobby.players.push(action.payload);
      }
    },
    removePlayerFromLobby: (state, action) => {
      if (state.currentLobby) {
        state.currentLobby.players = state.currentLobby.players.filter(
          p => p.id !== action.payload
        );
      }
    },
    leaveLobby: (state) => {
      state.currentLobby = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setCurrentLobby,
  setAvailableLobbies,
  updateLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  leaveLobby,
  setError,
  clearError
} = lobbySlice.actions;

export default lobbySlice.reducer;
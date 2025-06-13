import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameState: null,
  currentDrawer: null,
  isMyTurn: false,
  teamMembers: [],
  opponentTeam: [],
  gamePhase: 'waiting',
  roundData: null,
  loading: false,
  error: null
};

const multiplayerSlice = createSlice({
  name: 'multiplayer',
  initialState,
  reducers: {
    setGameState: (state, action) => {
      state.gameState = action.payload;
    },
    setCurrentDrawer: (state, action) => {
      state.currentDrawer = action.payload;
      state.isMyTurn = action.payload?.id === state.gameState?.currentUserId;
    },
    setTeams: (state, action) => {
      const { teamMembers, opponentTeam } = action.payload;
      state.teamMembers = teamMembers;
      state.opponentTeam = opponentTeam;
    },
    setGamePhase: (state, action) => {
      state.gamePhase = action.payload;
    },
    setRoundData: (state, action) => {
      state.roundData = action.payload;
    },
    updateGameState: (state, action) => {
      if (state.gameState) {
        state.gameState = { ...state.gameState, ...action.payload };
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetGame: (state) => {
      state.gameState = null;
      state.currentDrawer = null;
      state.isMyTurn = false;
      state.gamePhase = 'waiting';
      state.roundData = null;
      state.error = null;
    }
  }
});

export const {
  setGameState,
  setCurrentDrawer,
  setTeams,
  setGamePhase,
  setRoundData,
  updateGameState,
  setLoading,
  setError,
  resetGame
} = multiplayerSlice.actions;

export default multiplayerSlice.reducer;
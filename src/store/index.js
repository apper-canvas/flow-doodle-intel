import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lobbyReducer from './slices/lobbySlice';
import multiplayerReducer from './slices/multiplayerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lobby: lobbyReducer,
    multiplayer: multiplayerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
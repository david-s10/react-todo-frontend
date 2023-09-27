import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userReucer from '../slices/userSlice'
import todoReducer from '../slices/todoSlice'

const rootReducer = combineReducers({
    user: userReucer,
    todo: todoReducer
})

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: [],
} 

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store) 
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
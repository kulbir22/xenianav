import { configureStore } from '@reduxjs/toolkit';

import { userData } from './reducer';

export const store = configureStore({
    reducer: {
        reduxState: userData.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
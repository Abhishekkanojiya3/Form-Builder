import { configureStore } from '@reduxjs/toolkit'
import formBuilderReducer from './slices/formBuilderSlice'
import previewReducer from './slices/previewSlice'
import myFormsReducer from './slices/myFormsSlice'

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    preview: previewReducer,
    myForms: myFormsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})
import { configureStore } from '@reduxjs/toolkit';
import communityReducer from './src/features/community/communitySlice';



export default configureStore({
  reducer: {
    community: communityReducer,
  },
});

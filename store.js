import { configureStore } from '@reduxjs/toolkit';
import communityReducer from './src/features/community/communitySlice';
import userReducer from './src/features/community/userSlice';


export default configureStore({
  reducer: {
    community: communityReducer,
    user: userReducer,
  },
});

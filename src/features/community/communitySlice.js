// communitySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk action creator for fetching posts
export const fetchPosts = createAsyncThunk('community/fetchPosts', async () => {
  try {
    const response = await axios.get('https://sunbird-backend.onrender.com/api/addPosts');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const communitySlice = createSlice({
  name: 'community',
  initialState: {
    posts: [],
  },
  reducers: {
    addPost: (state, action) => {
      const newPost = action.payload;
      newPost.comments = [];
      newPost.likes = 0; // Initialize likes count
      state.posts.push(newPost);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (post) {
        post.comments = post.comments.filter(comment => comment.id !== commentId);
      }
    },
    addLike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (post) {
        post.likes += 1;
      }
    },
    removeLike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (post && post.likes > 0) {
        post.likes -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});

export const {
  addPost,
  deletePost,
  addComment,
  deleteComment,
  addLike,
  removeLike,
} = communitySlice.actions;


export default communitySlice.reducer;

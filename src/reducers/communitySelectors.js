import { createSelector } from '@reduxjs/toolkit';

export const selectPosts = state => state.community.posts;

// Create the selectPostById selector
export const selectPostById = postId => createSelector(
    selectPosts,
    posts => posts.find(post => post.id === postId)
  );



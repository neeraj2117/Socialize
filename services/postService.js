import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdate = async (post) => {
    try {
      // Check if post.file is a stringified object and parse it
      if (typeof post.file === 'string') {
        try {
          post.file = JSON.parse(post.file);
          console.log('Parsed file -------->>>', post.file);
        } catch (e) {
          console.log('File is a string and not a JSON object -------->>>', post.file);
          // Proceed as the file is a string and does not need to be uploaded
        }
      }
  
      // upload image or video if the file is an object
      if (post.file && typeof post.file === 'object') { 
        console.log('File is of object type -------->>>');
        let isImage = post.file.type === 'image';
        let folderName = isImage ? 'postImages' : 'postVideos';
        let fileResult = await uploadFile(folderName, post.file.uri, isImage);
  
        if (fileResult.success) {
          post.file = fileResult.data;
        } else {
          return fileResult;
        }
      }
  
      const { data, error } = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();
  
      if (error) {
        console.error('createPost error: ', error);
        return { success: false, msg: 'Could not create a post' };
      }
  
      return { success: true, data: data };
    } catch (error) {
      console.error('createPost error: ', error);
      return { success: false, msg: 'Could not create a post' };
    }
};
 
export const fetchPosts = async (limit=10) => {
  try {
    const {data, error} = await supabase
    .from('posts')
    .select(`
      *,
      user: users(id, name, image),
      postLikes (*),
      comments (count)
      `
    )
    .order('created_at', {ascending: false})
    .limit(limit);

    if (error){
      console.error('fetchPosts error: ', error);
      return { success: false, msg: 'Could not fetch posts' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('fetchPosts error: ', error);
    return { success: false, msg: 'Could not fetch posts' };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const {data, error} = await supabase
    .from('postLikes')
    .insert(postLike)
    .select()
    .single();

    if (error){
      console.error('postLike error: ', error);
      return { success: false, msg: 'Could not like the posts' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('fetchPosts error: ', error);
    return { success: false, msg: 'Could not like the posts' };
  }
};

export const removePostLike = async (postId, userId) => {
  try {

    const {error} = await supabase
    .from('postLikes')
    .delete()
    .eq('userId', userId)
    .eq('postId', postId) 

    if (error){
      console.error('removePostLike error: ', error);
      return { success: false, msg: 'Could not unlike the posts' };
    }

    return { success: true};
  } catch (error) {
    console.error('fetchPosts error: ', error);
    return { success: false, msg: 'Could not unlike the posts' };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const {data, error} = await supabase
    .from('posts')
    .select(`
      *,
      user: users(id, name, image),
      postLikes (*),
      comments (*, user: users(id, name, image))
      `
    )
    .eq('id', postId)
    .order('created_at', {ascending: false, foreignTable: 'comments'})
    .single();

    if (error){
      console.error('fetchPostDetails error: ', error);
      return { success: false, msg: 'Could not fetch posts' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('fetchPostDetails error: ', error);
    return { success: false, msg: 'Could not fetch posts' };
  }
};

export const createComment = async (comment) => {
  try {
    const {data, error} = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

    if (error){
      console.error('comment error: ', error);
      return { success: false, msg: 'Could not create your comment' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('comment error: ', error);
    return { success: false, msg: 'Could not create your comment'  };
  }
};

export const removeComment = async (commentId) => {
  try {

    const {error} = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId) 

    if (error){
      console.error('removeComment error: ', error);
      return { success: false, msg: 'Could not remove the comment' };
    }

    return { success: true, data: {commentId}};
  } catch (error) {
    console.error('removeComment error: ', error);
    return { success: false, msg: 'Could not remove the comment' };
  }
};
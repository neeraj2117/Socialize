import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createComment, fetchPostDetails, removeComment } from "../../services/postService";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import Input from '../../components/Input';
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services/userService";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const [post, setPost] = useState(null);
  const inputRef = useRef(null);
  const commentRef = useRef('');
  const [loading, setLoading] = useState(false);
  
  const handleNewComment = async (payload) => {
    console.log('got new comment - ', payload.new);

    if (payload.new){
      let newComment = {...payload.new};
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost(prevPost => {
        return {
          ...prevPost, 
          comments: [newComment, ...prevPost.comments]
        }
      })
    }
  }

  useEffect(() => {
    let commentChannel = supabase
    .channel('comments')
    .on('postgres_changes', {
      event: 'INSERT', 
      schema: 'public', 
      table: 'comments', 
      filter: `postId=eq.${postId}`
    }, handleNewComment)
    .subscribe();
     
    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    }
  }, [])

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId);
    console.log(res);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  // const onNewComment = async() => {
  //   if (!commentRef.current) return null;

  //   let data = {
  //     userId: user?.id,
  //     postId: post?.id,
  //     text: commentRef.current
  //   }
  //   setLoading(true);

  //   let res = await createComment(data);
  //   // console.log('comment res - ', res);
  //   setLoading(false);

  // if (res.success) {
  //     inputRef?.current?.clear();
  //   }else{
  //     Alert.alert('Comment', res.msg);
  //   }
  // }

  const onNewComment = async () => {
    if (!commentRef.current) return;
  
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    
    setLoading(true);
  
    let res = await createComment(data);
    setLoading(false);
  
    if (res.success) {
      inputRef?.current?.clear();
  
      // Optimistically update the state
      const newComment = {
        id: res.data.id,  // Assuming res.data has the new comment's id
        text: data.text,
        userId: data.userId,
        createdAt: new Date().toISOString(),
        user: { // Assuming you have the user's data already, otherwise you can fetch it here
          id: user?.id,
          name: user?.name,
          image: user?.image, 
        },
      };
  
      setPost((prevPost) => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      }));
    } else {
      Alert.alert('Comment', res.msg);
    }
  };
  

  const onDeleteComment = async(comment) => {
    let res = await removeComment(comment?.id)
    if (res.success) {
      setPost(prevPost => {
        let updatedPost = {...prevPost};
        updatedPost.comments = updatedPost.comments.filter(c => c.id != comment.id);

        return updatedPost;
      })
    }else{
      Alert.alert('Comment', res.msg);
    }
  }

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
        <Text style={styles.notFound}>Post not found!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {/* PostCard is placed at the top */}
        {post && (
          <PostCard
            item={{...post, comments: [{count: post?.comments?.length}]}}
            currentUser={user}
            hasShadow={false}
            router={router}
            isInPostDetails={true}
          />
        )}

        {/* comment input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder = "Type comment.."
            onChangeText={value => commentRef.current = value}
            placeholderTextColor = {theme.colors.textLight}
            containerStyle = {{flex: 1, height: hp(6.2), borderRadius: theme.radius.xl}}
          />
          {
            loading ? (
              <View style={styles.loading}>
                <Loading size="small"/>
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark}/>
              </TouchableOpacity>
            ) 
          }
        </View>

        {/* comment lists */}
        <View style={{marginVertical: 15, gap: 17}}>  
          {
            post?.comments?.map(comment => 
              <CommentItem 
                item={comment}
                key={comment?.id?.toString()}
                canDelete={user.id == comment.userId || user.id == post.userId}
                onDelete={onDeleteComment}
              />
            )
          }
          {
            post?.comment?.length == 0 && (
              <Text style={{color: theme.colors.text, marginLeft: 5}}>Be first to comment!</Text>
            )
          } 
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});

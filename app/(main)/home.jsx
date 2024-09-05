import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import {getUserData} from '../../services/userService';


var  limit = 0;

const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async(payload) => {
    if (payload.eventType == 'INSERT' && payload?.new?.id){
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
    console.log('got post event: ', payload);
  }

  useEffect(() => {
    let postChannel = supabase
    .channel('posts')
    .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
    .subscribe();
     
    // getPosts(); 
    return () => {
      supabase.removeChannel(postChannel);
    }
  }, [])
  
  
  const getPosts = async() => {
    if (!hasMore) return null;

    limit = limit + 4;
    console.log('fetching posts: ',limit);

    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    } 
  }

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) Alert.alert("Log Out error", error.message);
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Socialize</Text>

          <View style={styles.icons}>
            <Pressable onPress={() => router.navigate('notifications')}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={() => router.navigate('newPost')}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={() => router.navigate('profile')}>
              <Avatar
                uri={user?.image}
                size={hp(3.7)}
                rounded={theme.radius.sm}
                style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>
        <FlatList 
          data={posts || []}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => 
            <PostCard
            item={item}
            currentUser={user}
            router={router}
            />
          }
          onEndReached={() =>{
            getPosts();
            console.log('got to the end');
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={hasMore ? (
            <View style={{marginVertical: posts && posts.length == 0 ? 200 : 30}}>
              <Loading/>
            </View>
          ) : (
            <View style={{marginVertical: 15}}>
              <Text style={styles.noPosts}>No more posts.</Text>
            </View>
          )
        }
        />

      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18
  },  
  listStyle: {
    paddingTop: 20, 
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp (2.2), 
    textAlign: 'center', 
    color: theme.colors.text,
    marginBottom: 15
  },
  pill: {
    position: 'absolute', 
    right: -10, 
    top: -4, 
    height: hp (2.2), 
    width: hp (2.2),
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20, 
    backgroundColor: theme.colors.roseLight
  },
    pillText: {
    color: 'white', 
    fontSize: hp (1.2),
    fontWeight: theme.fonts.bold
  }
});

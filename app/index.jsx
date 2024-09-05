import { Button, Text, View } from "react-native";
import ScreenWrapper from '../components/ScreenWrapper'
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Loading from '../components/Loading';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Loading/>
    </View>
  );
}

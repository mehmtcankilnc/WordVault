import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ImmersiveMode from "@/components/immersivemode";
import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomToast from "@/components/customtoast";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function RootLayout() {
  return (
    <>
      <ImmersiveMode />
      <StatusBar style="light" backgroundColor="#1a1a24" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6c4af7",
          tabBarInactiveTintColor: "#595959",
          tabBarStyle: {
            backgroundColor: "#1a1a24",
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="words"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="notebook"
                size={wp("7%")}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={wp("8%")} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tests"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={wp("7%")}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      <CustomToast />
    </>
  );
}

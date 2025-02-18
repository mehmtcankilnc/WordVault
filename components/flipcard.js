import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const FlipCard = ({ frontText, backText, index, deleteWord, handleEdit }) => {
  const rotation = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value + 180}deg` }],
  }));

  const flipCard = () => {
    rotation.value = withSpring(flipped ? 0 : 180);
    setFlipped(!flipped);
  };

  return (
    <>
      <View className="flex-1">
        {flipped ? (
          <TouchableWithoutFeedback onPress={flipCard}>
            <Animated.View
              style={[
                backAnimatedStyle,
                {
                  transform: [{ rotateY: "180deg" }],
                  backfaceVisibility: "hidden",
                  paddingHorizontal: wp("3%"),
                  paddingVertical: wp("2%"),
                },
              ]}
              className="w-full h-full bg-[#2a2a3a] rounded-lg justify-center items-center"
            >
              <Text className="text-white text-center">{backText}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={flipCard}>
            <Animated.View
              style={[
                frontAnimatedStyle,
                {
                  backfaceVisibility: "hidden",
                  paddingHorizontal: wp("3%"),
                  paddingVertical: wp("2%"),
                },
              ]}
              className="w-full h-full bg-[#2a2a3a] rounded-lg justify-center items-center"
            >
              <Text className="text-white text-center">{frontText}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <View
        className="flex-row bg-[#2a2a3a] rounded-lg"
        style={{ width: wp("%30"), paddingVertical: wp("2%"), gap: wp("2%") }}
      >
        <Pressable onPress={handleEdit}>
          <MaterialCommunityIcons
            name="note-edit-outline"
            size={wp("5%")}
            color="white"
          />
        </Pressable>
        <Pressable onPress={() => deleteWord(index)}>
          <MaterialCommunityIcons
            name="delete-empty-outline"
            size={wp("5%")}
            color="white"
          />
        </Pressable>
      </View>
    </>
  );
};

export default FlipCard;

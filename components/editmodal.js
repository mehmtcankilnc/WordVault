import { View, Text, Modal, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const Edit = ({ frontText, backText, index, handleVisibility, handleSave }) => {
  const [editedFrontText, setEditedFrontText] = useState(frontText);
  const [editedBackText, setEditedBackText] = useState(backText);

  return (
    <View
      className="flex-1 justify-center"
      style={{ padding: wp("5%"), backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <View
        className="bg-[#242333] rounded-xl items-center"
        style={{ padding: wp("5%") }}
      >
        <View
          className="flex-row items-center w-full"
          style={{ marginBottom: wp("4%") }}
        >
          <TextInput
            className="flex-1 bg-[#2a2a3a] text-white rounded-lg"
            style={{ paddingHorizontal: wp("3%"), paddingVertical: wp("2%") }}
            value={editedFrontText}
            onChangeText={setEditedFrontText}
            placeholder="Word"
            placeholderTextColor="#595959"
          />
          <FontAwesome5
            name="equals"
            size={wp("7%")}
            color="#595959"
            className="mx-3"
          />
          <TextInput
            className="flex-1 bg-[#2a2a3a] text-white rounded-lg"
            style={{ paddingHorizontal: wp("3%"), paddingVertical: wp("2%") }}
            value={editedBackText}
            onChangeText={setEditedBackText}
            placeholder="Meaning"
            placeholderTextColor="#595959"
          />
        </View>
        <View className="flex-row" style={{ gap: wp("5%") }}>
          <Pressable
            onPress={handleVisibility}
            className="flex-1 bg-[#6c4af7] rounded-xl items-center shadow-lg shadow-[#6c4af7]"
            style={{
              paddingVertical: wp("3%"),
              paddingHorizontal: wp("6%"),
              marginTop: wp("3%"),
            }}
          >
            <Text className="text-white font-bold text-lg">Close</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              handleSave(editedFrontText, editedBackText, index);
            }}
            className="flex-1 bg-[#6c4af7] rounded-xl items-center shadow-lg shadow-[#6c4af7]"
            style={{
              paddingVertical: wp("3%"),
              paddingHorizontal: wp("6%"),
              marginTop: wp("3%"),
            }}
          >
            <Text className="text-white font-bold text-lg">Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Edit;

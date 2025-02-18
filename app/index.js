import {
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const validationSchema = Yup.object({
  actualValue: Yup.string().required("Required!"),
  meaningValue: Yup.string().required("Required!"),
});

export default function Index() {
  const initialValues = {
    actualValue: "",
    meaningValue: "",
  };

  const addWord = async (values, { resetForm }) => {
    Keyboard.dismiss();
    if (values.actualValue.trim() && values.meaningValue.trim()) {
      try {
        const jsonValue = await AsyncStorage.getItem("WordVault");
        const storedWords = jsonValue ? JSON.parse(jsonValue) : [];

        const newWord = {
          actualValue: values.actualValue,
          meaningValue: values.meaningValue,
          mastered: false,
          unlearned: false,
        };

        storedWords.push(newWord);
        await AsyncStorage.setItem("WordVault", JSON.stringify(storedWords));

        Toast.show({
          type: "success",
          text1: "Word Added!",
          text2: "Changes have been saved!",
          visibilityTime: 1500,
        });
        resetForm();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="flex-1 bg-[#1a1a24] justify-around"
            style={{ padding: wp("4%") }}
          >
            {/* Başlık */}
            <View className="items-center" style={{ marginVertical: wp("9%") }}>
              <Text
                style={{
                  color: "#6c4af7",
                  fontSize: wp("9%"),
                  fontWeight: 800,
                  textAlign: "center",
                  textShadowColor: "black",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 3,
                }}
              >
                WordVault
              </Text>
              <Text
                className="text-white font-bold text-center"
                style={{ fontSize: wp("6%") }}
              >
                Powerful Words, Powerful Minds!
              </Text>
              <Text
                className="text-gray-400 self-start"
                style={{ marginTop: wp("2%"), paddingLeft: "4%" }}
              >
                Learn a new word every day,
              </Text>
              <Text
                className="text-gray-400 self-end"
                style={{ paddingRight: "4%" }}
              >
                strengthen your language!
              </Text>
            </View>
            {/* Resim */}
            <Image
              style={{
                width: wp("80%"),
                height: wp("80%"),
                marginLeft: wp("4%"),
              }}
              source={require("../assets/images/logo.png")}
            />
            {/* Input */}
            <View
              className="bg-[#242333] rounded-xl items-center"
              style={{ padding: wp("5%") }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={addWord}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  resetForm,
                }) => (
                  <>
                    <View
                      className="flex-row items-center w-full"
                      style={{ marginBottom: wp("4%") }}
                    >
                      <TextInput
                        className="flex-1 bg-[#2a2a3a] text-white rounded-lg"
                        style={{
                          paddingHorizontal: wp("3%"),
                          paddingVertical: wp("2%"),
                        }}
                        value={values.actualValue}
                        onChangeText={handleChange("actualValue")}
                        placeholder={
                          errors.actualValue
                            ? `Word ${errors.actualValue}`
                            : "Word"
                        }
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
                        style={{
                          paddingHorizontal: wp("3%"),
                          paddingVertical: wp("2%"),
                        }}
                        value={values.meaningValue}
                        onChangeText={handleChange("meaningValue")}
                        placeholder={
                          errors.meaningValue
                            ? `Meaning ${errors.meaningValue}`
                            : "Meaning"
                        }
                        placeholderTextColor="#595959"
                      />
                    </View>
                    <Pressable
                      onPress={handleSubmit}
                      className="bg-[#6c4af7] rounded-xl w-full items-center shadow-lg shadow-[#6c4af7]"
                      style={{
                        paddingVertical: wp("3%"),
                        paddingHorizontal: wp("5%"),
                        marginTop: wp("3%"),
                      }}
                    >
                      <Text className="text-white font-bold text-lg">Add</Text>
                    </Pressable>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

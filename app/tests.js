import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TestModal from "@/components/testmodal";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";

const Tests = () => {
  const [words, setWords] = useState([]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerItems, setPickerItems] = useState([
    { label: "Word Test", value: "actual_test" },
    { label: "Meaning Test", value: "meaning_test" },
  ]);

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testType, setTestType] = useState("");
  const [questionCount, setQuestionCount] = useState(null);

  const fetchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("WordVault");
      const storedWords = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storedWords && storedWords.length) {
        setWords(storedWords);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleTest = (values, { resetForm }) => {
    setTestModalOpen(true);
    setTestType(values.testType);
    setQuestionCount(values.questionCount);
    resetForm();
  };

  return (
    <View
      className="flex-1 bg-[#1a1a24]"
      style={{ padding: wp("4%"), paddingTop: wp("10%"), gap: wp("7%") }}
    >
      <View className="items-center" style={{ marginTop: wp("8%") }}>
        <Text
          style={{
            color: "#6c4af7",
            fontSize: wp("8%"),
            fontWeight: 600,
            textAlign: "center",
            textShadowColor: "black",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 3,
          }}
        >
          Tests
        </Text>
      </View>
      <View className="flex-1 justify-center " style={{ padding: wp("4%") }}>
        <View
          className="bg-[#242333] rounded-xl items-center"
          style={{ padding: wp("4%"), gap: wp("4%") }}
        >
          <Text className="text-white font-bold text-xl">Test Options</Text>
          <Formik
            initialValues={{ testType: "", questionCount: "" }}
            validationSchema={Yup.object({
              testType: Yup.string().required("Required!"),
              questionCount: Yup.number()
                .required("Required!")
                .max(
                  words.length,
                  "Questions cannot exceed more than your words!"
                ),
            })}
            onSubmit={handleTest}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              setFieldValue,
            }) => (
              <>
                <View
                  className="flex items-center w-full"
                  style={{ marginBottom: wp("4%") }}
                >
                  <DropDownPicker
                    open={pickerOpen}
                    value={values.testType}
                    items={pickerItems}
                    setOpen={setPickerOpen}
                    setItems={setPickerItems}
                    onSelectItem={(item) =>
                      setFieldValue("testType", item.value)
                    }
                    placeholder="Choose"
                    style={{ backgroundColor: "#2a2a3a", borderWidth: 0 }}
                    textStyle={{ color: "#fff" }}
                    dropDownContainerStyle={{
                      backgroundColor: "#2a2a3a",
                      borderWidth: 0,
                    }}
                    placeholderStyle={{ color: "#595959" }}
                    labelStyle={{ color: "white" }}
                  />
                  {errors.testType ? (
                    <Text
                      className="self-start text-red-800"
                      style={{ marginTop: wp("1%") }}
                    >
                      {errors.testType}
                    </Text>
                  ) : null}
                  <TextInput
                    className="flex w-full bg-[#2a2a3a] text-white rounded-lg"
                    style={{
                      marginTop: wp("4%"),
                      height: wp("14%"),
                      paddingHorizontal: wp("3%"),
                      paddingVertical: wp("2%"),
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={values.questionCount}
                    onChangeText={handleChange("questionCount")}
                    placeholder="Number of Questions"
                    placeholderTextColor="#595959"
                  />
                  {errors.questionCount ? (
                    <Text
                      className="self-start text-red-800"
                      style={{ marginTop: wp("1%") }}
                    >
                      {errors.questionCount}
                    </Text>
                  ) : null}
                </View>

                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSubmit();
                  }}
                  className="bg-[#6c4af7] rounded-xl w-full items-center shadow-lg shadow-[#6c4af7]"
                  style={{
                    paddingHorizontal: wp("6%"),
                    paddingVertical: wp("3%"),
                    marginTop: wp("3%"),
                  }}
                >
                  <Text className="text-white font-bold text-lg">Start</Text>
                </Pressable>
              </>
            )}
          </Formik>
        </View>
        <Modal visible={testModalOpen} transparent={true} animationType="fade">
          <TestModal
            testType={testType}
            questionCount={questionCount}
            handleClose={() => setTestModalOpen(false)}
            onTestComplete={fetchData}
          />
        </Modal>
      </View>
    </View>
  );
};

export default Tests;

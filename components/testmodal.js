import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const defaultTime = 15;
const durationMs = 1500;

const TestModal = ({
  testType,
  questionCount,
  handleClose,
  onTestComplete,
}) => {
  const [words, setWords] = useState([]);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [resultModal, setResultModal] = useState(false);
  const [timer, setTimer] = useState(defaultTime);
  const [correct, setCorrect] = useState(false);

  const rotationDegree = useRef(new Animated.Value(0)).current;

  const borderColorInterpolation = rotationDegree.interpolate({
    inputRange: [0, 360],
    outputRange: ["#595959", correct ? "#00bd00" : "#ad0202"],
  });

  const startAnimation = () => {
    const animation = Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    animation.start(() => {
      rotationDegree.setValue(0);
    });
  };

  const getRandomWords = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const fetchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("WordVault");
      const storedWords = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storedWords && storedWords.length) {
        setWords(storedWords);
        const randomWords = getRandomWords(storedWords, questionCount);
        if (testType === "actual_test") {
          setTestQuestions(randomWords.map((word) => word.meaningValue));
          setTestAnswers(randomWords.map((word) => word.actualValue));
        } else {
          setTestQuestions(randomWords.map((word) => word.actualValue));
          setTestAnswers(randomWords.map((word) => word.meaningValue));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timeLeft;

    if (timer > 0) {
      timeLeft = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswer();
    }

    return () => clearInterval(timeLeft);
  }, [timer]);

  const handleAnswer = () => {
    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      testAnswers[currentQuestionIndex].toLowerCase();

    setCorrect(isCorrect);
    startAnimation();
    setUserAnswer("");

    const currentWord =
      testType === "actual_test"
        ? words.find(
            (word) => word.meaningValue === testQuestions[currentQuestionIndex]
          )
        : words.find(
            (word) => word.actualValue === testQuestions[currentQuestionIndex]
          );

    const allOtherWords = words.filter(
      (word) => word.actualValue !== currentWord.actualValue
    );

    if (currentQuestionIndex < testQuestions.length - 1) {
      setTimeout(() => {
        if (isCorrect) {
          setTotalCorrect((prev) => prev + 1);
          handleUpdate(currentWord, true, false, allOtherWords);
        } else {
          setTotalWrong((prev) => prev + 1);
          handleUpdate(currentWord, false, true, allOtherWords);
        }

        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimer(defaultTime);
      }, durationMs);
    } else {
      setTimeout(() => {
        if (isCorrect) {
          setTotalCorrect((prev) => prev + 1);
          handleUpdate(currentWord, true, false, allOtherWords);
        } else {
          setTotalWrong((prev) => prev + 1);
          handleUpdate(currentWord, false, true, allOtherWords);
        }

        setResultModal(true);
      }, durationMs);
    }
  };

  const handleUpdate = async (currentWord, mastered, unlearned) => {
    try {
      const storedWords = await AsyncStorage.getItem("WordVault");
      const parsedWords = storedWords ? JSON.parse(storedWords) : [];

      const updatedWords = parsedWords.map((word) =>
        word.actualValue === currentWord.actualValue
          ? { ...word, mastered, unlearned }
          : word
      );

      await AsyncStorage.setItem("WordVault", JSON.stringify(updatedWords));
    } catch (error) {
      console.error("AsyncStorage Güncelleme Hatası:", error);
    }
  };

  const handleModalClose = () => {
    setResultModal(false);
    handleClose();
    if (onTestComplete) {
      onTestComplete();
    }
  };

  return (
    <View
      className="flex-1 justify-between"
      style={{ padding: wp("4%"), backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <View
        className="flex-1 bg-[#242333] rounded-xl justify-center items-center"
        style={{ padding: wp("5%") }}
      >
        {testQuestions.length > 0 && !resultModal && (
          <View className="flex items-center w-full" style={{ gap: wp("5%") }}>
            <Text
              style={{ color: "#6c4af7", fontSize: wp("9%"), fontWeight: 800 }}
            >
              {testQuestions[currentQuestionIndex]}
            </Text>
            <CountdownCircleTimer
              key={currentQuestionIndex}
              size={150}
              isPlaying
              duration={defaultTime}
              colors={["#8A2BE2", "#0096d6", "#ad0202"]}
              colorsTime={[10, 5, 0]}
              onComplete={() => {
                return { shouldRepeat: true, delay: 1 };
              }}
            >
              {({ remainingTime }) => (
                <Text style={{ fontSize: wp("15%"), color: "white" }}>
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
            <View className="w-full">
              <Animated.View
                className="w-full rounded-lg"
                style={{
                  borderWidth: 2,
                  borderColor: borderColorInterpolation,
                }}
              >
                <TextInput
                  className="bg-[#2a2a3a] text-white rounded-lg"
                  style={{
                    height: wp("14%"),
                    paddingHorizontal: wp("3%"),
                    paddingVertical: wp("2%"),
                  }}
                  placeholder="Answer"
                  placeholderTextColor="#595959"
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                />
              </Animated.View>
            </View>

            <Pressable
              onPress={handleAnswer}
              className="bg-[#6c4af7] rounded-xl w-full items-center shadow-lg shadow-[#6c4af7]"
              style={{
                paddingHorizontal: wp("6%"),
                paddingVertical: wp("3%"),
                marginTop: wp("3%"),
              }}
            >
              <Text className="text-white font-bold text-lg">Submit</Text>
            </Pressable>
            <Pressable
              onPress={handleClose}
              className="bg-[#6c4af7] rounded-xl w-full items-center shadow-lg shadow-[#6c4af7]"
              style={{
                paddingHorizontal: wp("6%"),
                paddingVertical: wp("3%"),
                marginTop: wp("3%"),
              }}
            >
              <Text className="text-white font-bold text-lg">Exit</Text>
            </Pressable>
          </View>
        )}
        <Modal
          visible={resultModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setResultModal(false);
            handleClose();
          }}
        >
          <View
            className="flex-1 justify-center items-center w-full"
            style={{ gap: wp("5%") }}
          >
            <Text
              style={{ color: "#6c4af7", fontSize: wp("9%"), fontWeight: 800 }}
            >
              Results
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              Corrects: {totalCorrect}
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              Wrongs: {totalWrong}
            </Text>
            <Text className="text-white text-2xl font-bold text-center">
              Total Questions: {questionCount}
            </Text>
            <Pressable
              onPress={handleModalClose}
              className="bg-[#6c4af7] rounded-xl items-center shadow-lg shadow-[#6c4af7]"
              style={{
                paddingHorizontal: wp("6%"),
                paddingVertical: wp("3%"),
                marginTop: wp("3%"),
              }}
            >
              <Text className="text-white font-bold text-lg">Close</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default TestModal;

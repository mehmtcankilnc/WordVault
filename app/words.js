import { View, Text, Pressable, FlatList, Modal } from "react-native";
import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import FlipCard from "@/components/flipcard";
import Edit from "@/components/editmodal";
import Toast from "react-native-toast-message";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const Words = () => {
  const [words, setWords] = useState([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("WordVault");
      const storedWords = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storedWords && storedWords.length) {
        setWords(storedWords.sort((a, b) => b.id - a.id));

        if (selectedFilter === "all") {
          setFilteredWords(storedWords);
        } else if (selectedFilter === "learned") {
          setFilteredWords(
            storedWords.filter((word) => word.mastered && !word.unlearned)
          );
        } else if (selectedFilter === "unlearned") {
          setFilteredWords(
            storedWords.filter((word) => !word.mastered && word.unlearned)
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [words])
  );

  const handleFilter = (filterType) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setFilteredWords(words);
    } else if (filterType === "learned") {
      setFilteredWords(
        words.filter((word) => word.mastered && !word.unlearned)
      );
    } else if (filterType === "unlearned") {
      setFilteredWords(
        words.filter((word) => !word.mastered && word.unlearned)
      );
    }
  };

  const deleteWord = async (index) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const jsonValue = await AsyncStorage.getItem("WordVault");
      let storedWords = jsonValue != null ? JSON.parse(jsonValue) : [];

      if (storedWords.length > index) {
        storedWords.splice(index, 1);
        await AsyncStorage.setItem("WordVault", JSON.stringify(storedWords));

        setWords(storedWords);
        setFilteredWords(
          storedWords.filter((word) => {
            if (selectedFilter === "all") return true;
            if (selectedFilter === "learned")
              return word.mastered && !word.unlearned;
            if (selectedFilter === "unlearned")
              return !word.mastered && word.unlearned;
          })
        );

        Toast.show({
          type: "success",
          text1: "Word Deleted!",
          text2: "Changes have been saved!",
          visibilityTime: 1500,
        });
      }
    } catch (error) {
      console.error("Delete Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while deleting!",
        visibilityTime: 1500,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (newActual, newMeaning, index) => {
    try {
      const jsonValue = await AsyncStorage.getItem("WordVault");
      const storedWords = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storedWords && storedWords.length) {
        storedWords[index] = {
          ...storedWords[index],
          actualValue: newActual,
          meaningValue: newMeaning,
        };
      }
      await AsyncStorage.setItem("WordVault", JSON.stringify(storedWords));

      setWords(storedWords);
      setSelectedWordIndex(null);

      Toast.show({
        type: "success",
        text1: "Word Updated!",
        text2: "Changes have been saved!",
        visibilityTime: 1500,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while saving the word!",
        visibilityTime: 1500,
      });
    }
  };

  return (
    <View
      className="flex-1 bg-[#1a1a24]"
      style={{ padding: wp("4%"), paddingTop: wp("10%"), gap: wp("7%") }}
    >
      {/* Başlık */}
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
          Words
        </Text>
      </View>
      {/* Filtreler */}
      <View
        className="flex-row justify-between"
        style={{ height: wp("12%"), gap: wp("2%") }}
      >
        {["learned", "all", "unlearned"].map((filter) => (
          <Pressable
            key={filter}
            onPress={() => handleFilter(filter)}
            className="flex-1 bg-[#2a2a3a] justify-center rounded-lg"
          >
            <Text
              className={`text-base self-center ${
                selectedFilter === filter ? "text-white" : "text-[#595959]"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      {/* Kelimeler */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            className="bg-[#242333] rounded-xl items-center"
            style={{ padding: wp("5%"), marginBottom: wp("4%") }}
          >
            <View
              className="flex-row items-center w-full"
              style={{ gap: wp("4%") }}
            >
              <FlipCard
                frontText={item.actualValue}
                backText={item.meaningValue}
                index={index}
                deleteWord={deleteWord}
                handleEdit={() => setSelectedWordIndex(index)}
              />
            </View>
            <View>
              <Modal
                visible={selectedWordIndex === index}
                animationType="fade"
                onRequestClose={() => setSelectedWordIndex(null)}
                transparent={true}
              >
                <Edit
                  frontText={item.actualValue}
                  backText={item.meaningValue}
                  index={index}
                  handleVisibility={() => setSelectedWordIndex(null)}
                  handleSave={handleSave}
                />
              </Modal>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Words;

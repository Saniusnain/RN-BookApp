import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const BookReadButton = () => {
  return (
    <View className="absolute bottom-6 left-6 right-6">
      <TouchableOpacity
        className="bg-[#3bdf9d] rounded-2xl py-4 flex-row justify-center items-center shadow-md elevation-md"
        activeOpacity={0.8}
      >
        <Ionicons name="checkmark" size={20} color="white" />
        <Text className="text-white font-bold text-lg ml-2 tracking-wide">
          Book Read
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookReadButton;

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const SearchHeader = () => {
  return (
    <View className="flex-row items-center px-4 pt-2 pb-4">
      <TouchableOpacity className="p-2">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text className="flex-1 text-center text-lg font-medium text-gray-900 mr-8">
        Search Book
      </Text>
    </View>
  );
};

export default SearchHeader;

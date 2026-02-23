import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const DetailHeader = ({ onBack }: { onBack: () => void }) => {
  return (
    <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
      <TouchableOpacity className="p-2" onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2" onPress={onBack}>
        <Ionicons name="search-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default DetailHeader;

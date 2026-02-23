import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash.debounce";

import { searchBooks } from "../api/books";
import { OpenLibraryBook } from "../types";
import SearchHeader from "../components/SearchHeader";

const SearchLayout = ({
  onSelectBook,
}: {
  onSelectBook: (book: OpenLibraryBook) => void;
}) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(searchQuery);
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((nextValue: string) => {
      loadBooks(nextValue);
    }, 600),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const renderItem = ({ item }: { item: OpenLibraryBook }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      className="px-5 py-4 border-b border-gray-100"
      onPress={() => onSelectBook(item)}
    >
      <Text
        className="text-[#20B2AA] font-bold text-base mb-1"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <Text className="text-gray-400 text-sm" numberOfLines={1}>
        by {item.author_name ? item.author_name.join(", ") : "Unknown Author"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <SearchHeader />

      <View className="px-5 mb-2">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-12">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Book title or author"
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={handleChangeText}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#20B2AA" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  );
};

export default SearchLayout;

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  fetchBookRating,
  fetchAuthorDetails,
  fetchWorkDetails,
  fetchGoogleBooksRating,
} from "../api/books";
import { OpenLibraryBook, BookRating, GoogleBooksRating } from "../types";
import BookReadButton from "../components/BookReadButton";
import DetailHeader from "../components/DetailHeader";

const BookDetailLayout = ({
  book,
  onBack,
}: {
  book: OpenLibraryBook;
  onBack: () => void;
}) => {
  const [rating, setRating] = useState<BookRating | null>(null);
  const [authorBio, setAuthorBio] = useState<string>(
    "Loading author details...",
  );
  const [overview, setOverview] = useState<string>("Loading description...");

  const [googleRating, setGoogleRating] = useState<GoogleBooksRating | null>(
    null,
  );
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchExtraData = async () => {
      // Fetch ratings
      const rat = await fetchBookRating(book.key);
      if (isMounted && rat) setRating(rat);

      // Fetch overview summary
      const work = await fetchWorkDetails(book.key);
      if (isMounted) {
        if (work?.description) {
          setOverview(
            typeof work.description === "string"
              ? work.description
              : work.description.value,
          );
        } else {
          setOverview("No overview available for this book.");
        }
      }

      // Fetch author bio
      if (book.author_key && book.author_key.length > 0) {
        const authId = book.author_key[0];
        const authDetails = await fetchAuthorDetails(authId);
        if (isMounted) {
          if (authDetails?.bio) {
            setAuthorBio(
              typeof authDetails.bio === "string"
                ? authDetails.bio
                : authDetails.bio.value,
            );
          } else {
            setAuthorBio(
              "Author details are currently unavailable from the public database.",
            );
          }
        }
      } else {
        if (isMounted) setAuthorBio("Unknown Author.");
      }

      // Fetch Google Books rating
      if (isMounted) setGoogleLoading(true);
      const authorToSearch = book.author_name ? book.author_name[0] : "";
      const gRating = await fetchGoogleBooksRating(book.title, authorToSearch);
      if (isMounted) {
        setGoogleRating(gRating);
        setGoogleLoading(false);
      }
    };

    fetchExtraData();

    return () => {
      isMounted = false;
    };
  }, [book]);

  const imageUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/400x600.png?text=No+Cover";

  const authorName = book.author_name
    ? book.author_name.join(", ")
    : "Unknown Author";

  const displayScore = rating?.average ? rating.average.toFixed(1) : "4.0";
  const totalReviews = rating?.count ? rating.count : "350";
  const fullStars = Math.floor(Number(displayScore));
  const hasHalfStar = Number(displayScore) % 1 >= 0.5;

  return (
    <View className="flex-1 bg-white">
      <DetailHeader onBack={onBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Book Cover */}
        <View className="items-center mt-2 px-6">
          <View className="shadow-lg elevation-xl bg-white rounded-2xl">
            <Image
              source={{ uri: imageUrl }}
              className="w-56 h-80 rounded-2xl bg-gray-100"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="items-center px-6 mt-6">
          <Text className="text-2xl font-extrabold text-gray-900 text-center mb-1">
            {book.title}
          </Text>
          <Text className="text-base text-gray-500 mb-1">{authorName}</Text>
          {!!book.first_publish_year && (
            <Text className="text-sm text-gray-400">
              Published in {book.first_publish_year}
            </Text>
          )}

          {/* Ratings section */}
          <View className="flex-row items-center justify-center mt-3">
            <>
              {[...Array(fullStars)].map((_, i) => (
                <Ionicons
                  key={`star-${i}`}
                  name="star"
                  color="#FACC15"
                  size={16}
                />
              ))}

              {hasHalfStar ? (
                <Ionicons name="star-half" color="#FACC15" size={16} />
              ) : (
                <Ionicons name="star-outline" color="#FACC15" size={16} />
              )}
            </>
            <Text className="ml-2 font-bold text-gray-700 text-sm">
              {displayScore}{" "}
              <Text className="font-normal text-gray-400">
                ({totalReviews} reviews)
              </Text>
            </Text>
          </View>
        </View>

        {/* Descriptions section */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-gray-900 mb-2">
            About the author
          </Text>
          <Text className="text-sm text-gray-500 leading-6 text-justify">
            {authorBio}
          </Text>

          <Text className="text-lg font-bold text-gray-900 mt-6 mb-2">
            Overview
          </Text>
          <Text className="text-sm text-gray-500 leading-6 text-justify">
            {overview}
          </Text>
        </View>

        {/* GOOGLE  Section */}
        <View className="mt-8 px-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Ratings & Reviews
          </Text>

          {googleLoading ? (
            <ActivityIndicator color="#20B2AA" className="mt-2" />
          ) : googleRating ? (
            <>
              {googleRating.averageRating > 0 && (
                <View className="p-4 flex-row items-center  bg-gray-50 rounded-xl border border-gray-100 mb-4">
                  <View className="items-center justify-center mr-4">
                    <Text className="text-2xl font-extrabold text-gray-800">
                      {googleRating.averageRating.toFixed(1)}/5
                    </Text>
                    <Text className="text-sm text-gray-500 font-medium mt-1"></Text>
                  </View>
                  <View className="flex-1 ml-2">
                    <Text className="text-xs text-gray-500 mb-2">
                      {googleRating.ratingsCount.toLocaleString()} ratings on
                      Google Books
                    </Text>
                    {googleRating.categories.length > 0 && (
                      <View className="flex-row flex-wrap">
                        {googleRating.categories.slice(0, 3).map((cat, i) => (
                          <View
                            key={i}
                            className="bg-white border border-gray-200 rounded-full px-2 py-1 mr-2 mb-1"
                          >
                            <Text className="text-xs text-gray-600 font-medium ">
                              Category: {cat}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* G-Review */}
              {googleRating.reviews.map((review, idx) => {
                return (
                  <View
                    key={idx}
                    className="bg-white rounded-xl  mb-3 shadow-sm elevation-sm"
                  >
                    <View className="flex-row items-center mb-2">
                      <Text className="text-sm font-bold text-gray-700">
                        {review.source}
                      </Text>
                    </View>
                    <ScrollView>
                      <Text className="text-sm text-gray-600 leading-5">
                        {review.snippet}
                      </Text>
                    </ScrollView>
                  </View>
                );
              })}

              {googleRating.averageRating === 0 &&
                googleRating.reviews.length === 0 && (
                  <Text className="text-sm text-gray-500 italic text-center py-4">
                    No ratings found on Google Books.
                  </Text>
                )}
            </>
          ) : (
            <Text className="text-sm text-gray-500 italic text-center py-4">
              Could not load ratings for this book.
            </Text>
          )}
        </View>
      </ScrollView>

      <BookReadButton />
    </View>
  );
};

export default BookDetailLayout;

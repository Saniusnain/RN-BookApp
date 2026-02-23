import React, { useState } from "react";
import { OpenLibraryBook } from "../types";
import SearchLayout from "../layout/SearchLayout";
import BookDetailLayout from "../layout/BookDetailLayout";

const HomeScreen = () => {
  const [selectedBook, setSelectedBook] = useState<OpenLibraryBook | null>(
    null,
  );

  if (selectedBook) {
    return (
      <BookDetailLayout
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return <SearchLayout onSelectBook={setSelectedBook} />;
};

export default HomeScreen;

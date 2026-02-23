import {
  OpenLibrarySearchResponse,
  OpenLibraryBook,
  BookRating,
  AuthorDetails,
  WorkDetails,
  GoogleBooksRating,
} from "../types";

const SEARCH_URL = "https://openlibrary.org/search.json";

export const searchBooks = async (
  query: string,
  limit: number = 20,
): Promise<OpenLibraryBook[]> => {
  try {
    const response = await fetch(
      `${SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,cover_i,author_key`,
    );

    if (!response.ok) {
      throw new Error(`Open Library API Error: ${response.status}`);
    }

    const data: OpenLibrarySearchResponse = await response.json();
    return data.docs;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred while fetching books.");
  }
};

export const fetchBookRating = async (
  workKey: string,
): Promise<BookRating | null> => {
  try {
    const response = await fetch(
      `https://openlibrary.org${workKey}/ratings.json`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.summary) {
      return { average: data.summary.average, count: data.summary.count };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const fetchAuthorDetails = async (
  authorKey: string,
): Promise<AuthorDetails | null> => {
  try {
    const response = await fetch(
      `https://openlibrary.org/authors/${authorKey}.json`,
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchWorkDetails = async (
  workKey: string,
): Promise<WorkDetails | null> => {
  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchGoogleBooksRating = async (
  title: string,
  author: string,
): Promise<GoogleBooksRating | null> => {
  try {
    const q = encodeURIComponent(
      `intitle:${title.slice(0, 50)}${author ? `+inauthor:${author.split(" ").slice(-1)[0]}` : ""}`,
    );
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5&printType=books`,
    );
    if (!res.ok) return null;

    const data = await res.json();
    const items: any[] = data.items ?? [];
    const info = items.sort(
      (a, b) =>
        (b.volumeInfo?.averageRating ? 1 : 0) -
        (a.volumeInfo?.averageRating ? 1 : 0),
    )[0]?.volumeInfo;
    if (!info) return null;

    return {
      averageRating: info.averageRating ?? 0,
      ratingsCount: info.ratingsCount ?? 0,
      reviews: info.description
        ? [
            {
              source: "Google Books",
              snippet: info.description,
            },
          ]
        : [],
      categories: info.categories ?? [],
      publisher: info.publisher,
      publishedDate: info.publishedDate,
      googleDescription: info.description,
    };
  } catch {
    return null;
  }
};

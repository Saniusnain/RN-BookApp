export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  author_key?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  docs: OpenLibraryBook[];
}

export interface BookRating {
  average: number;
  count: number;
}

export interface AuthorDetails {
  name: string;
  bio?: string | { value: string };
}

export interface WorkDetails {
  description?: string | { value: string };
}

export interface GoogleReviewSnippet {
  source: string;
  snippet: string;
}

export interface GoogleBooksRating {
  averageRating: number;
  ratingsCount: number;
  reviews: GoogleReviewSnippet[];
  categories: string[];
  publisher?: string;
  publishedDate?: string;
  googleDescription?: string;
}

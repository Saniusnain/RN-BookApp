# Book Exploration App

A React Native mobile application for exploring books, authors, and ratings. Built using **Open Library API** and **Google books API** and styled smoothly using **NativeWind** (Tailwind CSS for React Native).

---

## Technology Stack

- **React Native Framework**  
- **TypeScript**
- **Styling: Tailwind for React Native**

---

## Setup & Installation

Follow these steps to quickly begin testing the app locally:

1. **Clone/Navigate** into the main app directory:

2. **Install all native node modules:** (They should be natively initialized already)
   ```bash
   npm install
   ```

3. **Launch the Metro Bundler with a Clear Cache** 
   *(Crucial step! We modified the `babel.config.js` to ingest Tailwind styling properly!)*
   ```bash
   npx expo start -c
   ```

4. Press `i` to launch in your **iOS Simulator** or `a` to load it natively onto your **Android Emulator**. 

---

## Open Library Endpoints Utilized
- Standard search parameters: `https://openlibrary.org/search.json?q=`
- Cover mapping parameters: `https://covers.openlibrary.org/b/id/...`
- Ratings arrays: `https://openlibrary.org/works/[id]/ratings.json`
- Specific Work arrays: `https://openlibrary.org/works/[id].json`
- Author namespace logic arrays: `https://openlibrary.org/authors/[id].json`
- Google Ratings and Reviews: `https://www.googleapis.com/books/v1/volumes?q=intitle:[title]&maxResults=5&printType=books`

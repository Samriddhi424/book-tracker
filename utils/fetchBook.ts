
import axios from 'axios';
import Constants from 'expo-constants';
const GOOGLE_BOOKS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_BOOKS_API_KEY;
export const fetchBookDetails = async (isbn: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    const item = response.data.items?.[0];
    if (!item) throw new Error('Book not found');

    const volume = item.volumeInfo;

    return {
      title: volume.title,
      authors: volume.authors || ['Unknown'],
      image: volume.imageLinks?.thumbnail || '',
    };
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return null;
  }
};

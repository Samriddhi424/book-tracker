import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';
import { useRouter } from 'expo-router';
export default function Library() {
  const [books, setBooks] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const fetchedBooks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setBooks(fetchedBooks);
    });
    return unsubscribe;
  }, []);
  const updateRating = async (bookId: string, rating: number) => {
    try {
      await updateDoc(doc(db, 'books', bookId), { rating });
    } catch (err) {
      console.error('Failed to update rating', err);
    }
  };
  const confirmDelete = (bookId: string) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'books', bookId));
            } catch (err) {
              console.error('Failed to delete book', err);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.authors?.join(', ')}</Text>
        {item.dateScanned && (
          <Text style={styles.date}>
            Scanned on: {new Date(item.dateScanned.seconds * 1000).toLocaleDateString()}
          </Text>
        )}
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => updateRating(item.id, i)}>
              <Ionicons
                name={i <= item.rating ? 'heart' : 'heart-outline'}
                size={22}
                color="#e16760"
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>The Stacked Shelf</Text>

      <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
        <Text style={styles.backText}>←Home</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f7',
    paddingTop: 40,
    paddingHorizontal: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ce6266',
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(225, 103, 96, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  author: {
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e16760',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});

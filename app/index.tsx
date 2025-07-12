import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>PaperTrail</Text>
        <Image
          source={require('../assets/images/hero.png')}
          style={styles.image}
        />
        <Text style={styles.subtitle}>
        Your digital breadcrumb trail of books.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/scan')}>
          <Text style={styles.buttonText}>Scan a Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/library')}>
          <Text style={styles.buttonText}>Scanned Books</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f7',
  },
  heading: {
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#e68264',
  },
  image: {
    width: 280,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#58848f',
    marginBottom: 24,
    fontWeight: 'italic',
  },
  button: {
    backgroundColor: '#ce6266', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 16,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#ce6266',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

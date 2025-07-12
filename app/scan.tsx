import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';
import { fetchBookDetails } from '../utils/fetchBook';
export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const scanningRef = useRef(true); 
  const router = useRouter();
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera permission to scan barcodes.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!scanningRef.current) return; 
    scanningRef.current = false;      
    setScannedData(data);
    try {
      const book = await fetchBookDetails(data);
      if (book) {
        await addDoc(collection(db, 'books'), {
          ...book,
          dateScanned: Timestamp.now(),
          rating: 0,
        });
        router.push('/library');
      } else {
        alert('Book not found or invalid barcode');
        scanningRef.current = true; 
        setScannedData(null);
      }
    } catch (error) {
      console.error('Error scanning book:', error);
      scanningRef.current = true;
      setScannedData(null);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan the Book Barcode</Text>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
        }}
      />
      {scannedData && (
        <Button
          title="Scan Another Book"
          onPress={() => {
            setScannedData(null);
            scanningRef.current = true; 
          }}
        />
      )}
      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
      >
        <Text style={styles.flipText}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  flipButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#ce6266',
    borderRadius: 8,
  },
  flipText: {
    color: '#fff',
    fontWeight: '600',
  },
});

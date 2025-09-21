import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider, Input, InputField, Button, ButtonText, Text, VStack } from '@/components/ui';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitas conceder permisos para guardar videos.');
      return false;
    }
    return true;
  };

  const downloadVideo = async () => {
    if (!url) {
      Alert.alert('Error', 'Ingresa una URL de YouTube válida.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDownloading(true);
    const apiUrl = `http://localhost:3000/download?url=${encodeURIComponent(url)}`; // Cambia localhost por tu IP si es necesario
    const fileUri = `${FileSystem.documentDirectory}${Date.now()}.mp4`;

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        apiUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Progreso: ${(progress * 100).toFixed(2)}%`);
          // Puedes mostrar progreso en UI si quieres
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Éxito', 'Video descargado y guardado en la galería.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo descargar el video: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <NavigationContainer>
      <GluestackUIProvider mode="light">
        <View style={styles.container}>
          <VStack space="md" alignItems="center">
            <Text size="xl">Descargador de Videos de YouTube</Text>
            <Input variant="outline" size="md" style={{ width: '80%' }}>
              <InputField placeholder="Ingresa URL de YouTube" value={url} onChangeText={setUrl} />
            </Input>
            <Button onPress={downloadVideo} disabled={downloading}>
              <ButtonText>{downloading ? 'Descargando...' : 'Descargar'}</ButtonText>
            </Button>
          </VStack>
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
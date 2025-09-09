import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider/index";
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";
// import { NativeBaseProvider, extendTheme } from "native-base";

// Define una configuración personalizada para NativeBase
// const config = {
//   suppressColorAccessibilityWarning: true,
//   // Deshabilita las advertencias de SSRProvider
//   useRNUILib: false
// };

// Extiende el tema predeterminado
// const theme = extendTheme({ config });

export default function App() {
  return (
    <NavigationContainer>
      <GluestackUIProvider mode="light">
        <View style={styles.container}>
          <Text>AppChat</Text>
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


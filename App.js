// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your !</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';  // Import Expo Location API

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);  // State to store location data
  const [errorMsg, setErrorMsg] = useState(null);  // State to handle errors

  // Function to get the user's current location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  // Simulate an API call or some asynchronous task
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Hide the loading screen after 3 seconds
      getLocation();  // Fetch location after loading
    }, 3000);
  }, []);

  if (isLoading) {
    // Loading screen with an image
    return (
      <View style={styles.container}>
        <Image 
          source={require('./assets/4781517.png')} // Your custom loading image
          style={styles.loadingImage}
        />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Display the location or error message after loading
  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`;
  }

  // Main content once loading is complete
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImage: {
    width: 100,    // Set the desired width
    height: 100,   // Set the desired height
    marginBottom: 20,  // Space between the image and the text
  }
});





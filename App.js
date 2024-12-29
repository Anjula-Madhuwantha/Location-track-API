import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [employeeId, setEmployeeId] = useState(''); 

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
      getLocation(); 
    }, 3000);
  }, []);

  // Function to handle check-in
  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }

    if (!employeeId) {
      Alert.alert("Error", "Please enter your employee ID");
      return;
    }

    const { latitude, longitude } = location.coords;

    try {
      const response = await fetch("http://192.168.160.97:8082/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Version": "v1"
        },
        body: JSON.stringify({
          employeeId: parseInt(employeeId), 
          latitude,
          longitude
        }),
      });

      const result = await response.text();
      Alert.alert("Check-In Response", result);
    } catch (error) {
      Alert.alert("Error", "Failed to check in");
    }
  };

  // Function to handle check-out
  const handleCheckOut = async () => {
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }

    if (!employeeId) {
      Alert.alert("Error", "Please enter your employee ID");
      return;
    }

    const { latitude, longitude } = location.coords;

    try {
      const response = await fetch("http://192.168.160.97:8082/check-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Version": "v1"
        },
        body: JSON.stringify({
          employeeId: parseInt(employeeId), 
          latitude,
          longitude
        }),
      });

      const result = await response.text();
      Alert.alert("Check-Out Response", result);
    } catch (error) {
      Alert.alert("Error", "Failed to check out");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/4781517.png')}
          style={styles.loadingImage}
        />
        <Text>Loading...</Text>
      </View>
    );
  }

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      
      {/* Employee ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Employee ID"
        keyboardType="numeric"
        value={employeeId}
        onChangeText={setEmployeeId}
      />

      <Button title="Check-In" onPress={handleCheckIn} />
      <Button title="Check-Out" onPress={handleCheckOut} />
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
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingLeft: 10,
  },
});






import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './api';

const App = () => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [randomData, setRandomData] = useState(null);

  // Function to generate random data
  const simulateBluetoothData = () => {
    const randomNum = Math.floor(Math.random() * 100);
    setRandomData(randomNum);
    saveDataOffline(randomNum);
  };

  // Store data locally
  const saveDataOffline = async (randomNum) => {
    try {
      const storedData = await AsyncStorage.getItem('bluetoothData');
      const dataArr = storedData ? JSON.parse(storedData) : [];
      dataArr.push(randomNum);
      await AsyncStorage.setItem('bluetoothData', JSON.stringify(dataArr));
      setData(dataArr);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  // Sync with cloud when online
  const syncDataWithCloud = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bluetoothData');
      const dataArr = storedData ? JSON.parse(storedData) : [];
      if (dataArr.length) {
        await axios.post('/upload', { data: dataArr });
        await AsyncStorage.removeItem('bluetoothData');
      }
    } catch (e) {
      console.error('Failed to sync data', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Device Simulation</Text>
      {isConnected ? (
        <>
          <Button title="Read Data" onPress={simulateBluetoothData} />
          {randomData && <Text>Data: {randomData}</Text>}
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>Stored Data: {item}</Text>}
          />
        </>
      ) : (
        <Button title="Connect to Bluetooth" onPress={() => setIsConnected(true)} />
      )}
      <Button title="Sync Data" onPress={syncDataWithCloud} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});

export default App;

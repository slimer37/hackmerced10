import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MedicineSearch() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={'google'}
        // centered on UC Merced
        initialRegion={{
          latitude: 37.3647,
          longitude: -120.4241,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

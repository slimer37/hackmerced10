import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MedicineSearch() {

  const pharmacies = [
    { id: 1, name: 'CVS Merced', latitude: 37.319733, longitude: -120.479582 },
    { id: 2, name: 'Walgreens Merced', latitude: 37.318074, longitude: -120.467944 },
    { id: 3, name: "Raley's Pharmacy", latitude: 37.331167, longitude: -120.468863},
    // Add more pharmacies as needed
  ];
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.3647,
          longitude: -120.4241,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
          />
        ))}
      </MapView>
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

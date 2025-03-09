import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

interface SearchParams {
  data: any,
  placeholder: string
}

function SearchDropdown({ data, placeholder = "Search..." }: SearchParams) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text: any) => {
    setQuery(text);
    if (text.length > 0) {
      const results = data.filter((item: any) => item.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(results);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: 10 }}>
      <View style={styles.searchBox}>
        <FontAwesome size={20} name="search" color="black" style={{ margin: 'auto', marginRight: 10 }} />
        <TextInput
          style={{ flex: 1 }}
          value={query}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor={'#909090'}
          returnKeyType='search'
        />
      </View>
      {filteredData.length > 0 && (
        <View style={{ borderWidth: 1, borderRadius: 5, marginTop: 5, backgroundColor: "white" }}>
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setQuery(item.name)}>
                <Text style={{ padding: 10, borderBottomWidth: 1 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default function MedicineSearch() {
  const [query, setQuery] = useState<string>('');

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
      <SearchDropdown data={pharmacies} placeholder='Type a medication or pharmacy...' />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginHorizontal: 'auto',
    backgroundColor: 'white',
    width: '90%',
    height: 50,
    paddingHorizontal: 20,
    margin: 10,
    justifyContent: 'center',
    alignContent: 'center',
    shadowOpacity: 0.5,
    borderRadius: 20,
    flexDirection: 'row'
  },
  input: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

export default function MyMedicine() {
  const [time, setTime] = useState(new Date());
  
  const [medicines, setMedicines] = useState([
    { id: "1", name: "Paracetamol", time: new Date("2025-01-01T08:00:00") },
    { id: "2", name: "Ibuprofen", time: new Date("2025-01-01T12:00:00") },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setTime(currentDate);
  };

  const addMedicine = () => {
    if (newMedicine.trim() === "") {
      alert("Please enter a medicine name.");
      return;
    }

    const newMed = {
      id: Date.now().toString(),
      name: newMedicine,
      time: time,
    };

    setMedicines([...medicines, newMed]);
    setNewMedicine("");
    setModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        My Medicines
      </Text>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>Take at: {item.time.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Medicine</Text>
      </TouchableOpacity>

      {/* Modal for Adding Medicine */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              Add New Medicine
            </Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="gray"
              value={newMedicine}
              onChangeText={setNewMedicine}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
              returnKeyType="done"
            />

            <Text>When should this be taken?</Text>

            <DateTimePicker
              style={{alignSelf: 'center'}}
              accentColor="black"
              textColor="black"
              testID="dateTimePicker"
              value={time}
              mode="time"
              is24Hour={false}
              onChange={onChange}
              display="spinner"
            />

            <Button title="Add" onPress={addMedicine} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

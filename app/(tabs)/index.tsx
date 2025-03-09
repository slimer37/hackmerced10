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

export default function MyMedicine() {
  const [medicines, setMedicines] = useState([
    { id: "1", name: "Paracetamol", time: "8:00 AM" },
    { id: "2", name: "Ibuprofen", time: "12:00 PM" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("");

  const addMedicine = () => {
    if (newMedicine.trim() === "" || newTime.trim() === "") {
      alert("Please enter both medicine name and time.");
      return;
    }

    const newMed = {
      id: Date.now().toString(),
      name: newMedicine,
      time: newTime,
    };

    setMedicines([...medicines, newMed]);
    setNewMedicine("");
    setNewTime("");
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
            <Text style={{ color: "gray" }}>Take at: {item.time}</Text>
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
              placeholder="Medicine Name"
              value={newMedicine}
              onChangeText={setNewMedicine}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
            />

            <TextInput
              placeholder="Time (e.g., 8:00 AM)"
              value={newTime}
              onChangeText={setNewTime}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
            />

            <Button title="Add" onPress={addMedicine} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

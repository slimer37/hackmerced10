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
  const [medicines, setMedicines] = useState([
    { id: "1", name: "Paracetamol", time: "8:00 AM" },
    { id: "2", name: "Ibuprofen", time: "12:00 PM" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Add medicine to the list
  const addMedicine = () => {
    if (newMedicine.trim() === "") {
      alert("Please enter the medicine name.");
      return;
    }

    // Format time for display (in 12-hour format)
    const formattedTime = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMed = {
      id: Date.now().toString(),
      name: newMedicine,
      time: formattedTime,
    };

    setMedicines([...medicines, newMed]);
    setNewMedicine(""); // Reset the new medicine input
    setNewTime(new Date()); // Reset the time picker to the current time
    setModalVisible(false); // Close modal after adding
  };

  // Handle time selection from DateTimePicker
  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || newTime;
    setShowPicker(false); // Hide the picker after selecting a time
    setNewTime(currentDate); // Update selected time
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        My Medicines
      </Text>

      {/* List medicines */}
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

      {/* Button to open modal for adding new medicine */}
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

            {/* Input for medicine name */}
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

            {/* Button to open time picker */}
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            r
              <DateTimePicker
                value={newTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            

            {/* Buttons to confirm or cancel */}
            <Button title="Add" onPress={addMedicine} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

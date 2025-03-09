import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons"; // For dropdown icon
import { useAuth0 } from "react-native-auth0";

export default function MyMedicine() {
  const {user} = useAuth0();
  const [time, setTime] = useState(new Date());
  const [medicines, setMedicines] = useState([
    { id: "1", name: "Paracetamol", time: new Date("2025-01-01T08:00:00"), dosage: "500mg", frequency: "Twice a day" },
    { id: "2", name: "Ibuprofen", time: new Date("2025-01-01T12:00:00"), dosage: "200mg", frequency: "Once a day" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newFrequency, setNewFrequency] = useState("");
  const [expandedMedicineId, setExpandedMedicineId] = useState<string | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);

  const onChange = (_event: any, selectedDate: any) => {
    setTime(selectedDate || time);
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
      dosage: newDosage,
      frequency: newFrequency,
    };

    setMedicines([...medicines, newMed]);
    resetForm();
  };

  const editMedicine = () => {
    if (newMedicine.trim() === "") {
      alert("Please enter a medicine name.");
      return;
    }

    const updatedMedicines = medicines.map((medicine) =>
      medicine.id === editingMedicine.id
        ? { ...medicine, name: newMedicine, time: time, dosage: newDosage, frequency: newFrequency }
        : medicine
    );

    setMedicines(updatedMedicines);
    resetForm();
  };

  const resetForm = () => {
    setNewMedicine("");
    setNewDosage("");
    setNewFrequency("");
    setTime(new Date());
    setEditingMedicine(null);
    setModalVisible(false);
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExpandedMedicineId(expandedMedicineId === id ? null : id);
  };

  const openEditModal = (medicine: any) => {
    setNewMedicine(medicine.name);
    setNewDosage(medicine.dosage);
    setNewFrequency(medicine.frequency);
    setTime(medicine.time);
    setEditingMedicine(medicine);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <View style={{ marginBottom: 20, alignSelf: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 5, alignSelf: 'center' }}>
          Good morning,
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", alignSelf: 'center' }}>
          {user?.name}!
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12, alignSelf: 'center' }}>
        My medication
      </Text>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", padding: 15, marginBottom: 10, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 }}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Image source={require('../../assets/images/pill.webp')} style={{ width: 24, height: 24, marginLeft: 10 }} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", flex: 1 }}>{item.name}</Text>
                <Text style={{ color: "gray" }}>Take at: {item.time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name={expandedMedicineId === item.id ? "chevron-up" : "chevron-down"} size={24} color="black" />
              </View>
            </TouchableOpacity>

            {expandedMedicineId === item.id && (
              <View style={{ marginTop: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Details:</Text>
                <Text>Dosage: {item.dosage}</Text>
                <Text>Frequency: {item.frequency}</Text>
                <TouchableOpacity style={{ marginTop: 10, backgroundColor: "red", padding: 8, borderRadius: 5 }} onPress={() => deleteMedicine(item.id)}>
                  <Text style={{ color: "white", textAlign: "center" }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10, backgroundColor: "blue", padding: 8, borderRadius: 5 }} onPress={() => openEditModal(item)}>
                  <Text style={{ color: "white", textAlign: "center" }}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity style={{ backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 }} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Medicine</Text>
      </TouchableOpacity>


      {/* Modal for Adding/Editing Medicine */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{editingMedicine ? "Edit Medicine" : "Add New Medicine"}</Text>

            <TextInput placeholder="Name" placeholderTextColor="gray" value={newMedicine} onChangeText={setNewMedicine} style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10, borderRadius: 5 }} returnKeyType="done" />

            <TextInput placeholder="Dosage (e.g. 500mg)" placeholderTextColor="gray" value={newDosage} onChangeText={setNewDosage} style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10, borderRadius: 5 }} returnKeyType="done" />

            <TextInput placeholder="Frequency (e.g. Twice a day)" placeholderTextColor="gray" value={newFrequency} onChangeText={setNewFrequency} style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 10, borderRadius: 5 }} returnKeyType="done" />

            <Text>When should this be taken?</Text>

            <DateTimePicker style={{ alignSelf: "center" }} accentColor="black" textColor="black" testID="dateTimePicker" value={time} mode="time" is24Hour={false} onChange={onChange} display="spinner" />

            <Button title={editingMedicine ? "Save" : "Add"} onPress={editingMedicine ? editMedicine : addMedicine} />
            <Button title="Cancel" color="red" onPress={resetForm} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
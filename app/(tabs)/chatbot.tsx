import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'ai';
}

function MessageBubble({ text, sender }: MessageBubbleProps) {
  return (
    <View style={[styles.messageBubble, sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim().length === 0) return;
    
    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI: ${input}`, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble text={item.text} sender={item.sender} />}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  messageText: { color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#fff' },
  sendButton: { marginLeft: 10, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { GetAIResponse } from '../api';
import { useAuth0 } from 'react-native-auth0';

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
      <Text style={sender === 'user' ? styles.userText : styles.aiText}>{text}</Text>
    </View>
  );
}

export default function Chatbot() {
  const {getCredentials} = useAuth0();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);

  const handleSend = async () => {
    if (input.trim().length === 0) return;

    setPending(true);
    
    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput('');

    const accessToken = (await getCredentials())?.accessToken;

    const response = await GetAIResponse(accessToken, input);

    if (response === null) {
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI unreachable. See logs.`, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
    } else {
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI: ${response}`, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
    }

    setPending(false);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={90}>
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
            placeholderTextColor={'#909090'}
          />
          <TouchableOpacity style={pending ? styles.disabledSendButton : styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageBubble: { padding: 10, borderRadius: 10, margin: 5, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#fff' },
  sendButton: { marginLeft: 10, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  disabledSendButton: { marginLeft: 10, backgroundColor: '#425363', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
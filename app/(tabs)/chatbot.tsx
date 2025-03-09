import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { GetAIResponse } from '../api';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from 'expo-router';
import Markdown from '@ronradtke/react-native-markdown-display';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  rec: string | undefined;
}

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const navigation = useNavigation();

  return (
    <View style={[styles.messageBubble, message.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Markdown style={{text: {color: message.sender === 'user' ? '#fff' : '#000'}}}>{message.text}</Markdown>
      {message.rec && <Button title={`Search for ${message.rec}`} onPress={() =>
        navigation.navigate({name: 'medicinesearch', params: {query: message.rec}} as never)}/>}
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
    
    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user', rec: undefined };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput('');

    const accessToken = (await getCredentials())?.accessToken;

    let response = await GetAIResponse(accessToken, input);

    const recommendKeyword = 'RECOMMEND';

    if (response === null) {

      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI unreachable. See logs.`, sender: 'ai', rec: undefined };

      setMessages((prevMessages) => [aiMessage, ...prevMessages]);

    } else if (response.endsWith(recommendKeyword)) {

      const kwLen = recommendKeyword.length;
      const recStart = response.indexOf(recommendKeyword);
      const recommendation = response.substring(recStart + kwLen + 1, response.length - kwLen - 1);

      response = response.substring(0, recStart - 1);
      
      console.log("recommendation: " + recommendation)

      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI: ${response}`, sender: 'ai', rec: recommendation };

      setMessages((prevMessages) => [aiMessage, ...prevMessages]);

    } else {

      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: `AI: ${response}`, sender: 'ai', rec: undefined };

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
          renderItem={({ item }) => <MessageBubble message={item} />}
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
  messageBubble: { paddingHorizontal: 10, borderRadius: 10, margin: 5, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007bff' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#fff' },
  sendButton: { marginLeft: 10, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  disabledSendButton: { marginLeft: 10, backgroundColor: '#425363', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
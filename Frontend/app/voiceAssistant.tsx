// // import React, { useEffect, useState } from 'react';
// // import { Alert, Button} from 'react-native';
// // import { Audio } from 'expo-av';
// // import { useAudioRecorderState, AudioPlayer, useAudioPlayer, createAudioPlayer, setAudioModeAsync, AudioRecorder, AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
// // import * as FileSystem from 'expo-file-system/legacy';
// // import {SafeAreaView} from 'react-native-safe-area-context';

// // const recordingOptions = {
// //   android: {
// //     extension: '.wav',
// //     outputFormat: Audio.AndroidOutputFormat.MPEG_4,
// //     audioEncoder: Audio.AndroidAudioEncoder.AAC,
// //     sampleRate: 44100,
// //     numberOfChannels: 2,
// //     bitRate: 128000,
// //   },
// //   ios: {
// //     extension: '.wav',
// //     audioQuality: Audio.IOSAudioQuality.MAX,
// //     outputFormat: Audio.IOSOutputFormat.LINEARPCM,
// //     sampleRate: 44100,
// //     numberOfChannels: 2,
// //     bitRate: 128000,
// //     linearPCMBitDepth: 16,
// //     linearPCMIsBigEndian: false,
// //     linearPCMIsFloat: false,
// //   },
// //   web: {
// //     mimeType: 'audio/wav',
// //     bitsPerSecond: 128000,
// //   },
// // };

// // export default function VoiceAssistant() {
// //   const [recordingStatus, setRecordingStatus] = useState(false);
// //   const [recording, setRecording] = useState<Audio.Recording | undefined>();
// //   const [recordingUri, setRecordingUri] = useState<string | null>(null);
// //   const [streamingInterval, setStreamingInterval] = useState<ReturnType<typeof setInterval> | null>(null);
// //   const player: AudioPlayer = useAudioPlayer();
// //   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) => console.log('Recording status:', status));
// //   const state = useAudioRecorderState(audioRecorder, 100);

// //   useEffect(() => {
// //     const setAudioMode = async () => {
// //       try {
// //         await setAudioModeAsync({
// //           playsInSilentMode: true,
// //           shouldPlayInBackground: true,
// //           interruptionModeAndroid: 'duckOthers',
// //           interruptionMode: 'mixWithOthers',
// //           allowsRecording: true,
// //         });
// //       } catch (e) {
// //         console.error("Failed to set audio mode", e);
// //       }
// //     };
// //     setAudioMode();
// //   }, []);

// //   async function startRecording() {
// //     const status = await AudioModule.requestRecordingPermissionsAsync();
// //     if (!status.granted) {
// //       Alert.alert('Permission to access microphone was denied');
// //       return;
// //     }
// //     await audioRecorder.prepareToRecordAsync();
// //     audioRecorder.record();
// //     setRecordingStatus(true);
// //   }

// //   const stopRecording = async () => {
// //     await audioRecorder.stop();
// //     setRecordingUri(audioRecorder.uri);
// //     setRecordingStatus(false);
// //   };

// //   async function playBackAudio() {
// //     const newValue: string | undefined = recordingUri === null ? undefined : recordingUri;
// //     const player = createAudioPlayer({ uri: newValue });
// //     player.play();
// //   }

// //   async function upload() {
// //     if (!recordingUri) {
// //       Alert.alert("No recording to send.");
// //       return;
// //     }

// //     const formData = new FormData();
// //     const file = {
// //       uri: recordingUri,
// //       name: `recording-${Date.now()}.wav`,
// //       type: 'audio/wav',
// //     };
// //     formData.append('audio', file as any);
// //     formData.append('cid', 'test12345');

// //     try {
// //       await fetch(`${process.env.EXPO_PUBLIC_API_URL}chat`, {
// //         method: 'POST',
// //         body: formData,
// //       });
// //     } catch (error: any) {
// //       console.error("Error uploading audio:", error);
// //       Alert.alert("Error", `Failed to upload audio: ${error.message}`);
// //     }
// //   }

// // //   // -------------------------
// // //   // Streaming functions
// // //   // -------------------------
// // async function streamAudioStart() {
// //   try {
// //     // 1️⃣ Ask for microphone permission
// //     const { granted } = await AudioModule.requestRecordingPermissionsAsync();
// //     if (!granted) {
// //       Alert.alert("Permission denied for microphone.");
// //       return;
// //     }

// //     // 2️⃣ Prepare and start recording
// //     if (!audioRecorder) return;

// //     await audioRecorder.prepareToRecordAsync();
// //     audioRecorder.record();
// //     setRecordingStatus(true);

// //     // 3️⃣ Streaming loop
// //     const CHUNK_INTERVAL = 300;
// //     const VOLUME_THRESHOLD = -40;
// //     let lastReadPosition = 0;

// //     const interval = setInterval(async () => {
// //       const uri = audioRecorder.uri;
// //       if (!uri) return;

// //       try {
// //         const fileInfo = await FileSystem.readAsStringAsync(uri, {
// //           encoding: FileSystem.EncodingType.Base64,
// //         });
// //         const audioBytes = Uint8Array.from(atob(fileInfo), c => c.charCodeAt(0));
// //         const newChunk = audioBytes.slice(lastReadPosition);
// //         lastReadPosition = audioBytes.length;

// //         if (newChunk.length === 0) return;

// //         const int16Buffer = new Int16Array(newChunk.buffer);
// //         const rms = Math.sqrt(int16Buffer.reduce((sum, v) => sum + v * v, 0) / int16Buffer.length);
// //         const db = 20 * Math.log10(rms || 1e-5);
// //         if (db < VOLUME_THRESHOLD) return;

// //         const formData = new FormData();
// //         formData.append("audio", newChunk as any);
// //         formData.append("cid", "test123");

// //         await fetch(`${process.env.EXPO_PUBLIC_API_URL}chat_stream`, {
// //           method: "POST",
// //           body: formData,
// //         });
// //       } catch (err) {
// //         console.error("Streaming chunk failed:", err);
// //       }
// //     }, CHUNK_INTERVAL);

// //     setStreamingInterval(interval);
// //   } catch (err) {
// //     console.error("Error starting stream:", err);
// //   }
// // }

// // async function streamAudioStop() {
// //   if (!audioRecorder) return;

// //   try {
// //     await audioRecorder.stop(); // stops recording
// //     setRecordingStatus(false);

// //     if (streamingInterval) clearInterval(streamingInterval);
// //     setStreamingInterval(null);
// //   } catch (err) {
// //     console.error("Error stopping stream:", err);
// //   }
// // }

// //   return (
// //     <SafeAreaView>
// //       <Button title={'play'} onPress={recordingStatus ? stopRecording : startRecording} />
// //       <Button title="play back audio" onPress={playBackAudio} />
// //       <Button title="upload" onPress={upload} />
// //       <Button
// //         title={recordingStatus ? "Stop Streaming" : "Start Streaming"}
// //         onPress={recordingStatus ? streamAudioStop : streamAudioStart}
// //       />
// //     </SafeAreaView>
// //   );
// // }


// // import React, { useEffect, useState, useRef } from 'react';
// // import { Alert, Button, Text, View, StyleSheet } from 'react-native';
// // import { Audio } from 'expo-av';
// // import { 
// //   useAudioRecorderState, 
// //   AudioPlayer, 
// //   useAudioPlayer, 
// //   createAudioPlayer, 
// //   setAudioModeAsync, 
// //   AudioModule, 
// //   useAudioRecorder, 
// //   RecordingPresets 
// // } from 'expo-audio';
// // import * as FileSystem from 'expo-file-system/legacy';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import io, { Socket } from 'socket.io-client';

// // console.log(process.env.EXPO_PUBLIC_API_URL)
// // const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.5:5000';

// // console.log(fetch(`${API_URL}/ping`))

// // export default function VoiceAssistant() {
// //   // State for basic recording
// //   const [recordingStatus, setRecordingStatus] = useState(false);
// //   const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
// //   // State for WebSocket streaming
// //   const [isStreaming, setIsStreaming] = useState(false);
// //   const [transcript, setTranscript] = useState('');
// //   const [aiResponse, setAiResponse] = useState('');
// //   const [statusMessage, setStatusMessage] = useState('Ready');
  
// //   // Refs
// //   const socketRef = useRef<Socket | null>(null);
// //   const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
// //   const lastPositionRef = useRef<number>(0);
  
// //   // Audio hooks
// //   const audioRecorder = useAudioRecorder(
// //     RecordingPresets.HIGH_QUALITY, 
// //     (status) => console.log('[Recording] Status:', status)
// //   );
// //   const state = useAudioRecorderState(audioRecorder, 100);
// //   const player = useAudioPlayer();

// //   // Initialize WebSocket connection
// //   useEffect(() => {
// //     console.log('[WebSocket] Initializing connection to:', API_URL);
    
// //     const socket = io(API_URL, {
// //       transports: ['websocket'],
// //       reconnection: true,
// //       reconnectionAttempts: 5,
// //       reconnectionDelay: 1000,
// //     });

// //     socket.on('connect', () => {
// //       console.log('[WebSocket] ✓ Connected');
// //       setStatusMessage('Connected to server');
// //     });

// //     socket.on('disconnect', () => {
// //       console.log('[WebSocket] ✗ Disconnected');
// //       setStatusMessage('Disconnected from server');
// //       setIsStreaming(false);
// //       setRecordingStatus(false);
// //     });

// //     socket.on('connection_response', (data) => {
// //       console.log('[WebSocket] Connection response:', data);
// //     });

// //     socket.on('stream_started', (data) => {
// //       console.log('[WebSocket] Stream started:', data);
// //       setStatusMessage('Recording...');
// //     });

// //     socket.on('chunk_received', (data) => {
// //       if (data.count % 10 === 0) {
// //         console.log('[WebSocket] Chunks received:', data.count);
// //       }
// //     });

// //     socket.on('transcript', (data) => {
// //       console.log('[WebSocket] Transcript received:', data.text);
// //       setTranscript(data.text);
// //       setStatusMessage('Transcription complete');
// //     });

// //     socket.on('processing', (data) => {
// //       console.log('[WebSocket] Processing status:', data.status);
// //       const status = data.status.replace(/_/g, ' ');
// //       setStatusMessage(status.charAt(0).toUpperCase() + status.slice(1));
// //     });

// //     socket.on('response', async (data) => {
// //       console.log('[WebSocket] AI Response received, text length:', data.text.length);
// //       console.log('[WebSocket] Audio data length:', data.audio.length);
// //       setAiResponse(data.text);
// //       setStatusMessage('Playing response');
      
// //       // Play audio response
// //       try {
// //         const audioUri = `data:audio/mp3;base64,${data.audio}`;
// //         const newPlayer = createAudioPlayer({ uri: audioUri });
// //         newPlayer.play();
// //         console.log('[WebSocket] ✓ Playing audio response');
// //       } catch (error) {
// //         console.error('[WebSocket] ✗ Error playing audio:', error);
// //         Alert.alert('Error', 'Failed to play audio response');
// //       }
// //     });

// //     socket.on('error', (data) => {
// //       console.error('[WebSocket] ✗ Error:', data.message);
// //       Alert.alert('Error', data.message);
// //       setStatusMessage(`Error: ${data.message}`);
// //       setIsStreaming(false);
// //       setRecordingStatus(false);
// //     });

// //     socketRef.current = socket;

// //     return () => {
// //       console.log('[WebSocket] Cleaning up connection');
// //       if (streamingIntervalRef.current) {
// //         clearInterval(streamingIntervalRef.current);
// //       }
// //       socket.disconnect();
// //     };
// //   }, []);

// //   // Set audio mode on mount
// //   useEffect(() => {
// //     const setAudioMode = async () => {
// //       try {
// //         await setAudioModeAsync({
// //           playsInSilentMode: true,
// //           shouldPlayInBackground: true,
// //           interruptionModeAndroid: 'duckOthers',
// //           interruptionMode: 'mixWithOthers',
// //           allowsRecording: true,
// //         });
// //         console.log('[Audio] ✓ Audio mode configured');
// //       } catch (e) {
// //         console.error('[Audio] ✗ Failed to set audio mode:', e);
// //       }
// //     };
// //     setAudioMode();
// //   }, []);

// //   // ==================== BASIC RECORDING FUNCTIONS ====================
  
// //   async function startRecording() {
// //     const response = await fetch(`${API_URL}/ping`);
// //     const data = await response.json();
// //     console.log(data); // { message: "pong" }
// //     console.log('[Recording] Starting basic recording...');
// //     const status = await AudioModule.requestRecordingPermissionsAsync();
// //     if (!status.granted) {
// //       Alert.alert('Permission to access microphone was denied');
// //       console.log('[Recording] ✗ Permission denied');
// //       return;
// //     }
// //     await audioRecorder.prepareToRecordAsync();
// //     audioRecorder.record();
// //     setRecordingStatus(true);
// //     console.log('[Recording] ✓ Recording started');
// //   }

// //   async function stopRecording() {
// //     console.log('[Recording] Stopping recording...');
// //     await audioRecorder.stop();
// //     const uri = audioRecorder.uri;
// //     setRecordingUri(uri);
// //     setRecordingStatus(false);
// //     console.log('[Recording] ✓ Recording stopped, URI:', uri);
// //   }

// //   async function playBackAudio() {
// //     if (!recordingUri) {
// //       Alert.alert("No recording to play");
// //       return;
// //     }
// //     console.log('[Playback] Playing recording:', recordingUri);
// //     try {
// //       const newPlayer = createAudioPlayer({ uri: recordingUri });
// //       newPlayer.play();
// //       console.log('[Playback] ✓ Playback started');
// //     } catch (error) {
// //       console.error('[Playback] ✗ Error:', error);
// //       Alert.alert('Error', 'Failed to play audio');
// //     }
// //   }

// //   async function upload() {
// //     if (!recordingUri) {
// //       Alert.alert("No recording to send.");
// //       return;
// //     }

// //     console.log('[Upload] Starting upload...');
// //     console.log('[Upload] URI:', recordingUri);

// //     const formData = new FormData();
// //     const file = {
// //       uri: recordingUri,
// //       name: `recording-${Date.now()}.wav`,
// //       type: 'audio/wav',
// //     };
// //     formData.append('audio', file as any);
// //     formData.append('cid', 'test12345');

// //     try {
// //       setStatusMessage('Uploading audio...');
      
// //       const response = await fetch(`${API_URL}/chat`, {
// //         method: 'POST',
// //         body: formData,
// //       });
      
// //       console.log('[Upload] Response status:', response.status);
// //       console.log('[Upload] Response headers:', response.headers);
      
// //       if (response.ok) {
// //         setStatusMessage('Processing response...');
        
// //         // Get the audio response
// //         const arrayBuffer = await response.arrayBuffer();
// //         console.log('[Upload] Response audio size:', arrayBuffer.byteLength);
        
// //         // Convert to base64
// //         const base64Audio = btoa(
// //           String.fromCharCode(...new Uint8Array(arrayBuffer))
// //         );
        
// //         console.log('[Upload] Base64 audio length:', base64Audio.length);
        
// //         // Play using the same method as WebSocket
// //         setStatusMessage('Playing response');
// //         const audioUri = `data:audio/mp3;base64,${base64Audio}`;
// //         const newPlayer = createAudioPlayer({ uri: audioUri });
// //         newPlayer.play();
        
// //         console.log('[Upload] ✓ Success');
// //         Alert.alert("Success", "Audio uploaded and playing response");
        
// //       } else {
// //         const errorText = await response.text();
// //         console.error('[Upload] ✗ Failed:', errorText);
// //         Alert.alert("Error", `Failed to upload: ${errorText}`);
// //         setStatusMessage('Upload failed');
// //       }
// //     } catch (error: any) {
// //       console.error('[Upload] ✗ Error:', error);
// //       Alert.alert("Error", `Failed to upload audio: ${error.message}`);
// //       setStatusMessage('Error');
// //     }
// //   }

// //   // ==================== WEBSOCKET STREAMING FUNCTIONS ====================
  
// //   async function startWebSocketStream() {
// //     console.log('\n[Streaming] ========== Starting WebSocket Stream ==========');
    
// //     if (!socketRef.current) {
// //       Alert.alert('Error', 'Socket not connected');
// //       console.log('[Streaming] ✗ Socket not connected');
// //       return;
// //     }

// //     const status = await AudioModule.requestRecordingPermissionsAsync();
// //     if (!status.granted) {
// //       Alert.alert('Permission to access microphone was denied');
// //       console.log('[Streaming] ✗ Permission denied');
// //       return;
// //     }

// //     try {
// //       // Start recording
// //       console.log('[Streaming] Preparing to record...');
// //       await audioRecorder.prepareToRecordAsync();
// //       audioRecorder.record();
// //       setRecordingStatus(true);
// //       setIsStreaming(true);
// //       setTranscript('');
// //       setAiResponse('');

// //       console.log('[Streaming] Sending start_stream event with cid: test12345');
// //       // Initialize stream on server
// //       socketRef.current.emit('start_stream', { cid: 'test12345' });

// //       console.log('[Streaming] ✓ Recording started, will send chunks on stop');

// //     } catch (error) {
// //       console.error('[Streaming] ✗ Error starting stream:', error);
// //       Alert.alert('Error', 'Failed to start streaming');
// //       setIsStreaming(false);
// //       setRecordingStatus(false);
// //     }
// //   }

// //   async function stopWebSocketStream() {
// //     console.log('\n[Streaming] ========== Stopping WebSocket Stream ==========');
    
// //     try {
// //       // Stop recording first
// //       console.log('[Streaming] Stopping recording...');
// //       await audioRecorder.stop();
// //       const uri = audioRecorder.uri;
// //       console.log(`[Streaming] Recording stopped, URI: ${uri}`);
      
// //       setRecordingStatus(false);
// //       setIsStreaming(false);
// //       setStatusMessage('Processing audio...');

// //       if (!uri) {
// //         Alert.alert('Error', 'No recording found');
// //         console.log('[Streaming] ✗ No recording URI');
// //         return;
// //       }

// //       // Read the complete audio file
// //       console.log('[Streaming] Reading audio file...');
// //       const audioData = await FileSystem.readAsStringAsync(uri, {
// //         encoding: FileSystem.EncodingType.Base64,
// //       });
      
// //       console.log(`[Streaming] Audio data read: ${audioData.length} base64 characters`);
// //       console.log(`[Streaming] Estimated audio size: ${(audioData.length * 0.75 / 1024).toFixed(2)} KB`);

// //       // Split into chunks for streaming
// //       const CHUNK_SIZE = 8192; // Base64 characters per chunk
// //       const chunks: string[] = [];
      
// //       for (let i = 0; i < audioData.length; i += CHUNK_SIZE) {
// //         chunks.push(audioData.substring(i, i + CHUNK_SIZE));
// //       }
      
// //       console.log(`[Streaming] Split into ${chunks.length} chunks of ~${CHUNK_SIZE} chars each`);

// //       // Send all chunks
// //       console.log('[Streaming] Sending chunks to server...');
// //       for (let i = 0; i < chunks.length; i++) {
// //         socketRef.current?.emit('audio_chunk', { chunk: chunks[i] });
        
// //         if (i % 10 === 0 || i === chunks.length - 1) {
// //           console.log(`[Streaming] Sent chunk ${i + 1}/${chunks.length}`);
// //         }
// //       }

// //       console.log('[Streaming] ✓ All chunks sent');
// //       console.log('[Streaming] Sending stop_stream event...');

// //       // Tell server to process
// //       socketRef.current?.emit('stop_stream');
      
// //       console.log('[Streaming] ✓ stop_stream event sent');
// //       console.log('[Streaming] ========================================\n');

// //     } catch (error) {
// //       console.error('[Streaming] ✗ Error stopping stream:', error);
// //       Alert.alert('Error', `Failed to stop streaming: ${error}`);
// //       setStatusMessage('Error');
// //     }
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.statusContainer}>
// //         <Text style={styles.statusTitle}>Status:</Text>
// //         <Text style={styles.statusText}>{statusMessage}</Text>
// //       </View>

// //       {/* WebSocket Streaming Section */}
// //       <View style={styles.section}>
// //         <Text style={styles.sectionTitle}>WebSocket Streaming</Text>
// //         <Button
// //           title={isStreaming ? "Stop Streaming" : "Start Streaming"}
// //           onPress={isStreaming ? stopWebSocketStream : startWebSocketStream}
// //           color={isStreaming ? "#ff4444" : "#4CAF50"}
// //         />
// //       </View>

// //       {/* Display transcript */}
// //       {transcript && (
// //         <View style={styles.messageContainer}>
// //           <Text style={styles.messageLabel}>Your message:</Text>
// //           <Text style={styles.messageText}>{transcript}</Text>
// //         </View>
// //       )}

// //       {/* Display AI response */}
// //       {aiResponse && (
// //         <View style={[styles.messageContainer, styles.aiMessageContainer]}>
// //           <Text style={styles.messageLabel}>AI Response:</Text>
// //           <Text style={styles.messageText}>{aiResponse}</Text>
// //         </View>
// //       )}

// //       {/* Basic Recording Section */}
// //       <View style={styles.section}>
// //         <Text style={styles.sectionTitle}>Basic Recording</Text>
// //         <Button 
// //           title={recordingStatus ? 'Stop Recording' : 'Start Recording'} 
// //           onPress={recordingStatus ? stopRecording : startRecording}
// //         />
// //         <View style={styles.buttonSpacing} />
// //         <Button 
// //           title="Play Back Audio" 
// //           onPress={playBackAudio}
// //           disabled={!recordingUri}
// //         />
// //         <View style={styles.buttonSpacing} />
// //         <Button 
// //           title="Upload" 
// //           onPress={upload}
// //           disabled={!recordingUri}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   statusContainer: {
// //     marginBottom: 20,
// //     padding: 15,
// //     backgroundColor: '#f5f5f5',
// //     borderRadius: 8,
// //   },
// //   statusTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   statusText: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   section: {
// //     marginBottom: 20,
// //     padding: 15,
// //     backgroundColor: '#f9f9f9',
// //     borderRadius: 8,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#333',
// //   },
// //   buttonSpacing: {
// //     height: 10,
// //   },
// //   messageContainer: {
// //     marginTop: 15,
// //     padding: 15,
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: 8,
// //   },
// //   aiMessageContainer: {
// //     backgroundColor: '#e3f2fd',
// //   },
// //   messageLabel: {
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //     fontSize: 14,
// //   },
// //   messageText: {
// //     fontSize: 14,
// //     lineHeight: 20,
// //   },
// // });

// import React, { useEffect, useState, useRef } from 'react';
// import { Alert, Button, Text, View, StyleSheet } from 'react-native';
// import { Audio } from 'expo-av';
// import { 
//   useAudioRecorderState, 
//   AudioPlayer, 
//   useAudioPlayer, 
//   createAudioPlayer, 
//   setAudioModeAsync, 
//   AudioModule, 
//   useAudioRecorder, 
//   RecordingPresets 
// } from 'expo-audio';
// import * as FileSystem from 'expo-file-system/legacy';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import io, { Socket } from 'socket.io-client';

// console.log(process.env.EXPO_PUBLIC_API_URL)
// const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.5:5000';


// export default function VoiceAssistant() {
//   // State for basic recording
//   const [recordingStatus, setRecordingStatus] = useState(false);
//   const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
//   // State for WebSocket streaming
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [aiResponse, setAiResponse] = useState('');
//   const [statusMessage, setStatusMessage] = useState('Ready');
  
//   // Refs
//   const socketRef = useRef<Socket | null>(null);
//   const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const streamingRecorderRef = useRef<any>(null);
  
//   // Audio hooks for basic recording
//   const audioRecorder = useAudioRecorder(
//     RecordingPresets.HIGH_QUALITY, 
//     (status) => console.log('[Recording] Status:', status)
//   );
//   const state = useAudioRecorderState(audioRecorder, 100);

//   // Initialize WebSocket connection
//   useEffect(() => {
//     console.log('[WebSocket] Initializing connection to:', API_URL);
    
//     const socket = io(API_URL, {
//       transports: ['websocket'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socket.on('connect', () => {
//       console.log('[WebSocket] ✓ Connected');
//       setStatusMessage('Connected to server');
//     });

//     socket.on('disconnect', () => {
//       console.log('[WebSocket] ✗ Disconnected');
//       setStatusMessage('Disconnected from server');
//       setIsStreaming(false);
//     });

//     socket.on('connection_response', (data) => {
//       console.log('[WebSocket] Connection response:', data);
//     });

//     socket.on('stream_started', (data) => {
//       console.log('[WebSocket] Stream started:', data);
//       setStatusMessage('Streaming audio...');
//     });

//     socket.on('chunk_received', (data) => {
//       if (data.count % 10 === 0) {
//         console.log('[WebSocket] Chunks received:', data.count);
//       }
//     });

//     socket.on('transcript', (data) => {
//       console.log('[WebSocket] Transcript received:', data.text);
//       setTranscript(data.text);
//       setStatusMessage('Transcription complete');
//     });

//     socket.on('processing', (data) => {
//       console.log('[WebSocket] Processing status:', data.status);
//       const status = data.status.replace(/_/g, ' ');
//       setStatusMessage(status.charAt(0).toUpperCase() + status.slice(1));
//     });

//     socket.on('response', async (data) => {
//       console.log('[WebSocket] AI Response received, text length:', data.text.length);
//       console.log('[WebSocket] Audio data length:', data.audio.length);
//       setAiResponse(data.text);
//       setStatusMessage('Playing response');
      
//       // Play audio response
//       try {
//         const audioUri = `data:audio/mp3;base64,${data.audio}`;
//         const newPlayer = createAudioPlayer({ uri: audioUri });
//         newPlayer.play();
//         console.log('[WebSocket] ✓ Playing audio response');
//       } catch (error) {
//         console.error('[WebSocket] ✗ Error playing audio:', error);
//         Alert.alert('Error', 'Failed to play audio response');
//       }
//     });

//     socket.on('error', (data) => {
//       console.error('[WebSocket] ✗ Error:', data.message);
//       Alert.alert('Error', data.message);
//       setStatusMessage(`Error: ${data.message}`);
//       setIsStreaming(false);
//     });

//     socketRef.current = socket;

//     return () => {
//       console.log('[WebSocket] Cleaning up connection');
//       if (streamingIntervalRef.current) {
//         clearInterval(streamingIntervalRef.current);
//       }
//       socket.disconnect();
//     };
//   }, []);

//   // Set audio mode on mount
//   useEffect(() => {
//     const setAudioMode = async () => {
//       try {
//         await setAudioModeAsync({
//           playsInSilentMode: true,
//           shouldPlayInBackground: true,
//           interruptionModeAndroid: 'duckOthers',
//           interruptionMode: 'mixWithOthers',
//           allowsRecording: true,
//         });
//         console.log('[Audio] ✓ Audio mode configured');
//       } catch (e) {
//         console.error('[Audio] ✗ Failed to set audio mode:', e);
//       }
//     };
//     setAudioMode();
//   }, []);
  
//   // ==================== BASIC RECORDING FUNCTIONS ====================
  
//   async function startRecording() {
//     const response = await fetch(`${API_URL}/ping`);
//     const data = await response.json();
//     console.log(data); // { message: "pong" }
//     console.log('[Recording] Starting basic recording...');
//     const status = await AudioModule.requestRecordingPermissionsAsync();
//     if (!status.granted) {
//       Alert.alert('Permission to access microphone was denied');
//       console.log('[Recording] ✗ Permission denied');
//       return;
//     }
//     await audioRecorder.prepareToRecordAsync();
//     audioRecorder.record();
//     setRecordingStatus(true);
//     console.log('[Recording] ✓ Recording started');
//   }

//   async function stopRecording() {
//     console.log('[Recording] Stopping recording...');
//     await audioRecorder.stop();
//     const uri = audioRecorder.uri;
//     setRecordingUri(uri);
//     setRecordingStatus(false);
//     console.log('[Recording] ✓ Recording stopped, URI:', uri);
//   }

//   async function playBackAudio() {
    
//     const response = await fetch(`${API_URL}/ping`);
//     const data = await response.json();
//     console.log(data);
//     if (!recordingUri) {
//       Alert.alert("No recording to play");
//       return;
//     }
//     console.log('[Playback] Playing recording:', recordingUri);
//     try {
//       const newPlayer = createAudioPlayer({ uri: recordingUri });
//       newPlayer.play();
//       console.log('[Playback] ✓ Playback started');
//     } catch (error) {
//       console.error('[Playback] ✗ Error:', error);
//       Alert.alert('Error', 'Failed to play audio');
//     }
//   }

//   async function upload() {
//     if (!recordingUri) {
//       Alert.alert("No recording to send.");
//       return;
//     }

//     console.log('[Upload] Starting upload...');
//     console.log('[Upload] URI:', recordingUri);

//     const formData = new FormData();
//     const file = {
//       uri: recordingUri,
//       name: `recording-${Date.now()}.wav`,
//       type: 'audio/wav',
//     };
//     formData.append('audio', file as any);
//     formData.append('cid', 'test12345');

//     try {
//       setStatusMessage('Uploading audio...');
      
//       const response = await fetch(`${API_URL}/chat`, {
//         method: 'POST',
//         body: formData,
//       });
      
//       console.log('[Upload] Response status:', response.status);
//       console.log('[Upload] Response headers:', response.headers);
      
//       if (response.ok) {
//         setStatusMessage('Processing response...');
        
//         // Get the audio response
//         const arrayBuffer = await response.arrayBuffer();
//         console.log('[Upload] Response audio size:', arrayBuffer.byteLength);
        
//         // Convert to base64
//         const base64Audio = btoa(
//           String.fromCharCode(...new Uint8Array(arrayBuffer))
//         );
        
//         console.log('[Upload] Base64 audio length:', base64Audio.length);
        
//         // Play using the same method as WebSocket
//         setStatusMessage('Playing response');
//         const audioUri = `data:audio/mp3;base64,${base64Audio}`;
//         const newPlayer = createAudioPlayer({ uri: audioUri });
//         newPlayer.play();
        
//         console.log('[Upload] ✓ Success');
//         Alert.alert("Success", "Audio uploaded and playing response");
        
//       } else {
//         const errorText = await response.text();
//         console.error('[Upload] ✗ Failed:', errorText);
//         Alert.alert("Error", `Failed to upload: ${errorText}`);
//         setStatusMessage('Upload failed');
//       }
//     } catch (error: any) {
//       console.error('[Upload] ✗ Error:', error);
//       Alert.alert("Error", `Failed to upload audio: ${error.message}`);
//       setStatusMessage('Error');
//     }
//   }

//   // ==================== WEBSOCKET STREAMING FUNCTIONS ====================
  
// // create the streaming recorder hook once at the top of the component
// const streamingRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

// async function startWebSocketStream() {
//   console.log('\n[Streaming] ========== Starting WebSocket Stream ==========');

//   if (!socketRef.current) {
//     Alert.alert('Error', 'Socket not connected');
//     console.log('[Streaming] ✗ Socket not connected');
//     return;
//   }

//   const status = await AudioModule.requestRecordingPermissionsAsync();
//   if (!status.granted) {
//     Alert.alert('Permission to access microphone was denied');
//     console.log('[Streaming] ✗ Permission denied');
//     return;
//   }

//   try {
//     streamingRecorderRef.current = streamingRecorder;

//     console.log('[Streaming] Preparing to record...');
//     await streamingRecorder.prepareToRecordAsync();
//     streamingRecorder.record();
//     setIsStreaming(true);
//     setTranscript('');
//     setAiResponse('');

//     console.log('[Streaming] Sending start_stream event with cid: test12345');
//     socketRef.current.emit('start_stream', { cid: 'test12345' });

//     let lastPosition = 0;

//     // Send chunks every 0.5 seconds
//     streamingIntervalRef.current = setInterval(async () => {
//       try {
//         const uri = streamingRecorder.uri;
//         if (!uri) return;

//         const audioData = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         if (audioData.length > lastPosition) {
//           const newChunk = audioData.substring(lastPosition);
//           lastPosition = audioData.length;

//           socketRef.current?.emit('audio_chunk', { chunk: newChunk });
//           console.log('[Streaming] Chunk sent, length:', newChunk.length);
//         }
//       } catch (error) {
//         console.error('[Streaming] Error sending chunk:', error);
//       }
//     }, 500);

//     console.log('[Streaming] ✓ Real-time streaming started');
//   } catch (error) {
//     console.error('[Streaming] ✗ Error starting stream:', error);
//     Alert.alert('Error', 'Failed to start streaming');
//     setIsStreaming(false);
//   }
// }

// async function stopWebSocketStream() {
//   console.log('\n[Streaming] ========== Stopping WebSocket Stream ==========');

//   try {
//     if (streamingIntervalRef.current) {
//       clearInterval(streamingIntervalRef.current);
//       streamingIntervalRef.current = null;
//     }

//     const streamRecorder = streamingRecorderRef.current;
//     if (!streamRecorder) {
//       console.log('[Streaming] ✗ No active stream recorder');
//       return;
//     }

//     console.log('[Streaming] Stopping recording...');
//     await streamRecorder.stop();
//     const uri = streamRecorder.uri;
//     console.log(`[Streaming] Recording stopped, URI: ${uri}`);

//     setIsStreaming(false);
//     setStatusMessage('Processing audio...');

//     if (uri) {
//       const audioData = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       if (audioData.length > 0) {
//         socketRef.current?.emit('audio_chunk', { chunk: audioData });
//         console.log('[Streaming] Final chunk sent, length:', audioData.length);
//       }
//     }

//     console.log('[Streaming] Sending stop_stream event...');
//     socketRef.current?.emit('stop_stream');
//     console.log('[Streaming] ✓ stop_stream event sent');

//     streamingRecorderRef.current = null;
//   } catch (error) {
//     console.error('[Streaming] ✗ Error stopping stream:', error);
//     Alert.alert('Error', `Failed to stop streaming: ${error}`);
//     setStatusMessage('Error');
//     setIsStreaming(false);
//   }
// }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.statusContainer}>
//         <Text style={styles.statusTitle}>Status:</Text>
//         <Text style={styles.statusText}>{statusMessage}</Text>
//       </View>

//       {/* WebSocket Streaming Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Real-time WebSocket Streaming</Text>
//         <Button
//           title={isStreaming ? "Stop Streaming" : "Start Streaming"}
//           onPress={isStreaming ? stopWebSocketStream : startWebSocketStream}
//           color={isStreaming ? "#ff4444" : "#4CAF50"}
//         />
//       </View>

//       {/* Display transcript */}
//       {transcript && (
//         <View style={styles.messageContainer}>
//           <Text style={styles.messageLabel}>Your message:</Text>
//           <Text style={styles.messageText}>{transcript}</Text>
//         </View>
//       )}

//       {/* Display AI response */}
//       {aiResponse && (
//         <View style={[styles.messageContainer, styles.aiMessageContainer]}>
//           <Text style={styles.messageLabel}>AI Response:</Text>
//           <Text style={styles.messageText}>{aiResponse}</Text>
//         </View>
//       )}

//       {/* Basic Recording Section */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Basic Recording</Text>
//         <Button 
//           title={recordingStatus ? 'Stop Recording' : 'Start Recording'} 
//           onPress={recordingStatus ? stopRecording : startRecording}
//         />
//         <View style={styles.buttonSpacing} />
//         <Button 
//           title="Play Back Audio" 
//           onPress={playBackAudio}
//           disabled={!recordingUri}
//         />
//         <View style={styles.buttonSpacing} />
//         <Button 
//           title="Upload" 
//           onPress={upload}
//           disabled={!recordingUri}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   statusContainer: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//   },
//   statusTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   statusText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   section: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   buttonSpacing: {
//     height: 10,
//   },
//   messageContainer: {
//     marginTop: 15,
//     padding: 15,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//   },
//   aiMessageContainer: {
//     backgroundColor: '#e3f2fd',
//   },
//   messageLabel: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     fontSize: 14,
//   },
//   messageText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
// });

import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button, Text, View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { 
  useAudioRecorderState, 
  AudioPlayer, 
  useAudioPlayer, 
  createAudioPlayer, 
  setAudioModeAsync, 
  AudioModule, 
  useAudioRecorder, 
  RecordingPresets 
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { SafeAreaView } from 'react-native-safe-area-context';
import io, { Socket } from 'socket.io-client';

console.log(process.env.EXPO_PUBLIC_API_URL)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.5:5000';

console.log(fetch(`${API_URL}/ping`))

export default function VoiceAssistant() {
  // State for basic recording
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
  // State for WebSocket streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [statusMessage, setStatusMessage] = useState('Ready');
  
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<number>(0);
  
  // Audio hooks
  const audioRecorder = useAudioRecorder(
  {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 16000,
      numberOfChannels: 1,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 16000,
      numberOfChannels: 1,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  },
  (status) => console.log('[Recording] Status:', status)
);
  const state = useAudioRecorderState(audioRecorder, 100);
  const player = useAudioPlayer();

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('[WebSocket] Initializing connection to:', API_URL);
    
    const socket = io(API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[WebSocket] ✓ Connected');
      setStatusMessage('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] ✗ Disconnected');
      setStatusMessage('Disconnected from server');
      setIsStreaming(false);
      setRecordingStatus(false);
    });

    socket.on('connection_response', (data) => {
      console.log('[WebSocket] Connection response:', data);
    });

    socket.on('stream_started', (data) => {
      console.log('[WebSocket] Stream started:', data);
      setStatusMessage('Recording...');
    });

    socket.on('chunk_received', (data) => {
      if (data.count % 10 === 0) {
        console.log('[WebSocket] Chunks received:', data.count);
      }
    });

    socket.on('transcript', (data) => {
      console.log('[WebSocket] Transcript received:', data.text);
      setTranscript(data.text);
      setStatusMessage('Transcription complete');
    });

    socket.on('processing', (data) => {
      console.log('[WebSocket] Processing status:', data.status);
      const status = data.status.replace(/_/g, ' ');
      setStatusMessage(status.charAt(0).toUpperCase() + status.slice(1));
    });

    socket.on('response', async (data) => {
      console.log('[WebSocket] AI Response received, text length:', data.text.length);
      console.log('[WebSocket] Audio data length:', data.audio.length);
      setAiResponse(data.text);
      setStatusMessage('Playing response');
      
      // Play audio response
      try {
        const audioUri = `data:audio/mp3;base64,${data.audio}`;
        const newPlayer = createAudioPlayer({ uri: audioUri });
        newPlayer.play();
        console.log('[WebSocket] ✓ Playing audio response');
      } catch (error) {
        console.error('[WebSocket] ✗ Error playing audio:', error);
        Alert.alert('Error', 'Failed to play audio response');
      }
    });

    socket.on('error', (data) => {
      console.error('[WebSocket] ✗ Error:', data.message);
      Alert.alert('Error', data.message);
      setStatusMessage(`Error: ${data.message}`);
      setIsStreaming(false);
      setRecordingStatus(false);
    });

    socketRef.current = socket;

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      socket.disconnect();
    };
  }, []);

  // Set audio mode on mount
  useEffect(() => {
    const setAudioMode = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: 'duckOthers',
          interruptionMode: 'mixWithOthers',
          allowsRecording: true,
        });
        console.log('[Audio] ✓ Audio mode configured');
      } catch (e) {
        console.error('[Audio] ✗ Failed to set audio mode:', e);
      }
    };
    setAudioMode();
  }, []);

  // ==================== BASIC RECORDING FUNCTIONS ====================
  
  async function startRecording() {
    const response = await fetch(`${API_URL}/ping`);
    const data = await response.json();
    console.log(data); // { message: "pong" }
    console.log('[Recording] Starting basic recording...');
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert('Permission to access microphone was denied');
      console.log('[Recording] ✗ Permission denied');
      return;
    }
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setRecordingStatus(true);
    console.log('[Recording] ✓ Recording started');
  }

  async function stopRecording() {
    
    console.log('[Recording] Stopping recording...');
    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    setRecordingUri(uri);
    setRecordingStatus(false);
    console.log('[Recording] ✓ Recording stopped, URI:', uri);
  }

  async function playBackAudio() {
    if (!recordingUri) {
      Alert.alert("No recording to play");
      return;
    }
    console.log('[Playback] Playing recording:', recordingUri);
    try {
      const newPlayer = createAudioPlayer({ uri: recordingUri });
      newPlayer.play();
      console.log('[Playback] ✓ Playback started');
    } catch (error) {
      console.error('[Playback] ✗ Error:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  }

  async function upload() {
    if (!recordingUri) {
      Alert.alert("No recording to send.");
      return;
    }

    console.log('[Upload] Starting upload...');
    console.log('[Upload] URI:', recordingUri);

    const formData = new FormData();
    const file = {
      uri: recordingUri,
      name: `recording-${Date.now()}.wav`,
      type: 'audio/wav',
    };
    formData.append('audio', file as any);
    formData.append('cid', 'test12345');

    try {
      setStatusMessage('Uploading audio...');
      
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('[Upload] Response status:', response.status);
      console.log('[Upload] Response headers:', response.headers);
      
      if (response.ok) {
        setStatusMessage('Processing response...');
        
        // Get the audio response
        const arrayBuffer = await response.arrayBuffer();
        console.log('[Upload] Response audio size:', arrayBuffer.byteLength);
        
        // Convert to base64
        const base64Audio = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
        
        console.log('[Upload] Base64 audio length:', base64Audio.length);
        
        // Play using the same method as WebSocket
        setStatusMessage('Playing response');
        const audioUri = `data:audio/mp3;base64,${base64Audio}`;
        const newPlayer = createAudioPlayer({ uri: audioUri });
        newPlayer.play();
        
        console.log('[Upload] ✓ Success');
        Alert.alert("Success", "Audio uploaded and playing response");
        
      } else {
        const errorText = await response.text();
        console.error('[Upload] ✗ Failed:', errorText);
        Alert.alert("Error", `Failed to upload: ${errorText}`);
        setStatusMessage('Upload failed');
      }
    } catch (error: any) {
      console.error('[Upload] ✗ Error:', error);
      Alert.alert("Error", `Failed to upload audio: ${error.message}`);
      setStatusMessage('Error');
    }
  }

  // ==================== WEBSOCKET STREAMING FUNCTIONS ====================
  
// let isStreamingLoop = false;
const [isStreamingLoop, setIsStreamingLoop] = useState(false);
const isStreamingLoopRef = useRef(false);

async function startWebSocketStream() {
  if (!socketRef.current) {
    Alert.alert('Socket not connected');
    return;
  }

  // Request microphone permission
  const status = await AudioModule.requestRecordingPermissionsAsync();
  if (!status.granted) {
    Alert.alert('Microphone permission denied');
    console.log('[Streaming] ✗ Permission denied');
    return;
  }

  // Notify server to start a streaming session
  socketRef.current.emit('start_stream', { cid: 'test12345' });
  setIsStreaming(true);
  setRecordingStatus(true);
  setIsStreamingLoop(true);
  isStreamingLoopRef.current = true;
  console.log('[Streaming] Starting stream loop');

  streamingLoop(); // start the streaming loop
}

async function streamingLoop() {
  const CHUNK_DURATION_MS = 2000; // 2-second chunks

  try {
    while (isStreamingLoopRef.current) {
      try {
        console.log(`[Streaming] Loop active: ${isStreamingLoopRef.current}`);
        
        // Prepare and start recording
        await audioRecorder.prepareToRecordAsync();
        await audioRecorder.record();

        // Wait for chunk duration, but check frequently if we should stop
        const startTime = Date.now();
        while (Date.now() - startTime < CHUNK_DURATION_MS) {
          if (!isStreamingLoopRef.current) {
            // Stop recording immediately if flag changed
            await audioRecorder.stop();
            console.log('[Streaming] Recording stopped mid-chunk');
            return; // Exit the entire loop
          }
          await new Promise(res => setTimeout(res, 100)); // Check every 100ms
        }

        // Stop recording and get URI
        await audioRecorder.stop();
        const uri = audioRecorder.uri;

        if (!uri) {
          console.warn('[Streaming] No URI after recording');
          continue;
        }

        // Double-check we should still send data
        if (!isStreamingLoopRef.current) {
          console.log('[Streaming] Stopped before sending chunk');
          break;
        }

        // Read recorded audio as base64
        const audioData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Send in smaller sub-chunks for smoother streaming
        const CHUNK_SIZE = 8192;
        for (let i = 0; i < audioData.length; i += CHUNK_SIZE) {
          if (!isStreamingLoopRef.current) {
            console.log('[Streaming] Stopped mid-send');
            break;
          }
          socketRef.current?.emit('audio_chunk', {
            chunk: audioData.substring(i, i + CHUNK_SIZE),
          });
        }

        console.log(`[Streaming] Sent 2s chunk, size: ${audioData.length} chars`);
      } catch (err) {
        console.error('[Streaming] Error in streamingLoop iteration:', err);
        // Don't break on error, just continue to next iteration if still active
        if (!isStreamingLoopRef.current) break;
      }
    }
  } finally {
    // Ensure recording is stopped
    try {
      await audioRecorder.stop();
      console.log('[Streaming] Final recorder stop');
    } catch (err) {
      console.log('[Streaming] Recorder already stopped');
    }

    // Always tell the server to stop processing
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('stop_stream');
        console.log('[Streaming] Emitted stop_stream to server');
      }
    } catch (err) {
      console.warn('[Streaming] Failed to emit stop_stream:', err);
    }

    setIsStreaming(false);
    setRecordingStatus(false);
    setIsStreamingLoop(false);
    console.log('[Streaming] Streaming fully stopped');
  }
}

async function stopWebSocketStream() {
  console.log('[Streaming] Stop requested');
  
  if (!isStreamingLoopRef.current) {
    console.log('[Streaming] Already stopped');
    return;
  }

  // Set the flag to stop the loop
  isStreamingLoopRef.current = false;
  setIsStreamingLoop(false);
  
  // The streamingLoop's finally block will handle:
  // 1. Stopping the recorder
  // 2. Emitting stop_stream to server
  // 3. Updating UI state
  
  console.log('[Streaming] Stop flag set, waiting for cleanup');
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text style={styles.statusText}>{statusMessage}</Text>
      </View>

      {/* WebSocket Streaming Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>WebSocket Streaming</Text>
        <Button
          title={isStreaming ? "Stop Streaming" : "Start Streaming"}
          onPress={isStreaming ? stopWebSocketStream : startWebSocketStream}
          color={isStreaming ? "#ff4444" : "#4CAF50"}
        />
      </View>

      {/* Display transcript */}
      {transcript && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Your message:</Text>
          <Text style={styles.messageText}>{transcript}</Text>
        </View>
      )}

      {/* Display AI response */}
      {aiResponse && (
        <View style={[styles.messageContainer, styles.aiMessageContainer]}>
          <Text style={styles.messageLabel}>AI Response:</Text>
          <Text style={styles.messageText}>{aiResponse}</Text>
        </View>
      )}

      {/* Basic Recording Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Recording</Text>
        <Button 
          title={recordingStatus ? 'Stop Recording' : 'Start Recording'} 
          onPress={recordingStatus ? stopRecording : startRecording}
        />
        <View style={styles.buttonSpacing} />
        <Button 
          title="Play Back Audio" 
          onPress={playBackAudio}
          disabled={!recordingUri}
        />
        <View style={styles.buttonSpacing} />
        <Button 
          title="Upload" 
          onPress={upload}
          disabled={!recordingUri}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  statusContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonSpacing: {
    height: 10,
  },
  messageContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  aiMessageContainer: {
    backgroundColor: '#e3f2fd',
  },
  messageLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
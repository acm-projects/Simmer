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

    socket.on('audio_response', async (data) => {
      console.log('[audio length', data.audio.length);
      const base64Content=data.audio


  
      const fileUri = `${FileSystem.cacheDirectory}response-audio.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, base64Content, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const info = await FileSystem.getInfoAsync(fileUri);
      console.log(info.exists);
      console.log(fileUri)
      const file2 = {
        uri: fileUri,
        name: `recording-${Date.now()}2.mp3`, 
        type: 'audio/mp3', 
      };
      const formData2 = new FormData();
      formData2.append('audio', file2 as any);
      console.log(fileUri)
      await audioRecorder.stop();
      isStreamingLoopRef.current=false;
      setIsStreamingLoop(false);
      await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: 'duckOthers',
          interruptionMode: 'mixWithOthers',
          allowsRecording: false
        });

      const player = createAudioPlayer({uri:fileUri});
      player.addListener('playbackStatusUpdate',async (status)=>{
        if(status.didJustFinish){
          isStreamingLoopRef.current=true;
          setIsStreamingLoop(true);
          await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionModeAndroid: 'duckOthers',
            interruptionMode: 'mixWithOthers',
            allowsRecording: true
          });
          await streamingLoop()
        

        }
      })
      console.log('about to play auido')
      console.log(player.volume)

      player.play();
      console.log('audio')
 
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
          allowsRecording: true
        });
        console.log('[Audio] ✓ Audio mode configured');
      } catch (e) {
        console.error('[Audio] ✗ Failed to set audio mode:', e);
      }
    };
    setAudioMode();
  }, []);

  

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
  // ✨ NEW: Add chunk counter
  let chunkCounter = 0;

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

        // ✨ CHANGED: Send the ENTIRE 2-second recording as one chunk
        // ❌ REMOVED: The sub-chunking loop that split into 8KB pieces
        chunkCounter++;
        socketRef.current?.emit('audio_chunk', {
          chunk: audioData,
          chunk_id: chunkCounter,
          is_complete: true
        });

        // ✨ CHANGED: Updated log message
        console.log(`[Streaming] Sent complete 2s chunk #${chunkCounter}, size: ${audioData.length} chars`);
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
      // if (socketRef.current?.connected) {
      //   socketRef.current.emit('stop_stream');
      //   console.log('[Streaming] Emitted stop_stream to server');
      // }
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
  return {startWebSocketStream}

  
}
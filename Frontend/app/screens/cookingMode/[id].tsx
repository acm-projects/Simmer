import React, { useState, useEffect,useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
//@ts-ignore
import {Timer} from 'react-native-flip-timer-fixed';
//const Timer = require('react-native-flip-timer-fixed').default;
//import {Timer} from 'react-native-flip-timer-fixed';
import { Plus, Minus, Play, Pause } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {Image} from 'expo-image';
import VoiceAssistant from '../utils/voiceAssistant';
import { Audio } from 'expo-av';
import { Image as RNImage } from 'react-native';
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

export default function SettingScreen() {
  const {id} = useLocalSearchParams<any>();
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [isThinking, setIsThinking]=useState(false);
  
  // State for WebSocket streaming
  const [isStreaming, setIsStreaming] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [timer,setTimer]=useState(false)
  const [timerKey, setTimerKey] = useState(0);
  
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<number>(0);
  const animations = {
      idle: require('../../../assets/Simmy/Idle_Simmy.gif'),
      thinking: require('../../../assets/Simmy/Thinking_Simmy.gif'),
      talking: require('../../../assets/Simmy/Talking_Simmy.gif'),
    };
    
    useEffect(() => {
      // FastImage.preload takes an array of source objects
      const sources = Object.values(animations).map(source => (
        RNImage.resolveAssetSource(source).uri
      ));

      sources.forEach(sourceUri => {
        Image.prefetch(sourceUri);
      });
    }, []);
    const [animation, setAnimation] = useState(animations.idle);
  
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
  const resumeStreaming=async ()=>{
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

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('[WebSocket] Initializing connection to:', process.env.EXPO_PUBLIC_API_URL);
    
    const socket = io(process.env.EXPO_PUBLIC_API_URL, {
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
      const step_time=data.time


  
      const fileUri = `${FileSystem.cacheDirectory}response-audio.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, base64Content, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const info = await FileSystem.getInfoAsync(fileUri);
      console.log(info.exists);
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
          // setIsTalking(false);
          setAnimation(animations.idle)
          if(step_time&&step_time>=0){
            setSeconds((Math.ceil(step_time * 60)))
            setTimer(true)
          }
            
          await resumeStreaming()

          try {
            await player.release();
            console.log('Player released successfully.');
          } catch (e) {
            console.warn('Error releasing player:', e);
          }
        

        }
      })
      console.log('about to play auido')
      console.log(player.volume)
      // setIsTalking(true);
      // setIsThinking(false)
      setAnimation(animations.talking)

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
    socket.on('thinking', (data) => {
      // setIsThinking(true);
      // setIsTalking(false);
      setAnimation(animations.thinking)
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

const isMounted = useRef(true);

useEffect(() => {
  isMounted.current = true;
  return () => {
    isMounted.current = false;
    isStreamingLoopRef.current = false; 
  };
}, []);
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
    while (isStreamingLoopRef.current && isMounted.current) {
      try {
        console.log(`[Streaming] Loop active: ${isStreamingLoopRef.current}`);
        
        // Prepare and start recording
        await audioRecorder.prepareToRecordAsync();
        await audioRecorder.record();

        // Wait for chunk duration, but check frequently if we should stop
        const startTime = Date.now();
        while (Date.now() - startTime < CHUNK_DURATION_MS) {
          if (!isStreamingLoopRef.current || !isMounted.current) {
            // Stop recording immediately if flag changed
           try {
             await audioRecorder.stop();
           } catch (e) { /* Ignore stop error on unmount */ }
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
          is_complete: true,
          rid:id
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
    // try {
    //   // if (socketRef.current?.connected) {
    //   //   socketRef.current.emit('stop_stream');
    //   //   console.log('[Streaming] Emitted stop_stream to server');
    //   // }
    // } catch (err) {
    //   console.warn('[Streaming] Failed to emit stop_stream:', err);
    // }

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
  try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('stop_stream');
        console.log('[Streaming] Emitted stop_stream to server');
      }
    } catch (err) {
      console.warn('[Streaming] Failed to emit stop_stream:', err);
    }
  
  // The streamingLoop's finally block will handle:
  // 1. Stopping the recorder
  // 2. Emitting stop_stream to server
  // 3. Updating UI state
  setAnimation(animations.idle)
  console.log('[Streaming] Stop flag set, waiting for cleanup');
}

    ////////////////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////
       ////////////////////////////////////////////////////////////////////////////////////////////////////
    
       
    
    let [fontsLoaded] = useFonts({
        Orbitron_400Regular,
        Orbitron_700Bold // Add all desired font styles here
      });
      const [play, setPlay] = useState(false);
      const [seconds, setSeconds] = useState(0);
      const [isVisible, setVisible] = useState(false);

      
      /// change setIsTalking when we integrate this, mascot will change to talking if isTalking is changed
      

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={ () => {
          isStreamingLoopRef.current = false;
          isMounted.current = false; 

          stopWebSocketStream();

          setPlay(false);
          audioRecorder.stop().catch(() => {}); 

          // 5. Leave immediately
          router.back();
          }}>
          <ArrowLeft  size={20} style={styles.arrow}/>
        </TouchableOpacity>
        
        <View style={{backgroundColor: '#ffff', borderRadius: 100, width: '80%', marginLeft: 10, }}>
          <View style={{backgroundColor: '#262e05ff', width: '30%', borderRadius: 100,}}>
            <Text> </Text>
          </View>
        </View>
      </View>
  
      <View style={{ marginTop: 80}}>
        {/* {(!isTalking&&!isThinking) && (
          <Image source={require('../../assets/Simmy/Idle_Simmy.gif')} style={styles.mascot}/>
        )}
        {isThinking && (
          <Image source={require('../../assets/Simmy/Thinking_Simmy.gif')} style={styles.mascot}/>
        )}

        {isTalking && (
          <Image source={require('../../assets/Simmy/Talking_Simmy.gif')} style={styles.mascot}/>
        )} */}
        <Image
          style={styles.mascot} // Make sure to add this style
          source={animation}
          contentFit="contain" // This is like resizeMode
        />
        <View style={{flexDirection: 'row', width: '100%' }}>
        {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev + 60)} 
          style={[styles.timerButton,{ position: 'relative', left: '46%' }]}>
          <Plus color='white'/>
        </TouchableOpacity> )}
          {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev + 3600)} 
          style={[styles.timerButton, {position: 'relative', left: 11}]}>
          <Plus color='white'/>
        </TouchableOpacity> )}
      

          {isVisible && (  <TouchableOpacity 
          style={[styles.editButton, {position: 'relative', left: '66%'}]}
          onPress={() => {setVisible(false); setPlay(true)}}>
        <Text style={styles.text}>Done</Text>
          </TouchableOpacity>)}

        </View>
<View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4, paddingTop: 10,}}>
      {!play && !isVisible && (  <TouchableOpacity
        style={styles.timerButton}
        onPress={() => {
          startWebSocketStream()
          setPlay(true);
          }}>
          <Play color={'white'} size={18}/>
        </TouchableOpacity>)}
        {play && !isVisible && (
         <TouchableOpacity
        style={styles.timerButton}
        onPress={() => {
          stopWebSocketStream();
          setPlay(false)}}>
          <Pause color={'white'} size={18}/>
        </TouchableOpacity>)}
          {!isVisible && (  <TouchableOpacity 
          style={[styles.editButton,]}
          onPress={() => {setVisible(true);setPlay(false);}}>
        <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>)}
          </View>
    
       

        <Timer
         key={timerKey}
          time={seconds}
          play={timer}
          wrapperStyle={{ 
            flexDirection: 'row', 
            backgroundColor: 'transparent',
          }}
          onTimerFinish={async()=>{
            console.log('resumeeeeeeeeeeeeeeeeeeeeeeeeee')
            setTimer(false);
            setTimerKey(prevKey => prevKey + 1);
            await resumeStreaming();
          }}
          showCircles={true}
          flipNumberProps={{
            numberStyle: { color: '#ffffff', fontSize: 36 },
            flipCardStyle: {backgroundColor: '#262e05ff', },
            cardStyle: {backgroundColor: '#262e05ff', borderRadius: 0}
          }}
        />
      <View style={{flexDirection: 'row'}}>
         {isVisible && ( <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev - 60)} 
          style={[styles.timerButton, { position: 'relative', left: '46%' }]}>
          <Minus color='white'/>
        </TouchableOpacity>)}

        
          {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev - 3600)} 
          style={[styles.timerButton, {position: 'relative', left: 11}]}>
          <Minus color='white'/>
        </TouchableOpacity>)}

         </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#9BA760',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 18,
    color: 'white',
    fontFamily: 'Nunito_400Regular',
  },
    info:{
    fontSize: 18,
    paddingLeft: 25,
    padding: 10,
  },
     delete:{
    fontSize: 15,
    paddingLeft: 15,
    padding: 8,
    color: 'red'
  },
    arrow: {
        color: "#fff",
        margin: 5,
    },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  mascot: {
      height: 400,
      width: 400,
      alignSelf: 'center',
  },
  timerButton:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, 
    marginTop: 10
  },
  editButton:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100, 
    width: 60, 
    height: 30,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, 
    marginTop: 10
  }
});
import React, { useState } from 'react';
import { Alert, Button, View, TextInput, Text, TouchableOpacity , StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import { Audio } from 'expo-av';


const recordingOptions = {
  // android not currently supported, but works with these settings
  android: {
    extension: '.wav',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.IOSAudioQuality.MAX,
    // The output format for uncompressed WAV audio
    outputFormat: Audio.IOSOutputFormat.LINEARPCM, 
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/wav',
    bitsPerSecond: 128000,
  },
};
export default function VoiceAssistant() {
  const [recordingStatus, setRecordingStatus]=useState('start')
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
   const [sound, setSound] = useState<Audio.Sound | undefined>();

  async function startRecording() {
    if(!permissionResponse){
      Alert.alert('permissionResponse is null')
      return;
  }
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( recordingOptions
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if(!recording){
      console.log('recording doesnt exist')
      return
    }
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    setRecordingUri(uri);
    console.log('Recording stopped and stored at', uri);
    setRecording(undefined);
  }
  async function playBackAudio() {
    if (!recordingUri) {
      console.log("No recording URI found.");
      return;
    }

    console.log('Loading Sound');
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri }
      );
      setSound(sound); // Save the sound object to state

      console.log('Playing Sound');
      await sound.playAsync();
      // The sound will play until it's finished.
      // The useEffect hook will handle unloading it.
    } catch (error) {
        console.error("Failed to play sound", error);
    }
  }

  async function upload() {
    if (!recordingUri) {
      Alert.alert("No recording to send.");
      return;
    }

    const formData = new FormData();

    const file = {
      uri: recordingUri,
      name: `recording-${Date.now()}.wav`, 
      type: 'audio/wav', 
    };


    formData.append('audio', file as any);


    formData.append('userId', '12345');

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}upload`, {
        method: 'POST',
        body: formData,

      });

      const responseJson = await response.json();

      if (response.ok) {
        Alert.alert("Success", responseJson.message);
      } else {
        throw new Error(responseJson.error || "Unknown error occurred");
      }

    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Error", `Failed to upload audio: ${error.message}`);
    } finally {
    }
  }
  

 

 


  return (
    <SafeAreaView >
      <Button title={recordingStatus} onPress={recording ? stopRecording : startRecording}/>
      <Button title="play back audio" onPress={playBackAudio}/>
      <Button title="upload" onPress={upload}/>
      
    </SafeAreaView>
  )
}




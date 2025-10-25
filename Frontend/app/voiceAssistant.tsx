import React, { useEffect, useState } from 'react';
import { Alert, Button, View, TextInput, Text, TouchableOpacity , StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import { Audio } from 'expo-av';
import { AudioPlayer, useAudioPlayer, createAudioPlayer,setAudioModeAsync, AudioRecorder, AudioModule, useAudioRecorder,  RecordingPresets } from 'expo-audio';
// import * as FileSystem from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';



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

  const [recordingStatus, setRecordingStatus]=useState(false)
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const player: AudioPlayer = useAudioPlayer();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  useEffect(()=>{
    const setAudioMode= async()=>{
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionModeAndroid: 'duckOthers',
          interruptionMode: 'mixWithOthers',
          allowsRecording: true,

        });
      } catch (e) {
        console.error("Failed to set audio mode", e);
      }
    }
    setAudioMode();
  },[])


  // async function startRecording() {
  //   if(!permissionResponse){
  //     Alert.alert('permissionResponse is null')
  //     return;
  // }
  //   try {
  //     if (permissionResponse.status !== 'granted') {
  //       console.log('Requesting permission..');
  //       await requestPermission();
  //     }
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     console.log('Starting recording..');
  //     const { recording } = await Audio.Recording.createAsync( recordingOptions
  //     );
  //     setRecording(recording);
  //     console.log('Recording started');
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // }
  async function startRecording(){
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert('Permission to access microphone was denied');
    }
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setRecordingStatus(true)
  }

  // async function stopRecording() {
  //   console.log('Stopping recording..');
  //   if(!recording){
  //     console.log('recording doesnt exist')
  //     return
  //   }
  //   await recording.stopAndUnloadAsync();
  //   await Audio.setAudioModeAsync(
  //     {
  //       allowsRecordingIOS: false,
  //     }
  //   );
  //   const uri = recording.getURI();
  //   setRecordingUri(uri);
  //   console.log('Recording stopped and stored at', uri);
  //   setRecording(undefined);
  // }
  const stopRecording = async () => {

    await audioRecorder.stop();
    setRecordingUri(audioRecorder.uri);
    setRecordingStatus(false)
  };

  // async function playBackAudio() {
  //   if (!recordingUri) {
  //     console.log("No recording URI found.");
  //     return;
  //   }


  //   try {
  //     const { sound } = await Audio.Sound.createAsync(
  //       { uri: recordingUri }
  //     );
  //     setSound(sound);

  //     await sound.playAsync();

  //   } catch (error) {
  //       console.error("Failed to play sound", error);
  //   }
  // }
  async function playBackAudio(){
    let newValue: string | undefined = recordingUri === null ? undefined : recordingUri;
    const player = createAudioPlayer({uri:newValue});

    player.play();
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
    formData.append('cid', 'test12345');


    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}chat`, {
        method: 'POST',
        body: formData,

      });


      const responseBlob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(responseBlob);
      
      const base64Data:string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      const base64Content = base64Data.split(',')[1];
      


  
      const fileUri = `${FileSystem.cacheDirectory}response-audio.wav`;
      await FileSystem.writeAsStringAsync(fileUri, base64Content, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const file2 = {
        uri: fileUri,
        name: `recording-${Date.now()}2.wav`, 
        type: 'audio/wav', 
      };
      const formData2 = new FormData();
      formData2.append('audio', file2 as any);


      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}upload`, {
          method: 'POST',
          body: formData2,

      });
      } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Error", `Failed to upload audio: ${error.message}`);
    } 
      
      
      console.log(fileUri)

      const player = createAudioPlayer({uri:fileUri});

      player.play();



      console.log(file.uri)

      

    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Error", `Failed to upload audio: ${error.message}`);
    } finally {
    }
  }
  

 

 


  return (
    <SafeAreaView >
      <Button title={'play'} onPress={recordingStatus ? stopRecording : startRecording}/>
      <Button title="play back audio" onPress={playBackAudio}/>
      <Button title="upload" onPress={upload}/>
      
    </SafeAreaView>
  )
}




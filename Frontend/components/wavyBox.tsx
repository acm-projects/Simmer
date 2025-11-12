import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WavyBox = () => {
  const boxWidth = 150;
  const boxHeight = 125;
  const waveHeight = 8; // Adjust for wave amplitude

const wavePath = `
  M 0 ${boxHeight / 2 - waveHeight} 
  C ${boxWidth * 0.25} ${boxHeight / 2 + waveHeight}, 
    ${boxWidth * 0.75} ${boxHeight / 2 + waveHeight}, 
    ${boxWidth} ${boxHeight / 2 - waveHeight}
  L ${boxWidth} ${boxHeight}
  L 0 ${boxHeight}
  Z
`;

  return (
    <View style={styles.container}>
      <View style={[styles.box, { width: boxWidth, height: boxHeight }]}>
        <Svg height={boxHeight} width={boxWidth} style={styles.waveOverlay}>
          <Path d={wavePath} fill="white" />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden', // Crucial to clip the wave within the box
    position: 'relative',
  },
  waveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default WavyBox;
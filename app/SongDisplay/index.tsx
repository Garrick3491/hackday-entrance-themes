import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SongDisplay() {
    const songList = require("@/assets/songs/songs.json");
    const selectedSong = songList.find(song => song.id == 1);
    console.log(selectedSong)
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/PLX-WallPaper-Dark(1280 _ 1024p).png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
       <ThemedText type="title">Hello {selectedSong.name}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.subtitleContainer}>
        <ThemedText>Entrance Theme: SONG INFORMATION</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 8,
  },
  subtitleContainer: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: 'absolute',
},
});

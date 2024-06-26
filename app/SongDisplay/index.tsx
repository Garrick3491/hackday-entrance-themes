import { Image, StyleSheet, Platform, Pressable, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";
import useSpotify from "@/hooks/useSpotify";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import moment from 'moment'

export default function SongDisplay() {
  const songList = require("@/assets/songs/songs.json");
  const now=new Date()
  const displayDate= moment().format('MMMM Do YYYY, h:mm:ss a');

  const { fob_id } = useLocalSearchParams();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const audioRef = useRef(null);

  const { refreshToken, setSpotifySong, song } = useSpotify();

  useEffect(() => {
    setSelectedPerson(
      songList.find((person) => {
        return person.id == fob_id;
      })
    );
    refreshToken(
      "d99c18fbd8354e78b92d5d46b09c103e",
      "17a84693860e4e5790443a25d089b737"
    );
  }, []);

  console.log(selectedPerson);

  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: song.preview_url });
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (selectedPerson) {
      const id = selectedPerson?.song?.split("/").pop();
      console.log("id:%o", id);
      setSpotifySong(id);
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (song) {
      const play = async () => playSound();
      play();
    }
  }, [song]);
  console.log("song:%o", song);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/PLX-WallPaper-Dark(1280 _ 1024p).png")}
          style={styles.reactLogo}
        />
      }
    >
      {selectedPerson && (
        <ThemedView style={styles.subtitleContainer}>
          <ThemedText type="title">Hello {selectedPerson?.name}</ThemedText>
          <ThemedText>{song?.name}</ThemedText>
          <Image
            source={{ uri: song?.album?.images?.[0].url }}
            style={styles.albumArt}
          />
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.time}>{displayDate}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      {/*{songList.map((person) => (
        <Pressable
          key={person.name}
          onPress={() => {
            setSelectedPerson(person);
          }}
        >
          <ThemedView style={styles.stepContainer}>
            <ThemedText>{person.name}</ThemedText>
          </ThemedView>
        </Pressable>
      ))}*/}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  subtitleContainer: {
    flexDirection: "column",
    alignItems: "center",
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
    position: "absolute",
  },
  albumArt: {
    marginTop: 10,
    height: 200,
    width: 200,
  },
  time: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
});

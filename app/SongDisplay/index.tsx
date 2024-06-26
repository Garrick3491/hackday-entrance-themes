import { Image, StyleSheet, Platform, Pressable, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import qs from "qs";
global.Buffer = require("buffer").Buffer;
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import useSpotify from "@/hooks/useSpotify";

export default function SongDisplay() {
  const songList = require("@/public/songs/songs.json");
  const { refreshToken, setSpotifySong, song } = useSpotify();
  const displayDate = moment().format("MMMM Do YYYY, h:mm:ss a");

  const [selectedPerson, setSelectedPerson] = useState(null);
  const audioRef = useRef(null);

  const client_id = "d99c18fbd8354e78b92d5d46b09c103e";
  const client_secret = "17a84693860e4e5790443a25d089b737";
  useEffect(() => {
    refreshToken(client_id, client_secret);
  }, []);

  const { fob_id } = useLocalSearchParams();

  useEffect(() => {
    let person = songList.find((person) => person.id === fob_id);

    if (!person) {
      router.push({ pathname: "/Create", params: { fob_id } });
    }
    setSelectedPerson(person);
  }, []);

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
    fontWeight: "bold",
  },
});

import {
  Image,
  StyleSheet,
  Platform,
  Pressable,
  View,
  TextInput,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";
import useSpotify from "@/hooks/useSpotify";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";

export default function SongDisplay() {
  const { fob_id } = useLocalSearchParams();

  const { refreshToken, setSpotifySong, getSongForName, songList } =
    useSpotify();

  const [songName, setSongName] = useState();
  const [name, setName] = useState();
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    refreshToken(
      "d99c18fbd8354e78b92d5d46b09c103e",
      "17a84693860e4e5790443a25d089b737"
    );
  }, []);

  const saveFile = async (json) => {
    console.log(json);
    FileSystem.writeAsStringAsync("/songs/songs.json", json).catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (selectedSong) {
      const json = require("@/public/songs/songs.json");
      json.push({
        id: fob_id,
        name: name,
        song: selectedSong.external_urls.spotify,
      });

      console.log(json);

      saveFile(json.toString());
    }
  }, [selectedSong]);

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
      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Enter your name"
          onChangeText={(text) => {
            setName(text);
          }}
        />
        <TextInput
          placeholder="Enter your song name"
          onChangeText={(text) => {
            setSongName(text);
          }}
        />
        <Pressable
          style={{
            borderColor: "black",
            borderWidth: 1,
            padding: 8,
            marginTop: 8,
          }}
          disabled={!songName}
          onPress={() => {
            getSongForName(songName);
            //router.push({ pathname: "/SongDisplay", params: { fob_id: id } });
          }}
        >
          <ThemedText>Submit Song Name</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {songList.map((song) => {
          return (
            <Pressable
              key={song.id}
              onPress={() => {
                setSelectedSong(song);
              }}
            >
              <ThemedView style={styles.stepContainer}>
                <ThemedText>{song?.name}</ThemedText>
                <Image
                  source={{ uri: song?.album?.images?.[0].url }}
                  style={styles.albumArt}
                />
              </ThemedView>
            </Pressable>
          );
        })}
      </ThemedView>
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
});

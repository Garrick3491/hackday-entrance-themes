import { Image, StyleSheet, Platform, Pressable, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
global.Buffer = require('buffer').Buffer;
import { Audio } from 'expo-av';

export default function SongDisplay() {
  const songList = require("@/assets/songs/songs.json");
  const [token, setToken] = useState(null);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [song, setSong] = useState(null);
  const audioRef = useRef(null);


  const client_id = "d99c18fbd8354e78b92d5d46b09c103e";
  const client_secret = "17a84693860e4e5790443a25d089b737";
  useEffect(() => {
    if (!token) {
      axios
        .post(
          "https://accounts.spotify.com/api/token",
          qs.stringify({
            grant_type: "client_credentials",
            json: true,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
          }
        )
        .then(function (response) {
          setToken(response.data.access_token);
        })
        .catch(function (err) {
          console.log("err:%o", err);
        });
    }
  }, []);

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');

    const { sound } = await Audio.Sound.createAsync({ uri: song.preview_url });

    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (selectedPerson && token) {
      const id = selectedPerson?.song?.split("/").pop();

      axios
        .get(`https://api.spotify.com/v1/tracks/${id}/`, {
          params: {
            fields:
              "items(track(name,preview_url, artists(name),album(images)))",
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          setSong(
            response.data
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [selectedPerson, token]);

  useEffect(() => {
    if (song) {
      const play = async () => playSound();
      play();
    }
  }, [song]);
  console.log('song:%o', song);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/PLX-WallPaper-Dark(1280 _ 1024p).png')}
          style={styles.reactLogo}
        />
      }>
      {selectedPerson && (
        <ThemedView style={styles.subtitleContainer}>
          <ThemedText type="title">Hello {selectedPerson?.name}</ThemedText>
          <ThemedText>{song?.name}</ThemedText>
          <Image
            source={{ uri: song?.album?.images?.[0].url }}
            style={styles.albumArt}
          />
        </ThemedView>
      )}

      {
        songList.map((person) => (
          <Pressable key={person.name} onPress={() => {
            setSelectedPerson(person);
          }}>
            <ThemedView style={styles.stepContainer}>
              <ThemedText>{person.name}</ThemedText>
            </ThemedView>
          </Pressable>
        ))
      }
    </ParallaxScrollView >
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
  albumArt: {
    marginTop: 10,
    height: 200,
    width: 200,
  }
});

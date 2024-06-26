import {
  Image,
  StyleSheet,
  Platform,
  Pressable,
  TextInput,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  const [id, setId] = useState(null);
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to the office!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Enter your ID"
          onChangeText={(text) => {
            setId(text);
          }}
        />
        <Pressable
          style={{
            borderColor: "black",
            borderWidth: 1,
            padding: 8,
            marginTop: 8,
          }}
          onPress={() => {
            router.push({ pathname: "/SongDisplay", params: { fob_id: id } });
          }}
        >
          <ThemedText>Submit Fob ID</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
});

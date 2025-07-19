import { Image } from "expo-image";
import { Button, Platform, StyleSheet, Vibration } from "react-native";
import Slider from "@react-native-community/slider";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  const [buzzDuration, setBuzzDuration] = useState(200);
  const [waitTime, setWaitTime] = useState(500);
  const [toggleVibrate, setToggleVibrate] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // make bzzzzzz
  useEffect(() => {
    if (toggleVibrate) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const startRepeatingVibration = () => {
        Vibration.vibrate(buzzDuration);
        
        const interval = setInterval(() => {
          Vibration.vibrate(buzzDuration);
        }, waitTime);

        intervalRef.current = interval;
      };

      startRepeatingVibration();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      Vibration.cancel();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      Vibration.cancel();
    };
  }, [buzzDuration, waitTime, toggleVibrate]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Vibrator</ThemedText>
        <Button
          title={toggleVibrate ? "Stop" : "Start"}
          onPress={() => setToggleVibrate(!toggleVibrate)}
        />
      </ThemedView>
      <ThemedView style={styles.sliderContainer}>
        <ThemedText type="subtitle">
          Buzz Duration: {buzzDuration.toFixed(0)}ms
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={300}
          value={buzzDuration}
          onValueChange={setBuzzDuration}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
        />
      </ThemedView>
      
      <ThemedView style={styles.sliderContainer}>
        <ThemedText type="subtitle">
          Wait Time: {waitTime.toFixed(0)}ms ({(waitTime/1000).toFixed(2)}s)
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={150}
          maximumValue={1500}
          value={waitTime}
          onValueChange={setWaitTime}
          minimumTrackTintColor="#ff6b6b"
          maximumTrackTintColor="#d3d3d3"
        />
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
          in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the{" "}
          <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
          provide files for different screen densities
        </ThemedText>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={{ alignSelf: "center" }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
          to see how to load{" "}
          <ThemedText style={{ fontFamily: "SpaceMono" }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{" "}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook
          lets you inspect what the user&apos;s current color scheme is, and so
          you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{" "}
          <ThemedText type="defaultSemiBold">
            components/HelloWave.tsx
          </ThemedText>{" "}
          component uses the powerful{" "}
          <ThemedText type="defaultSemiBold">
            react-native-reanimated
          </ThemedText>{" "}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The{" "}
              <ThemedText type="defaultSemiBold">
                components/ParallaxScrollView.tsx
              </ThemedText>{" "}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
});

import { useState } from "react";
import { CompassHeading } from "@/components/CompassHeading";
import { Button } from "@react-navigation/elements";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function TabFourScreen() {
  const [toggleCompass, setToggleCompass] = useState(false);
  return (
    <ThemedView style={styles.container}>
      <Button onPress={() => setToggleCompass(!toggleCompass)}>bingbong</Button>
      {toggleCompass && <CompassHeading />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

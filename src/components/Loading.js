import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function Loading() {
  const { isDarkMode, theme } = useTheme();

  const videoSource = isDarkMode
    ? require("../assets/loading_dark.mp4")
    : require("../assets/loading_light.mp4"); //Autoria dos vídeos: Maria Laimer.

  return (
    <View style={[styles.container]}>
      <Video
        source={videoSource}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        isMuted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width * 0.4,
    height: width * 0.4,
  },
});

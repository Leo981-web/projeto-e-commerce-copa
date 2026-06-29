import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function Loading() {
  const { isDarkMode, theme } = useTheme();

  const videoSource = isDarkMode
    ? require("../assets/loading_dark.mp4")
    : require("../assets/loading_light.mp4");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme?.bg ?? (isDarkMode ? "#0A3214" : "#EAF6EE") },
      ]}
    >
      <Video
        source={videoSource}
        style={{
          width: width * 0.4,
          height: width * 0.4,
        }}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
        useNativeControls={false}
        videoStyle={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
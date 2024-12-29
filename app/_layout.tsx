import { Stack } from "expo-router";
import "expo-dev-client";

export default function RootLayout() {
  return (
    <Stack>
      {/* Set a custom title or hide the header */}
      <Stack.Screen name="index" options={{ title: "Ankara Styles", headerShown: false }} />
    </Stack>
  );
}

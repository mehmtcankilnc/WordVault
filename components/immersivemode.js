import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

const ImmersiveMode = () => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync("inset-swipe");

    const interval = setInterval(async () => {
      const visibility = await NavigationBar.getVisibilityAsync();
      if (visibility === "visible") {
        setTimeout(async () => {
          await NavigationBar.setVisibilityAsync("hidden");
        }, 2000);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  return null;
};

export default ImmersiveMode;

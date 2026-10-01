import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wonderwhirl.kids",
  appName: "WonderWhirl",
  webDir: "dist",
  ios: {
    // The web app handles safe areas itself (viewport-fit=cover + env(safe-area-inset-*)).
    contentInset: "never",
    backgroundColor: "#c7ecff",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 700,
      backgroundColor: "#7c5cff",
      showSpinner: false,
    },
  },
};

export default config;

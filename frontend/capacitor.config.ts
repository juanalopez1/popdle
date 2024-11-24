import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.example.app",
    appName: "frontend",
    webDir: "dist/frontend/browser/",
    server: {
        allowNavigation: ["https://TODO"],
    },
};

export default config;

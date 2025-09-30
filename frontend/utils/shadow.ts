import { Platform } from "react-native";

export function shadowXs() {
    if (Platform.OS === "ios") {
        return {
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        };
    }
    return { elevation: 1 };
}

export function shadowSm() {
    if (Platform.OS === "ios") {
        return {
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
        };
    }
    return { elevation: 2 };
}

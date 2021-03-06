import {Dimensions, Platform} from "react-native";

// export enum Theme {
//     Light,
//     Dark
// }
export enum Orientation {
    Landscape = "landscape",
    Portrait = "portrait"
}

export function orientation(): Orientation {
    const scaledSize = Dimensions.get("window");
    return scaledSize.height > scaledSize.width ? Orientation.Portrait : Orientation.Landscape
}

export function isIos(): boolean {
    return Platform.OS === "ios"
}
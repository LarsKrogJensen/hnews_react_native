import {Dimensions} from "react-native";

export enum Orientation {
    Landscape = "landscape",
    Portrait = "portrait"
}

export function orientation(): Orientation {
    const scaledSize = Dimensions.get("window");
    return scaledSize.height > scaledSize.width ? Orientation.Portrait : Orientation.Landscape
}
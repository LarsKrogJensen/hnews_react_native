import * as React from "react"
import {EventStats, ShirtColors} from "api/typings";
import {Circle, default as Svg, Path} from "react-native-svg";

export function renderServe(statistics: EventStats, home: boolean) {
    if (statistics && statistics.sets && statistics.sets.homeServe === home) {
        return (
            <Svg width={16} height={16} style={{flex: 1}}>
                <Circle cx={8} cy={8} r={4} fill="#F7CE00"/>
            </Svg>
        )
    }

    return null;
}

export function renderTeamColors(colors: ShirtColors | undefined) {
    if (!colors) return null

    return (
        <Svg width={20} height={20}>
            <Circle cx={10} cy={10} r={7} fill={colors.shirtColor1 || "none"}/>
            <Path d="M3,10 a1,1 0 0,0 14,0" fill={colors.shirtColor2 || "none"} rotation={-45} originX={10}
                  originY={10}/>
            <Circle cx={10} cy={10} r={7} stroke="darkgrey" fill="none"/>
        </Svg>
    )
}

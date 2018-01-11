export enum OutcomeTypes {
    Home = "OT_ONE",
    Draw = "OT_CROSS",
    Away = "OT_TWO",
    Over = "OT_OVER",
    Under = "OT_UNDER",
    HomeOrDraw = "OT_ONE_OR_CROSS",
    HomeOrAway = "OT_ONE_OR_TWO",
    DrawOrAway = "OT_CROSS_OR_TWO",
    // HalfTime/FullTime
    HomeAndHome = "OT_ONE_ONE",
    HomeAndDraw = "OT_ONE_CROSS",
    HomeAndAway = "OT_ONE_TWO",
    DrawAndHome = "OT_CROSS_ONE",
    DrawAndDraw = "OT_CROSS_CROSS",
    DrawAndAway = "OT_CROSS_TWO",
    AwayAndHome = "OT_TWO_ONE",
    AwayAndDraw = "OT_TWO_CROSS",
    AwayAndAway = "OT_TWO_TWO",
}
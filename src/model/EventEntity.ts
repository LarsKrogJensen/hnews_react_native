import {Participant, Path, Stream, TeamColors} from "api/typings";

export interface EventEntity {
    readonly id: number;
    readonly mainBetOfferId?: number;
    readonly name: string;
    readonly homeName: string;
    readonly awayName: string;
    readonly start: string;
    readonly group: string;
    readonly type: string;
    readonly nonLiveBoCount: number;
    readonly liveBetOffers: boolean;
    readonly openForLiveBetting: boolean;
    readonly boUri: string;
    readonly groupId: number;
    readonly hideStartNo: boolean;
    readonly sport: string;
    readonly path: ReadonlyArray<Path>;
    readonly englishName: string;
    readonly liveBoCount: number;
    readonly state: string;
    readonly displayType: string;
    readonly hasPrematchStatistics: boolean;
    readonly teamColors: TeamColors;
    readonly streamed?: boolean;
    readonly streams: Stream[];
    participants?: Participant[];
    distance?: string;
    eventNumber?: number;
    editorial?: string;
    originalStartTime?: string;
    raceType?: string;
    trackType?: string;
    raceClass?: string;
    going?: string;
}
import {BetOfferType, Criterion} from "api/typings";

export interface BetOfferEntity {
    readonly id: number;
    readonly live: boolean;
    criterion: Criterion;
    betOfferType: BetOfferType;
    readonly eventId: number;
    // pba: Pba;
    readonly cashIn: boolean;
    readonly outcomes: ReadonlyArray<number>;
    readonly main: boolean;
    readonly prematch: boolean;
    readonly cashOutStatus: string;
    // oddsStats: OddsStats;
    readonly categoryName: string;
    readonly suspended?: boolean;
    readonly open?: boolean;
    readonly extra: string;
    readonly startingPrice?: boolean;
}
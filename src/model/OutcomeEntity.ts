export interface OutcomeEntity {
    readonly id: number;
    readonly label: string;
    readonly englishLabel: string;
    readonly odds: number;
    readonly type: string;
    readonly betOfferId: number;
    readonly changedDate: Date;
    readonly oddsFractional: string;
    readonly oddsAmerican: string;
    readonly status: string;
    readonly participant: string;
    readonly participantId?: number;
    readonly line?: number;
}
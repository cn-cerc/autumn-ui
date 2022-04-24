export default class Datetime {
    private _data;
    constructor(data?: Date);
    toString(): string;
    get yearMonth(): string;
    get asFastDate(): FastDate;
    get asFastTime(): FastDate;
    get data(): Date;
    format(fmt: string): string;
}
export declare class FastDate extends Datetime {
    constructor(data?: Date);
    toString(): string;
}
export declare class FastTime extends Datetime {
    constructor(data?: Date);
    toString(): string;
}

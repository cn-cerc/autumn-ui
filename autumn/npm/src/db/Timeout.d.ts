import DataSet from "./DataSet";
export default class Timeout {
    private _times;
    constructor(times: number);
    getPromise(): Promise<DataSet>;
}

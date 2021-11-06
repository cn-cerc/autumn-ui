import DataSet from "./DataSet";

export default class Timeout {
    private _times: number;
    constructor(times: number) {
        this._times = times;
    }

    getPromise(): Promise<DataSet> {
        let value = this._times / 1000;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new DataSet().setMessage(`执行超时(${value}秒)，请检查您的操作，建议变更操作方法`));
            }, this._times);
        });
    }
}
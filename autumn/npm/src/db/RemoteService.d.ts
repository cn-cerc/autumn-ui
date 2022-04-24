import DataSet from "./DataSet";
export default class RemoteService {
    private _token;
    private _host;
    private _service;
    private _dataIn;
    private _dataOut;
    constructor(props?: any);
    exec(): Promise<boolean>;
    getPromise(): Promise<DataSet>;
    get token(): string;
    setToken(value: string): RemoteService;
    get dataIn(): DataSet;
    setDataIn(value: DataSet): RemoteService;
    get host(): string;
    setHost(host: string): RemoteService;
    get service(): string;
    setService(service: string): RemoteService;
    get dataOut(): DataSet;
    setDataOut(value: DataSet): void;
}

import DataSet from "./DataSet";
import SServer from "./SServer";
export default class SClient extends DataSet {
    private _service;
    private _server;
    private _updateKey;
    constructor(props: any);
    get server(): SServer;
    setServer(value: SServer): SClient;
    get service(): string;
    setService(value: string): SClient;
    get updateKey(): number;
    open(): Promise<void>;
    save(): Promise<void>;
    private findService;
}

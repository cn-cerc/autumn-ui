import DataSet from "./DataSet";
import RemoteService from "./RemoteService";
export default class QueryService extends RemoteService {
    private _sql;
    constructor(props: any);
    add(sql: string): QueryService;
    get sql(): string;
    setSql(sql: string): QueryService;
    /**
     * 调用远程服务获取数据
     *
     * @param timeout 超时时间（单位秒）
     * @returns DataSet
     */
    open(timeout?: number): Promise<DataSet>;
    private findService;
}

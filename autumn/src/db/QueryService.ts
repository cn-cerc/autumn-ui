import DataSet from "./DataSet";
import RemoteService from "./RemoteService";
import Timeout from "./Timeout";

export default class QueryService extends RemoteService {
    private _sql: string = "";

    constructor(props: any) {
        super(props);
        if (props) {
            const { sql: sql } = props;
            if (sql)
                this.setSql(sql);
        }
    }

    add(sql: string): QueryService {
        this._sql = this._sql.trim() + ' ' + sql.trim();
        return this;
    }

    get sql(): string { return this._sql }
    setSql(sql: string): QueryService { this._sql = sql; return this; }

    /**
     * 调用远程服务获取数据
     *
     * @param timeout 超时时间（单位秒）
     * @returns DataSet
     */
    open(timeout: number = 15): Promise<DataSet> {
        if (this._sql)
            this.setService(this.findService(this._sql));
        this.dataIn.head.setValue("_RecordFilter_", this._sql);
        return Promise.race([this.getPromise(), new Timeout(timeout).getPromise()]);
    }

    private findService(sql: string): string {
        let result: string = null;
        let items: string[] = sql.split(' ');
        for (let i = 0; i < items.length; i++) {
            if (items[i].toLowerCase() == "from") {
                // 防止取到空值
                while (items[i + 1] == null || "" == items[i + 1].trim()) {
                    i++;
                }
                result = items[++i]; // 获取数据库表名
                break;
            }
        }

        if (result == null)
            throw new Error("sql command error");

        return result;
    }
}
import DataSet from "./DataSet";
import RemoteService from "./RemoteService";

export default class QueryService extends RemoteService {
    private _sql: string = "";

    constructor(props: any) {
        super(props);
        if (props) {
            const { sql: sql } = props;
            if (sql)
                this.sql = sql;
        }
    }

    add(sql: string): QueryService {
        this._sql = this._sql.trim() + ' ' + sql.trim();
        return this;
    }

    get sql(): string { return this._sql }
    set sql(sql: string) { this._sql = sql }

    open(fn: (dataOut: DataSet) => void) {
        this.service = this.findService(this._sql);
        this.dataIn.head.setValue("_RecordFilter_", this._sql);
        this.exec(fn);
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
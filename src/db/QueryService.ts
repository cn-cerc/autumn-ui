import DataSet from "./DataSet";
import RemoteService from "./RemoteService";

export default class QueryService extends RemoteService {
    private _sqlText: string = "";

    constructor(owner: any) {
        super(owner);
        const { sqlText } = owner;
        if (sqlText)
            this.sqlText = sqlText;
    }

    add(sql: string): QueryService {
        this._sqlText = this._sqlText.trim() + ' ' + sql.trim();
        return this;
    }

    get sqlText(): string { return this._sqlText }
    set sqlText(sql: string) { this._sqlText = sql }

    open(fn: (dataOut: DataSet) => void) {
        this.service = this.findService(this._sqlText);
        this.dataIn.head.setValue("_service_filter_", this._sqlText);
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
import DataSet from "./DataSet";
import RemoteService from "./RemoteService";

export default class ServiceQuery extends RemoteService {
    private sql: string = "";

    constructor(owner: any) {
        super(owner);
    }

    add(sql: string): ServiceQuery {
        this.sql = this.sql.trim() + ' ' + sql.trim();
        return this;
    }

    getSqlText(): string {
        return this.sql;
    }
    setSqlText(sql: string): ServiceQuery {
        this.sql = sql;
        return this;
    }

    open(fn: (dataOut: DataSet) => void) {
        this.setService(this.findTableName(this.sql));
        let headIn = this.getDataIn().getHead();
        headIn.setValue("_service_filter_", this.sql);
        this.exec(fn);
    }

    findTableName(sql: string): string {
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
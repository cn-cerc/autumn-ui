export default class Datetime {
    private _data: Date;

    constructor(data: Date = null) {
        if (data)
            this._data = data
        else
            this._data = new Date();
    }

    toString() {
        return format(this._data, 'yyyy-MM-dd hh:mm:ss');
    }

    get yearMonth(): string { return format(this._data, 'yyyyMM') }
    get asFastDate(): FastDate { return new FastDate(this._data) }
    get asFastTime(): FastDate { return new FastTime(this._data) }
    get data() { return this._data }
}

export class FastDate extends Datetime {
    constructor(data: Date = null) {
        super(data);
    }
    toString() {
        return format(this.data, 'yyyy-MM-dd');
    }
}

export class FastTime extends Datetime {
    constructor(data: Date = null) {
        super(data);
    }
    toString() {
        return format(this.data, 'hh:mm:ss');
    }
}


export function format(data: Date, fmt: string) {
    var o = {
        "M+": data.getMonth() + 1,               //月份
        "d+": data.getDate(),                    //日
        "h+": data.getHours(),                   //小时
        "m+": data.getMinutes(),                 //分
        "s+": data.getSeconds(),                 //秒
        "S": data.getMilliseconds()              //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            //@ts-ignore
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

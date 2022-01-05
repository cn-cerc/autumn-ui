export default class Datetime {
    private _data: Date;

    constructor(data: Date = null) {
        if (data)
            this._data = data
        else
            this._data = new Date();
    }

    toString() {
        return this.format('yyyy-MM-dd hh:mm:ss');
    }

    get yearMonth(): string { return this.format('yyyyMM') }
    get asFastDate(): FastDate { return new FastDate(this._data) }
    get asFastTime(): FastDate { return new FastTime(this._data) }
    get data() { return this._data }

    format(fmt: string) {
        var o = {
            "M+": this._data.getMonth() + 1,               //月份
            "d+": this._data.getDate(),                    //日
            "h+": this._data.getHours(),                   //小时
            "m+": this._data.getMinutes(),                 //分
            "s+": this._data.getSeconds(),                 //秒
            "S": this._data.getMilliseconds()              //毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this._data.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                //@ts-ignore
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return fmt;
    }
}

export class FastDate extends Datetime {
    constructor(data: Date = null) {
        super(data);
    }
    toString() {
        return this.format('yyyy-MM-dd');
    }
}

export class FastTime extends Datetime {
    constructor(data: Date = null) {
        super(data);
    }
    toString() {
        return this.format('hh:mm:ss');
    }
}
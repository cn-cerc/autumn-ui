import DataSet from "../db/DataSet";
import TComponent from "../ui/TComponent";

export default class TMutiPage extends TComponent {
    //每页大小
    private _pageSize = 100;
    //总记录数
    private _size = 0;
    //当前页
    private _pageNo = 1;
    //数据集
    private _dataSet: DataSet;

    constructor(owner: TComponent) {
        super(owner);
    }

    get size() { return this._size };

    setPageSize(value: number) { this._pageSize = value; return this }
    getPageSize() { return this._pageSize }

    setPageNo(value: number) {
        if (value < 1)
            this._pageNo = 1;
        else if (value < this.getCount())
            this._pageNo = value;
        else
            this._pageNo = this.getCount();
        return this;
    }
    getPageNo() { return this._pageNo }

    set dataSet(value: DataSet) {
        this._dataSet = value;
        if (value)
            this._size = value.size;
        else
            this._size = 0;
    }
    get dataSet() { return this._dataSet }

    getBegin() {
        return (this._pageNo - 1) * this._pageSize + 1;
    }

    getEnd() {
        let temp = this._pageNo * this._pageSize;
        return temp < this._size ? temp : this._size;
    }

    //总页数
    getCount() {
        let temp = this._size % this._pageSize;
        return (this._size - temp) / this._pageSize + (temp > 0 ? 1 : 0);
    }

    forEach(callback: any) {
        if (this._dataSet == null)
            throw new Error("this.dataSet is null");

        for (let i = this.getBegin(); i <= this.getEnd(); i++) {
            this._dataSet.recNo = i + 1;
            callback(this._dataSet.current);
        }
    }
}

// let pages = new TMutiPage();
// pages.dataSet = new DataSet().append();
// pages.forEach(item => console.log(item));

// console.log("count:" + pages.getCount());
// pages.setPageNo(0);
// console.log(pages.getPageNo() + " begin:" + pages.getBegin() + ", end:" + pages.getEnd());
// pages.setPageNo(1);
// console.log(pages.getPageNo() + " begin:" + pages.getBegin() + ", end:" + pages.getEnd());
// pages.setPageNo(2);
// console.log(pages.getPageNo() + " begin:" + pages.getBegin() + ", end:" + pages.getEnd());
// pages.setPageNo(3);
// console.log(pages.getPageNo() + " begin:" + pages.getBegin() + ", end:" + pages.getEnd());
// pages.setPageNo(4);
// console.log(pages.getPageNo() + " begin:" + pages.getBegin() + ", end:" + pages.getEnd());

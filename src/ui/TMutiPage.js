import { DataSet } from "../SummerCI.js";
import TComponent from "./TComponent.js"

export default class TMutiPage extends TComponent {
    //每页大小
    pageSize = 100;
    //总记录数
    recordCount = 0;
    //当前页
    pageNo = 1;
    //数据集
    dataSet;

    constructor(owner) {
        super(owner);
    }

    getRecordCount() { return this.recordCount };

    setPageSize(value) { this.pageSize = value; return this }
    getPageSize() { return this.pageSize }

    setPageNo(value) {
        if (value < 1)
            this.pageNo = 1;
        else if (value < this.getCount())
            this.pageNo = value;
        else
            this.pageNo = this.getCount();
        return this;
    }
    getPageNo() { return this.pageNo }

    setDataSet(value) {
        this.dataSet = value;
        if (value)
            this.recordCount = value.getRecords().length;
        return this;
    }
    getDataSet(value) { return this.dataSet }

    getBegin() {
        return (this.pageNo - 1) * this.pageSize + 1;
    }

    getEnd() {
        let temp = this.pageNo * this.pageSize;
        return temp < this.recordCount ? temp : this.recordCount;
    }

    //总页数
    getCount() {
        let temp = this.recordCount % this.pageSize;
        return (this.recordCount - temp) / this.pageSize + (temp > 0 ? 1 : 0);
    }
}

TMutiPage.prototype.forEach = function (callback) {
    if (this.dataSet == null)
        throw new Error("this.dataSet is null");
    for (var i = this.getBegin(); i <= this.getEnd(); i++){
        callback(this.dataSet.getRecords(i));
    }
}

// let pages = new TMutiPage();
// pages.setDataSet(new DataSet().append());
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

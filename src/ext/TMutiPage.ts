import DataSet from "../db/DataSet";
import TComponent from "../ui/TComponent";

export default class TMutiPage extends TComponent {
    //每页大小
    pageSize = 100;
    //总记录数
    recordCount = 0;
    //当前页
    pageNo = 1;
    //数据集
    dataSet: DataSet;

    constructor(owner: TComponent) {
        super(owner);
    }

    getRecordCount() { return this.recordCount };

    setPageSize(value: number) { this.pageSize = value; return this }
    getPageSize() { return this.pageSize }

    setPageNo(value: number) {
        if (value < 1)
            this.pageNo = 1;
        else if (value < this.getCount())
            this.pageNo = value;
        else
            this.pageNo = this.getCount();
        return this;
    }
    getPageNo() { return this.pageNo }

    setDataSet(value: DataSet): TMutiPage {
        this.dataSet = value;
        if (value)
            this.recordCount = value.getRecords().length;
        return this;
    }

    getDataSet() { return this.dataSet }

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

    forEach(callback: any) {
        if (this.dataSet == null)
            throw new Error("this.dataSet is null");
            
        for (let i = this.getBegin(); i <= this.getEnd(); i++) {
            this.dataSet.setRecNo(i+1);
            callback(this.dataSet.getCurrent());
        }
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

import { DataSet, QueryService, TButton, TComponent, TDBEdit, TDBNavigator, TDiv, TEdit, TGrid, TGridGroupChild, TGridGroupMaster, TPage, TPanel, TSpan, TStatusBar } from "../src/Autumn-UI";
import React from "react";
import Grid from "../src/rcc/Grid";
import EditText from "./EditText";
import DBNavigator from "./DBNavigator";
import StatusBar from "./StatusBar";
import Footer from "./Footer";
import SearchTextBox from "./SearchTextBox";
// import "./FrmWelcome.css";

type StateType = {
    statusBar: string;
    dataSet: DataSet;
    master?: TGridGroupMaster;
    child?: TGridGroupChild;
}

const boxStyle = {
    height: '5em',
    backgroundColor: 'aqua',
    padding: '0.5rem'
}

export default class FrmWelcome extends React.Component<any, StateType> {
    private _grid: TGrid;
    private _searchValue: string;

    constructor(props: any) {
        super(props)
        this.state = { statusBar: '欢迎使用', dataSet: new DataSet() }
        let opera = this.state.dataSet.fieldDefs.add('opera');
        opera.name = '操作';
        opera.onGetText = (row, meta) => {
            let code = row.getString('code_');
            return new TButton(null, { text: '删除' }).writeProperty('onclick', `deleteRecord('${code}')`).toString();
        };
    }

    set searchValue(value: string) {
        this._searchValue = value;
    }
    get searchValue() {
        return this._searchValue;
    }

    onSearchClick = (value: string) => {
        alert("onSearchClick: " + value);
    }

    buttonClick() {
        // 须启动autumn-db范例项目，配合提供后台数据服务
        let config = { sid: '1234567890', host: 'http://127.0.0.1:8080/' };
        let query = new QueryService(config);
        // 服务前置过滤
        query.dataIn.head.setValue('code_', this.searchValue);
        query.add("select code_,name_,sex_,age_,createTime_ from db.s_example");
        query.open().then(ds => {
            this.state.statusBar
            this.setState({ ...this.state, statusBar: ds.message || '查询成功!' })
            let dataOut = this._grid.dataSet;
            this._grid.clear();

            dataOut.close();
            dataOut.fieldDefs.copy(ds.fieldDefs);
            dataOut.appendDataSet(ds);
            this._grid.dataSet = dataOut;

            this._grid.addColumns(dataOut.fieldDefs);
            let edtCode = new TDBEdit(this._grid.owner, { 'label': '工号：' });
            edtCode.dataSource = dataOut;
            edtCode.dataField = 'code_';
            let edtName = new TDBEdit(this._grid.owner, { 'label': '姓名：' });
            edtName.dataSource = dataOut;
            edtName.dataField = 'name_';
            this._grid.owner.render();
            dataOut.first();
        }).catch(ds => this.setState({ ...this.state, statusBar: ds.message }))
    }

    render() {
        return (
            <div>
                <div>
                    <span id="msg"> 欢迎使用 autumn-ui 前端框架! </span>
                </div>
                < div id="box" style={boxStyle}>
                    <SearchTextBox label="搜索条件：" onChanged={this.onSearchClick} />
                </div>
                {this.getGrid()}
                <StatusBar message={this.state.statusBar} />
                <Footer year='2021' corpName='深圳市华软资讯科技有限公司' />
            </div>
        )
    }

    getGrid() {
        if (this.state.dataSet.size == 0)
            return null;
        return (
            <div id="auto">
                <Grid id="grid" dataSet={this.state.dataSet} master={this.state.master} />
                <DBNavigator dataSet={this.state.dataSet} />
            </div>
        )
    }

    deleteRecord = (code: string) => {
        let grid: Grid = null;
        if (grid.props.dataSet.locate('code_', code))
            grid.props.dataSet.delete();
        else
            alert(`没有找到code=${code}`);
    }
}

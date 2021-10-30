import { DataRow, DataSet, QueryService, TButton, TComponent, TDBEdit, TDBNavigator, TDiv, TEdit, TGrid, TGridColumn, TGridGroupChild, TGridGroupMaster, TPage, TPanel, TSpan, TStatusBar } from "../src/Autumn-UI";
import React from "react";
import Grid from "../src/rcc/Grid";
import DBEdit from "./DBEdit";
import DBNavigator from "./DBNavigator";
import StatusBar from "./StatusBar";
import Footer from "./Footer";
import SearchTextBox from "./SearchTextBox";
import Header from "./Header";
// import "./FrmWelcome.css";

type StateType = {
    statusBar: string;
    dataSet: DataSet;
    master?: TGridGroupMaster;
    child?: TGridGroupChild;
}

const boxStyle = {
    height: '5em',
    backgroundColor: 'gainsboro',
    padding: '0.5rem'
}

export default class FrmWelcome extends React.Component<any, StateType> {
    private _searchValue: string;

    constructor(props: any) {
        super(props)
        this.state = { statusBar: '欢迎使用', dataSet: new DataSet() }
    }

    set searchValue(value: string) {
        this._searchValue = value;
    }
    get searchValue() {
        return this._searchValue;
    }

    onSearchClick = (value: string) => {
        // 须启动autumn-db范例项目，配合提供后台数据服务
        let config = { sid: '1234567890', host: 'http://127.0.0.1:8080/' };
        let query = new QueryService(config);
        // 服务前置过滤
        query.dataIn.head.setValue('code_', value);
        // query.add("select code_,name_,sex_,age_,createTime_ from db.s_example");
        query.add("select code_,name_,sex_,age_,createTime_ from SvrExample.search");
        query.open().then(dataOut => {
            let master = new TGridGroupMaster(null);
            for (let meta of dataOut.fieldDefs.fields)
                new TGridColumn(master, meta.code, meta.name);
            let opera = new TGridColumn(master, 'opera', '操作');
            opera.onRender = this.getOperaRender;
            this.setState({
                ...this.state, statusBar: dataOut.message || '查询成功!',
                dataSet: dataOut, master: master
            });
        }).catch(ds => {
            this.setState({ ...this.state, statusBar: ds.message })
        })
    }

    getOperaRender = (sender: TGridColumn, row: DataRow) => {
        let recNo = "" + row.dataSet.recNo;
        return <button id={recNo} onClick={this.onDeleteRow}>删除</button>
    }

    onDeleteRow = (el: any) => {
        let recNo = Number.parseInt(el.target.id);
        this.state.dataSet.recNo = recNo;
        this.state.dataSet.delete();
        this.setState({ ...this.state, dataSet: this.state.dataSet });
    }

    onNavigator = (row: DataRow) => {
        this.setState({ ...this.state, dataSet: this.state.dataSet });
    }

    render() {
        return (
            <div>
                <Header title='欢迎使用 autumn-ui 前端框架! ' />
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
                <DBNavigator dataSet={this.state.dataSet} onNavigator={this.onNavigator} />
                <DBEdit dataSource={this.state.dataSet} dataField="code_" label="工号：" ></DBEdit>
                <DBEdit dataSource={this.state.dataSet} dataField="name_" label="姓名：" ></DBEdit>
            </div>
        )
    }

}

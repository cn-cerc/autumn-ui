import { DataRow, DataSet, QueryService, TButton, TComponent, TDBEdit, TDBNavigator, TDiv, TEdit, TGrid, TGridColumn, TGridGroupChild, TGridGroupMaster, TPage, TPanel, TSpan, TStatusBar } from "../src/Autumn-UI";
import React from "react";
import Grid from "../src/rcc/Grid";
import DBEdit from "../src/rcc/DBEdit";
import StatusBar from "../src/rcc/StatusBar";
import Footer from "../src/rcc/Footer";
import SearchText from "../src/rcc/SearchText";
import Header from "../src/rcc/Header";
import MenuPath from "../src/rcc/MenuPath";
import KeyValue from "../src/db/KeyValue";
import DBNavigator from "../src/rcc/DBNavigator";

type stateType = {
    statusBar: string;
    dataSet: DataSet;
    master?: TGridGroupMaster;
    child?: TGridGroupChild;
}

const boxStyle = {
    // height: '3em',
    backgroundColor: 'gainsboro',
    padding: '0.5rem'
}

export default class FrmWelcome extends React.Component<any, stateType> {
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
            let colName = new TGridColumn(master, "name_", "姓名");
            colName.onRender = (column: TGridColumn, row: DataRow) => {
                let value = "#" + row.dataSet.recNo;
                return <a href={value} onClick={this.onCodeClick}>{row.getString('name_')}</a>
            }

            new TGridColumn(master, "sex_", "性别");
            new TGridColumn(master, "age_", "年龄");
            new TGridColumn(master, "createTime_", "创建日期");
            let opera = new TGridColumn(master, 'opera', '操作');
            opera.onRender = (column: TGridColumn, row: DataRow) => {
                return <button id={"" + row.dataSet.recNo} onClick={this.onDeleteRow}>删除</button>
            }
            this.setState({
                ...this.state, statusBar: dataOut.message || '查询成功!',
                dataSet: dataOut, master: master
            });
        }).catch(ds => {
            this.setState({ ...this.state, statusBar: ds.message })
        })
    }

    onCodeClick = (el: any) => {
        let value: string = el.target.hash;
        let recNo = Number.parseInt(value.substr(1, value.length - 1));
        this.state.dataSet.recNo = recNo;
        this.setState(this.state);
    }

    onDeleteRow = (el: any) => {
        let recNo = Number.parseInt(el.target.id);
        this.state.dataSet.recNo = recNo;
        this.state.dataSet.delete();
        this.setState(this.state);
    }

    onNavigator = (row: DataRow) => {
        this.setState(this.state);
    }

    render() {
        let menus: KeyValue[] = [];
        menus.push(new KeyValue('欢迎').setKey('welcome'))
        menus.push(new KeyValue('首页').setKey('index'))
        return (
            <div>
                <Header title='欢迎使用 autumn-ui 前端框架! ' />
                <MenuPath menus={menus} />
                < div id="box" style={boxStyle}>
                    <SearchText label="搜索条件：" onChanged={this.onSearchClick} />
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
                <div style={{ backgroundColor: 'cyan', padding: '0.5rem' }}>
                    <DBNavigator dataSet={this.state.dataSet} onNavigator={this.onNavigator} />
                    <DBEdit dataSource={this.state.dataSet} dataField="code_" label="工号：" updateRow={this.updateDataSet} ></DBEdit>
                    <DBEdit dataSource={this.state.dataSet} dataField="name_" label="姓名：" updateRow={this.updateDataSet} ></DBEdit>
                </div>
            </div>
        )
    }

    updateDataSet = () => {
        this.setState(this.state);
    }
}

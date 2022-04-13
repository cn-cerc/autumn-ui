/** 用户商品搜索开窗时子项商品列表开窗 */
import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import Block, { Line } from "../rcc/Block";
import { ColumnIt } from "../rcc/ColumnIt";
import DBGrid, { Column } from "../rcc/DBGrid";
import DialogApi from "./DialogApi";
import styles from "./GetMarque.css";
import { showMsg } from "./Summer";

type GetMarqueTypeProps = {
    partCode: string,
    name?: string,
    isChild?: boolean,
    handleClose?: Function
} & Partial<BaseDialogPropsType>

type GetMarqueTypeState = {
    headData: DataSet,
    dataSet: DataSet,
    filters: Map<string, string>,
    dbData: DataSet,
    showAll: boolean
} & Partial<BaseDialogStateType>

export default class GetMarque extends BaseDialog<GetMarqueTypeProps, GetMarqueTypeState>{
    constructor(props: GetMarqueTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            headData: new DataSet(),
            dataSet: new DataSet(),
            filters: new Map(),
            dbData: new DataSet(),
            showAll: false,
            width: '55rem',
            height: this.isPhone ? '100%' : '37.5rem'
        }
    }

    async init() {
        this.showAsChild();
        this.setLoad(true);
        let dataSet = await DialogApi.getSubItem({ Marque_: this.props.partCode });
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        }
        let headData = new DataSet();
        let options = dataSet.head.getValue('Option_');
        if (options)
            headData.setJson(dataSet.head.getValue('Option_'));
        let filters: Map<string, string> = new Map();
        headData.records.forEach((row: DataRow) => {
            filters.set(row.getString('Name_'), '');
        })
        let dbData: DataSet = new DataSet();
        dbData.appendDataSet(dataSet);
        this.setState({
            dataSet,
            headData,
            filters,
            dbData
        })
        this.setLoad(false);
    }

    content() {
        return (
            <React.Fragment>
                <div className={styles.main}>
                    <div className={styles.headContent}>{this.getHead()}</div>
                    {this.getTable()}
                </div>
            </React.Fragment>
        )
    }

    getAdornment(): JSX.Element {
        return <span role='auiOpera' onClick={this.init.bind(this)}>{this.props.name}</span>;
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dbData}>
                    <Line>
                        <ColumnIt name='' />
                        <Column code='descSpec' width='85' customText={this.initDescSepc.bind(this)}></Column>
                        <Column code='opera' width='10' customText={this.initOpera.bind(this)}></Column>
                    </Line>
                    <Line>
                        <Column code='Brand_' name='品牌' width='100'></Column>
                    </Line>
                    <Line>
                        <Column code='Code_' name='料号' width='100'></Column>
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dbData}>
                    <ColumnIt />
                    <Column code='Brand_' name='品牌' width='15' />
                    <Column code='DescSepc' name='品名规格' width='30' customText={this.initDescSepc} />
                    <Column code='Code_' name='料号' width='20' />
                    <Column code='opera' name='操作' textAlign='center' width='12' customText={this.initOpera.bind(this)} />
                </DBGrid>
            )
        }
    }

    getHead() {
        let heads: JSX.Element[] = [];
        let bool = true;
        let num = 0;
        let dataSet = this.state.headData;
        for (let index = 0; index < dataSet.size; index++) {
            let row: DataRow = dataSet.records[index];
            if (num > 3 && !this.state.showAll) {
                heads.push(
                    <div style={{ 'textAlign': 'right' }} key='setAll'>
                        <span role='auiOpera' onClick={this.changeShowAll.bind(this)}>展开↓</span>
                    </div>
                )
                break;
            }
            let name = row.getString('Name_');
            heads.push(
                <div className={styles.head} key={name}><Head dataRow={row} selectValue={this.state.filters.get(name)} handleClick={this.filter.bind(this)} /></div>
            );
            num++;
        }
        if (dataSet.size > 4 && this.state.showAll) {
            heads.push(
                <div style={{ 'textAlign': 'right' }} key='setAll'>
                    <span role='auiOpera' onClick={this.changeShowAll.bind(this)}>收起↑</span>
                </div>
            )
        }
        return heads;
    }

    initDescSepc(dataRow: DataRow) {
        let text;
        if (dataRow.getValue('Spec_'))
            text = ',' + dataRow.getValue('Spec_');
        if (this.isPhone)
            return <span style={{ width: '85%', 'display': 'inline-block' }}>{dataRow.getValue('Desc_')}{text}</span>
        else
            return <span>{dataRow.getValue('Desc_')}{text}</span>
    }

    initOpera(dataRow: DataRow) {
        if (this.isPhone)
            return <span role='auiOpera' onClick={() => this.handleClick(dataRow)}>选择</span>
        else
            return <span role='auiOpera' onClick={() => this.handleClick(dataRow)}>选择</span>
    }

    handleClick(dataRow: DataRow) {
        if (this.props.isChild) {
            this.props.handleClose(dataRow);
        }
        // 后期若作为独立开窗选择子项商品之后的事件处理可放在else中
    }

    changeShowAll() {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    filter(key: string, value: string) {
        if (this.state.filters.get(key) == value)
            this.state.filters.set(key, '');
        else
            this.state.filters.set(key, value);
        let dbData: DataSet = new DataSet();
        dbData.appendDataSet(this.state.dataSet);
        dbData.first();
        while (dbData.fetch()) {
            let bool = true;
            this.state.filters.forEach((value, key) => {
                let str: string = dbData.getString('Desc_') + ',' + dbData.getValue('Spec_')
                if (value && str.indexOf(value) < 0) {
                    bool = false;
                }
            })
            if (!bool) dbData.delete();
        }
        this.setState({ dbData });
    }
}

type HeadTypeProps = {
    dataRow: DataRow,
    handleClick: Function,
    selectValue: string
}

type HeadTypeState = {
    name: string,
    options: string[]
}

class Head extends React.Component<HeadTypeProps, HeadTypeState> {
    constructor(props: HeadTypeProps) {
        super(props);
        let name = this.props.dataRow.getString('Name_');
        let options = this.props.dataRow.getString('Option_').split(',');
        this.state = {
            name,
            options
        }
    }

    render() {
        return (
            <React.Fragment>
                <label>{this.state.name}：</label>
                <ul>{this.getOptions()}</ul>
            </React.Fragment>
        )
    }

    getOptions() {
        return this.state.options.map((op) => {
            return <li key={op} onClick={() => this.handleClick(op)} className={op == this.props.selectValue ? styles.selected : ''} >{op}</li>
        })
    }

    handleClick(option: string) {
        this.props.handleClick(this.props.dataRow.getString('Name_'), option)
    }
}
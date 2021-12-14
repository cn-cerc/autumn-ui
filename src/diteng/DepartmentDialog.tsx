import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import SearchPanel from "../rcc/SearchPanel";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import DialogApi from './DialogApi';
import { showMsg } from "./Summer";
import styles from "./StaffDialog.css";
import DBDrop from "../rcc/DBDrop";
import Block, { Line } from "../rcc/Block";

const CUSTOMER_204008 = '204008';

type DepartmentTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    options: Map<string, string>,
    showBack: boolean,
    history: DataSet[]
} & Partial<BaseDialogStateType>

export default class DepartmentDialog extends BaseDialog<BaseDialogPropsType, DepartmentTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let options = new Map();
        options.set("一级部门", "8");
        options.set("二级部门", "12");
        options.set("三级部门", "16");
        options.set("四级部门", "20");
        options.set("五级部门", "24");
        options.set("六级部门", "28");
        let dataIn = new DataRow();
        dataIn.setValue('DeptLevel_', '8');
        dataIn.setValue('Disable_', false);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            options,
            showBack: false,
            width: '45rem',
            history: new Array(),
            height: this.isPhone ? '25rem' : '35rem'
        }
        this.setTitle('请选择部门');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let ds = await DialogApi.getUserInfo();
        let userData = new DataSet();
        userData.setJson(ds.json);
        let cropNo = userData.head.getString('CorpNo_');
        if(cropNo == CUSTOMER_204008)
            this.state.dataIn.setValue('DeptLevel_', '12');
        let dataSet = await this.getDepartments();
        this.state.history.push(dataSet);
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            this.setState({
                dataSet
            })
        }
    }

    content() {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSearch.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_'></DBEdit>
                    <DBDrop dataName='部门层架' dataField='DeptLevel_' options={this.state.options}></DBDrop>
                </SearchPanel>
                {this.state.showBack ? <div style={{ 'padding': '0 1rem' }}><span role='opera' style={{ 'cursor': 'pointer' }} onClick={this.handleBack.bind(this)}>返回上一级</span></div> : ''}
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet}>
                    <Line>
                        <Column name='部门代码' code='Code_' width='100'></Column>
                    </Line>
                    <Line>
                        <Column name='部门名称' code='Name_' width='100' customText={(row: DataRow) => {
                            return (
                                <React.Fragment>
                                    <span>部门名称：</span>
                                    <span role='opera' onClick={this.nameClick.bind(this, row)}>{row.getString('Name_')}</span>
                                </React.Fragment>
                            )
                        }}></Column>
                    </Line>
                    <Line>
                        <Column name='停用否' code='Disable_' width='80' customText={(row: DataRow) => {
                            let text = row.getValue('Disable_') ? '是' : '否';
                            return <span>停用否：{text}</span>
                        }}></Column>
                        <Column code='opera' textAlign='right' width='20' customText={(row: DataRow) => {
                            return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }}></Column>
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet} showOrder={true}>
                    <Column name='部门代码' code='Code_' width='20'></Column>
                    <Column name='部门名称' code='Name_' width='20' customText={(row: DataRow) => {
                        return <span role='opera' onClick={this.nameClick.bind(this, row)}>{row.getString('Name_')}</span>
                    }}></Column>
                    <Column name='停用否' code='Disable_' width='20' customText={(row: DataRow) => {
                        let text = row.getValue('Disable_') ? '是' : '否';
                        return <span>{text}</span>
                    }}></Column>
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={(row: DataRow) => {
                        return <span role='opera' onClick={this.handleClick.bind(this, row)}  >选择</span>
                    }}></Column>
                </DBGrid>
            )
        }
    }

    async getDepartments(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getDepartments(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    async handleSearch() {
        if (this.state.dataIn.getValue('PCode'))
            this.state.dataIn.setValue('PCode', '');
        let dataSet = await this.getDepartments();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            let history: DataSet[] = [];
            this.state.dataIn.setValue('SearchText_', '');
            history.push(dataSet)
            this.setState({
                dataSet,
                history,
                showBack: false,
            })
        }
    }

    async nameClick(row: DataRow) {
        let level = Number(this.state.dataIn.getString('DeptLevel_')) + 4;
        this.state.dataIn.setValue('DeptLevel_', String(level)).setValue('PCode', row.getString('Code_'));
        let dataSet = await this.getDepartments();
        this.state.history.push(dataSet);
        this.setState({
            showBack: true,
            dataSet
        })
    }

    async handleBack() {
        let level = Number(this.state.dataIn.getString('DeptLevel_')) - 4;
        this.state.dataIn.setValue('DeptLevel_', String(level));
        this.state.history.pop();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.history[this.state.history.length - 1])
        this.setState({
            showBack: this.state.history.length > 1 ? true : false,
            dataSet
        })
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input2.value = row.getString('Name_');
        this.handleSelect();
    }
}
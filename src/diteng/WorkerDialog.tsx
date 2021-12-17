import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBDrop from "../rcc/DBDrop";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import DialogApi from './DialogApi';
import styles from "./StaffDialog.css";

type WorkerTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    options: Map<string, string>
} & Partial<BaseDialogStateType>

export default class WorkerDialog extends BaseDialog<BaseDialogPropsType, WorkerTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('WorkStatus_', 1);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            options: new Map(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择员工');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet2 = await DialogApi.getDeptAndHRList();
        let options = new Map();
        while (dataSet2.fetch()) {
            options.set(dataSet2.getString('Name_'), dataSet2.getString('DeptCode_'));
        }
        let dataSet = await this.getWorkers();
        this.setState({
            options,
            dataSet
        })
    }

    content() {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                    <DBDrop dataName='部门查询' dataField='DeptCode_' options={this.state.options}></DBDrop>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                    <Column name='姓名' code='Name_' width='20'></Column>
                    <Column name='部门' code='DeptName_' width='30'></Column>
                    <Column name='手机号' code='Mobile_' width='25'></Column>
                    <Column name='操作' code='opera' width='20' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='opera'>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getWorkers(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getWorkers(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input2.value = row.getValue('Name_');
        this.handleSelect();
    }
}
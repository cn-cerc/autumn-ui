import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBDrop, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import styles from "./StaffDialog.css";

type WorkerTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    options: Map<string, string>
} & Partial<BaseDialogStateType>

export default class WorkerDialog extends BaseDialog<BaseDialogPropsType, WorkerTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let workerEndTime = new Date().getTime();
        let woekerStartTime = this.getStorage('WorkerTime');
        if(woekerStartTime && workerEndTime - Number(woekerStartTime) > this.searchTimeOut) {
            this.delStorage('Worker');
            this.delStorage('WorkerTime');
        }
        let storageData = this.getStorage('Worker');
        let dataIn = new DataRow();
        if (storageData)
            dataIn.setJson(storageData)
        else
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
        let dataSet2 = await DitengApi.getDeptAndHRList();
        let options = new Map();
        options.set("所有部门", "");
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
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <Column name='姓名' code='Name_' width='20'></Column>
                    <Column name='部门' code='DeptName_' width='30'></Column>
                    <Column name='手机号' code='Mobile_' width='25'></Column>
                    <Column name='操作' code='opera' width='20' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera'>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getWorkers(): Promise<DataSet> {
        this.setLoad(true);
        let data = this.state.dataIn.json;
        this.setStorage('Worker', data);
        this.setStorage('WorkerTime', new Date().getTime());
        let dataSet = await DitengApi.getWorkers(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if(input2) input2.value = row.getValue('Name_');
        this.handleSelect();
    }
}
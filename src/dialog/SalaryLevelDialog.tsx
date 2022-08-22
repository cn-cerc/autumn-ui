import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBCheckbox, DBDrop, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import "../tool/Summer.css";
import styles from "./StaffDialog.css";

type SalaryLevelTypeState = {
    dataIn: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class SalaryLevelDialog extends BaseDialog<BaseDialogPropsType, SalaryLevelTypeState> {
    constructor(props: BaseDialogStateType) {
        super(props);
        let dataSet = new DataSet();
        let dataIn = new DataRow();
        this.state = {
            ...this.state,
            dataIn,
            dataSet,
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DitengApi.getSalaryLevel(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="SearchText_" dataName="查询条件" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <ColumnIt width={this.isPhone ? '10' : '5'}/>
                    <Column code="Code_" name="等级代码" width="20"></Column>
                    <Column code="Name_" name="等级名称" width="20"></Column>
                    <Column code="Total_" name="合计" width="20"></Column>
                    <Column code="Remark_" name="备注" width="20"></Column>
                    <Column code="opera" name="操作" width="15" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera">选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if (input2) input2.value = row.getString('Name_');
        this.handleSelect();
    }
}
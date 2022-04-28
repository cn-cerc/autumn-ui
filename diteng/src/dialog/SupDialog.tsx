import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBDrop, DBCheckbox, DBGrid, Column } from "autumn-ui";
import React from "react";
import DialogApi from "./DialogApi";
import styles from "./StaffDialog.css";
import "./Summer.css";

type SupTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    typeList: Map<string, string>
} & Partial<BaseDialogStateType>

export default class SupDialog extends BaseDialog<BaseDialogPropsType, SupTypeState> {
    constructor(props: BaseDialogStateType) {
        super(props);
        let dataSet = new DataSet();
        let typeList = new Map();
        let dataIn = new DataRow();
        dataIn.setValue('Disable_', false);
        typeList.set("所有厂商", "");
        typeList.set("普通厂商", "0");
        typeList.set("协力厂商", "1");
        this.state = {
            ...this.state,
            dataIn,
            dataSet,
            typeList,
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getSupInfo(this.state.dataIn);
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
                    <DBDrop dataField="SupType_" dataName="厂商类别" options={this.state.typeList}></DBDrop>
                    <DBCheckbox dataField="Disable_" dataName="查询已停用厂商" className={styles.searchCheck}></DBCheckbox>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <Column code="ShortName_" name="厂商简称" width="40"></Column>
                    <Column code="SupType_" name="厂商分类" width="20" customText={this.initSupType.bind(this)}></Column>
                    <Column code="Contact_" name="联系方式" width="35" customText={(row: DataRow) => {
                        return <span>{row.getValue("Contact_")},{row.getValue("Tel1_")}</span>
                    }}></Column>
                    <Column code="Code_" name="操作" width="15" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera">选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    initSupType(dataRow: DataRow) {
        let text = "";
        if (dataRow.getValue("SupType_") == 0)
            text = "普通厂商"
        else
            text = "协力厂商"
        return (
            <span>{text}</span>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(",");
        if(this.props.onSelect) {
            let row = new DataRow();
            row.setValue(inputIds[0], dataRow.getValue("Code_"));
            row.setValue(inputIds[1], dataRow.getValue("Name_"));
            this.props.onSelect(row);
            this.handleClose();
        } else {
            let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
            input1.value = dataRow.getValue("Code_");
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            if(input2) input2.value = dataRow.getValue("Name_");
            this.handleSelect();
        }
        
    }
}
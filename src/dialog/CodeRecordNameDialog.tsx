import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, DataRow, DataSet, DBEdit, SearchPanel, DBDrop } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./CodeRecordNameDialog.css";

type CodeRecordNameProps = {
    code: String,
    callBack?: Function

} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    typeList: Map<string, string>
} & Partial<BaseDialogStateType>

export default class CodeRecordNameDialog extends BaseDialog<CodeRecordNameProps, StaffTypeState> {
    constructor(props: CodeRecordNameProps) {
        super(props)
        let dataIn = new DataRow();
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            typeList: new Map(),
            width: '60rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getCargoCodeNameRecord(this.state.dataIn);
        let dataSet1 = await FplApi.queryCodeTypeList(this.state.dataIn);
        let typeList = new Map();
        typeList.set("请选择", "");
        dataSet1.forEach(item => {
            typeList.set(item.getString("name_"), item.getString("code_"));
        });
        this.setLoad(false);
        this.setState({
            dataSet,
            typeList
        })
    }

    content() {
        let list = Array();
        this.state.dataSet.forEach(item => {
            list.push(<a onClick={this.handleClick.bind(this, item)}>{item.getString("code_")}</a>);
        })
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBDrop dataField="parent_code_" dataName="货物分类" options={this.state.typeList}></DBDrop>
                    <DBEdit dataField="code_" dataName="货物名称" autoFocus></DBEdit>
                </SearchPanel>
                <div className={styles.site}>
                    {list}
                </div>
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        if (input1)
            input1.value = dataRow.getString('code_');
        if (this.props.callBack)
            this.props.callBack(dataRow);
        this.handleSelect();
    }
}
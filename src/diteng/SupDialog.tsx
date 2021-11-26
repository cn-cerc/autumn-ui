import React from "react";
import SearchPanel from "../rcc/SearchPanel";
import DBGrid, { Column } from "../rcc/DBGrid";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import "./Summer.css";
import styles from "./StaffDialog.css";
import DBEdit from "../rcc/DBEdit";
import DBDrop from "../rcc/DBDrop";
import QueryService from "../db/QueryService";
import { showMsg } from "./Summer";

type propsType = {
    token: string,
    inputId: string,
    viewId: string,
    items: any,
    isExecute: boolean
}

type stateType = {
    dataIn: DataRow,
    dataSet: DataSet
}

export default class SupDialog extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.setJsonString(this.props.items);
        this.state = {
            dataIn: new DataRow(),
            dataSet,
        }
    }

    render() {
        let options = new Map();
        options.set("所有厂商", "");
        options.set("普通厂商", "0");
        options.set("协力厂商", "1");
        let contact;
        if(this.props.isExecute) 
            contact = <Column code="Contact_" name="联系方式" width="35" customText={this.initContact.bind(this)}></Column>
        else
            contact = <Column code="Contact_" name="联系方式" width="35"></Column>
        let bool = true;
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSubmit.bind(this)}>
                    <DBEdit dataField="SearchText_" dataName="查询条件"></DBEdit>
                    <DBDrop dataField="SupType_" dataName="厂商类别" options={options}></DBDrop>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet}>
                    <Column code="Name_" name="厂商简称" width="40"></Column>
                    <Column code="SupType_" name="厂商分类" width="20" customText={this.initSupType.bind(this)}></Column>
                    {contact}
                    <Column code="Code_" name="操作" width="15" customText={this.initOpera.bind(this)}></Column>
                </DBGrid>
            </div>
        )
    }

    handleSubmit(dataRow: DataRow) {
        let query = new QueryService(this.props);
        query.setService("TAppSupInfo.Download");
        query.dataIn.head.copyValues(this.state.dataIn);
        query.dataIn.head.setValue("Disable_", false);
        query.open().then((dataOut: DataSet)=>{
            this.setState({
                dataSet: dataOut
            })
        }).catch((dataOut: DataSet)=>{
            showMsg(dataOut.message)
        })
    }

    initSupType(dataRow: DataRow) {
        let text = "";
        if(dataRow.getValue("SupType_") == 0)
            text = "普通厂商"
        else
            text = "协力厂商"
        return (
            <td>{text}</td>
        )
    }

    initContact(dataRow: DataRow) {
        return <td>{dataRow.getValue("Contact_")},{dataRow.getValue("Tel1_")}</td>
    }

    initOpera(dataRow: DataRow) {
        return <td role="opera" onClick={()=>this.handleClick(dataRow)} align="center">操作</td>
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(dataRow.getValue("Code_"));
        $("#" + inputIds[1], parent.document).val(dataRow.getValue("Name_"));
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }
}
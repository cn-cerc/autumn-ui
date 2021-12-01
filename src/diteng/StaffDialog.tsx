import React from "react";
import DataRow from "../db/DataRow";
import SearchPanel from "../rcc/SearchPanel";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import DataSet from "../db/DataSet";
import styles from "./StaffDialog.css"; 
import "./Summer.css";
import QueryService from "../db/QueryService";
import { showMsg } from "./Summer";

type propsType = {
    token: string,
    inputId: string,
    viewId: string,
    items: any,
}

type stateType = {
    dataIn: DataRow,
    dataSet: DataSet
}

export default class StaffDialog extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props)
        let dataSet = new DataSet();
        dataSet.setJson(this.props.items);
        this.state = {
            dataIn: new DataRow(),
            dataSet,
        }
    }

    render() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSubmit.bind(this)}>
                    <DBEdit dataField="SearchText_" dataName="查询条件"></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet}>
                    <Column code="Code_" name="员工代码" width="50"></Column>
                    <Column code="Name_" name="员工名称" width="30"></Column>
                    <Column code="opera" name="操作" width="20" customText={this.customText.bind(this)}></Column>
                </DBGrid>
            </div>
        )
    }

    customText(dataRow: DataRow) {
        return (
            <td role="opera" onClick={()=>this.handleClick(dataRow)} align="center">选择</td>
        )
    }

    handleSubmit(dataRow: DataRow) {
        let query = new QueryService(this.props);
        query.dataIn.head.copyValues(dataRow);
        query.setService("SvrStaffMan.search");
        query.open().then((dataOut: DataSet)=>{
            this.setState({
                dataSet: dataOut
            })
        }).catch((dataOut: DataSet) => {
            showMsg(dataOut.message);
        })
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(",");
        $("#" + inputIds[0], parent.document).val(dataRow.getValue("Code_"));
        $("#" + inputIds[1], parent.document).val(dataRow.getValue("Name_"));
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
    }
}
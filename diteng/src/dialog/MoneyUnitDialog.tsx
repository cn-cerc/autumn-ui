import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import SClient from "../db/SClient";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import { CustomFormPropsType } from "./CustomForm";
import styles from "./StaffDialog.css";

type MoneyUnitTypeProps = {
    dataRow?: DataRow,
    dataFields: string,
    onChanged?: Function
} & Partial<BaseDialogPropsType> & Partial<CustomFormPropsType>

type MoneyUnitTypeState = {
    client: SClient,
    dataIn: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class MoneyUnitDialog extends BaseDialog<MoneyUnitTypeProps, MoneyUnitTypeState> {
    constructor(props: MoneyUnitTypeProps) {
        super(props);
        let client = new SClient(this.props);
        client.server.setHost('http://127.0.0.1:8080/');
        client.server.setToken(this.props.token);
        client.setService('MoneyUnit');
        this.state = {
            ...this.state,
            client,
            dataIn: new DataRow(),
            dataSet: new DataSet(),
            width: '45rem',
            height: '30rem'
        }
    }

    async init() {
        this.showAsChild();
        this.state.client.head.close
        this.state.client.head.copyValues(this.state.dataIn);
        await this.state.client.open();
        this.state.dataSet.clear();
        this.state.dataSet.appendDataSet(this.state.client);
        if (this.state.client.state <= 0) {
            return;
        }
        this.setState({ ...this.state });
    }

    content() {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='币别代码' dataField='Code_' autoFocus onChanged={this.filter.bind(this)}></DBEdit>
                    <DBEdit dataName='币别名称' dataField='Name' onChanged={this.filter.bind(this)}></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <Column name='币别代码' code='Code_' width='50'></Column>
                    <Column name='币别名称' code='Name_' width='50'></Column>
                    <Column name='操作' code='opera' width='20' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera'>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        if (this.props.onChanged)
            this.props.onChanged(row);
        this.handleClose();
    }

    getAdornment(): JSX.Element {
        return <span role='auiOpera' onClick={this.init.bind(this)}></span>;
    }

    filter() {
        this.state.dataSet.clear();
        this.state.dataSet.appendDataSet(this.state.client);
        let code = this.state.dataIn.getString('Code_');
        let name = this.state.dataIn.getString('Name');
        this.state.dataSet.first();
        while(this.state.dataSet.fetch()) {
            let bool = true;
            if(code && this.state.dataSet.getString('Code_').indexOf(code) < 0)
                bool = false;
            if(name && this.state.dataSet.getString('Name_').indexOf(name) < 0)
                bool = false;
            if(!bool)
                this.state.dataSet.delete();
        }
        this.setState({...this.state});
    }
}
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

type LogisticsTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class LogisticsDialog extends BaseDialog<BaseDialogPropsType, LogisticsTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn: new DataRow(),
            width: '50rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getLogistics();
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
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet}>
                    <Column name='公司名称' code='Name_' width='50'></Column>
                    <Column name='电话号码' code='Tel_' width='50'></Column>
                    <Column name='操作' code='opera' width='20' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getLogistics(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getLogistics(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Name_');
        this.handleSelect();
    }
}
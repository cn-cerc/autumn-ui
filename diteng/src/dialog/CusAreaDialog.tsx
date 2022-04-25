import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import SearchPanel from "../rcc/SearchPanel";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import Block, { Line } from "../rcc/Block";
import DialogApi from './DialogApi';
import { showMsg } from "./Summer";
import styles from "./StaffDialog.css";
import { ColumnIt } from "../rcc/ColumnIt";

type CusAreaTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class CusAreaDialog extends BaseDialog<BaseDialogPropsType, CusAreaTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn: new DataRow(),
            width: '40rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择区域');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getAreaList();
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
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                </SearchPanel>
                {this.getTable()}
            </div>
        )
    }

    async getAreaList(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getAreaList(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet}>
                    <Line>
                        <ColumnIt />
                    </Line>
                    <Line>
                        <Column name='区域' code='SalesArea_' width='40'></Column>
                        <Column name='选择' code='opera' width='10' textAlign='right' customText={
                            (row: DataRow) => {
                                return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                            }
                        }></Column>
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <ColumnIt width='10' />
                    <Column name='区域' code='SalesArea_' width='30'></Column>
                    <Column name='选择' code='opera' width='12' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera'>选择</span>
                        }
                    }></Column>
                </DBGrid>
            )
        }
    }

    handleClick(row: DataRow) {
        console.log(row)
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('SalesArea_');
        this.handleSelect();
    }
}
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

type OutInfoTypeProps = {
    maxRecord: number
} & Partial<BaseDialogPropsType>

type OutInfoTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class OutInfoDialog extends BaseDialog<OutInfoTypeProps, OutInfoTypeState> {
    constructor(props: OutInfoTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', this.props.maxRecord);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            width: '50rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择地藤账套');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getOurInfo();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            this.setState({
                dataSet
            })
        }
    }

    content() {
        let columns = [];
        if (!this.isPhone) {
            columns.push(<Column name='帐套全称' code='Name_' width='45' key={'Name_'}></Column>);
            columns.push(<Column name='使用状态' code='Status_' width='15' key={'Status_'} customText={(row: DataRow) => {
                let statu = row.getNumber('Status_');
                let statuText = '';
                switch (statu) {
                    case 0:
                        statuText = '0.未启用';
                        break;
                    case 1:
                        statuText = '1.待安装';
                        break;
                    case 2:
                        statuText = '2.已启用';
                        break;
                    case 4:
                        statuText = '4.停止使用';
                        break;
                    default:
                        break;
                }
                return <span>{statuText}</span>
            }}></Column>)
        }
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                    <DBEdit dataName='载入笔数' dataField='MaxRecord_'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet}>
                    <Column name='帐套代码' code='CorpNo_' width='15'></Column>
                    <Column name='帐套简称' code='ShortName_' width='40'></Column>
                    {columns}
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={(row: DataRow) => {
                        return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    async getOurInfo(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getOurInfo(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('CorpNo_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input2.value = row.getString('ShortName_');
        this.handleSelect();
    }
}
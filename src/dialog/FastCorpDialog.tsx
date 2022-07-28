import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import { showMsg } from "../tool/Summer";
import styles from "./StaffDialog.css";

type FastCorpTypeProps = {
    salesMode: string
} & Partial<BaseDialogPropsType>

type FastCorpTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class FastCorpDialog extends BaseDialog<FastCorpTypeProps, FastCorpTypeState> {
    constructor(props: FastCorpTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('SalesMode_', this.props.salesMode);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            width: '40rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择代收企业');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getFastCorp();
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
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column name='代收企业' code='Code_' width='25'></Column>
                    <Column name='代收简称' code='ShortName_' width='25'></Column>
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getFastCorp(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DitengApi.getFastCorp(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if(input2) input2.value = row.getString('ShortName_');
        this.handleSelect();
    }
}
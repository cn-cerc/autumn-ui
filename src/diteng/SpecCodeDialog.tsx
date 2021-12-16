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
import { ColumnIt } from "../rcc/ColumnIt";

type SpecCodeTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class SpecCodeDialog extends BaseDialog<BaseDialogPropsType, SpecCodeTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.setTitle('请选择规格');
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn: new DataRow(),
            width: '45rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getPartSpec();
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
                    <DBEdit dataName='规格类码' dataField='Code_'></DBEdit>
                    <DBEdit dataName='规格名称' dataField='Name_'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet}>
                    <ColumnIt width='10'/>
                    <Column name='规格类码' code='Code_' width='20'></Column>
                    <Column name='规格名称' code='Name_' width='25'></Column>
                    <Column name='长度' code='CodeLen_' width='10'></Column>
                    <Column name='选择' code='opera' width='10' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getPartSpec(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getPartSpec(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input2.value = row.getString('Name_');
        let input3 = document.getElementById(inputIds[2]) as HTMLInputElement;
        input3.value = row.getString('CodeLen_');
        this.handleSelect();
    }
}
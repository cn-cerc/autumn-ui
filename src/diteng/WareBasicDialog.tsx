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

type WareBasicTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class WareBasicDialog extends BaseDialog<BaseDialogPropsType, WareBasicTypeState> {
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
        let dataSet = await this.getSubordinate();
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
                    <DBEdit dataName='规格' dataField='SearchText_'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} showOrder={true}>
                    <Column name='规格' code='WareSpec_' width='50'></Column>
                    <Column name='选择' code='opera' width='10' customText={
                        (row: DataRow) => {
                            return <td role='opera' align='center' onClick={this.handleClick.bind(this, row)}>选择</td>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getSubordinate(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getWareBasic(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('WareSpec_');
        this.handleSelect();
    }
}
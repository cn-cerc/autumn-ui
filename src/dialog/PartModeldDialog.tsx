import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import { showMsg } from "../tool/Summer";
import styles from "./StaffDialog.css";

type PartModeldTypeState = {
    dataSet: DataSet,
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class PartModeldDialog extends BaseDialog<BaseDialogPropsType, PartModeldTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn: new DataRow(),
            width: '40rem'
        }
        this.setTitle('请选择商品型号');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getPartModel();
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
                    <DBEdit dataName='查询条件' dataField='CheckText_'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column name='商品型号' code='Code_' width='25'></Column>
                    <Column name='型号名称' code='Name_' width='25'></Column>
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getPartModel(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DitengApi.getPartModel(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Code_');
        this.handleSelect();
    }
}
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import UIBlockCard, { UICardChildLine, UICardLine } from "../module/UIBlockCard";
import styles from "./DialogCommon.css";

type FSCusDialogTypeState = {
    dataIn: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

type FSCusDialogTypeProsp = {
    nameId: string,
    phoneId: string,
    personID: string
} & Partial<BaseDialogPropsType>

export default class FSCusDialog extends BaseDialog<FSCusDialogTypeProsp, FSCusDialogTypeState> {
    constructor(props: FSCusDialogTypeProsp) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        this.state = {
            ...this.state,
            width: '45rem',
            height: '30rem',
            dataIn,
            dataSet: new DataSet()
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataOut: DataSet = await DitengApi.getCusInfos(this.state.dataIn);
        let ds = new DataSet();
        dataOut.first();
        while (dataOut.fetch()) {
            if (dataOut.getBoolean("CorpNo_")) {
                ds.append().copyRecord(dataOut.current);
            }
        }
        this.setLoad(false);
        this.setState({
            dataSet: ds,
        })
    }

    content(): JSX.Element {
        return <div role='content' className={styles.main}>
            <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                <DBEdit dataRow={this.state.dataIn} dataField='SearchText_' dataName='查询条件' placeholder='请输入查询条件' autoFocus />
                <DBEdit dataRow={this.state.dataIn} dataField='MaxRecord_' dataName='载入笔数' placeholder='请输载入笔数' />
            </SearchPanel>
            {this.getTable()}
        </div>
    }

    getTable() {
        if (this.isPhone) {
            return <UIBlockCard dataSet={this.state.dataSet}>
                <UICardLine dataField='Name_' dataName='姓名' width={10}></UICardLine>
                <UICardLine dataField='Mobile_' dataName='手机号' width={20}></UICardLine>
                <UICardLine dataField='Opear_' dataName='操作' width={10} customText={(row: DataRow) => {
                    return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                }}></UICardLine>
                <UICardChildLine>
                    <UICardLine dataField='Name_' dataName='姓名' width={10}></UICardLine>
                </UICardChildLine>
            </UIBlockCard>
        } else {
            return <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                <ColumnIt width='15'></ColumnIt>
                <Column code='Name_' width='50' name='收货人'></Column>
                <Column code='Mobile_' width='50' name='手机号'></Column>
                <Column code='Opear_' width='30' name='操作' textAlign='center' customText={(row: DataRow) => {
                    return <span role='auiOpera'>选择</span>
                }}></Column>
            </DBGrid>
        }
    }

    handleClick(row: DataRow) {
        let nameInput = document.getElementById(this.props.nameId) as HTMLInputElement;
        nameInput.value = row.getString('Name_');
        if (this.props.phoneId) {
            let phoneInput = document.getElementById(this.props.phoneId) as HTMLInputElement;
            phoneInput.value = row.getString('Mobile_');
        }
        if (this.props.personID)
            $("#" + this.props.personID).val(row.getString('Contact_'))
        this.handleClose();
    }

}

import { BaseDialog, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBCheckbox, DBEdit, DBGrid } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import DialogApi from "./DialogApi";
import styles from "./StaffDialog.css";

type SelectLotNoTypeProps = {
    type: boolean,
    partCode: string,
    num: number,
    tbNo: string,
    tbDate: string,
    lotNo?: string
} & Partial<BaseDialogStateType>

type SeletLotNoTypeState = {
    dataSet: DataSet,
    dataRow: DataRow
} & Partial<BaseDialogStateType>

export default class SelectLotNoDialog extends BaseDialog<SelectLotNoTypeProps, SeletLotNoTypeState> {
    constructor(props: SelectLotNoTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue("Type_", this.props.type);
        dataRow.setValue("PartCode_", this.props.partCode);
        dataRow.setValue("Num_", this.props.num);
        dataRow.setValue("TBNo_", this.props.tbNo);
        if (this.props.lotNo)
            dataRow.setValue("LotNo", this.props.lotNo);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataRow,
            width: '55rem',
            height: '30rem'
        }
        this.setTitle('请选择批号');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getAvailabelLotNo(this.state.dataRow);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content(): JSX.Element {
        return (
            <div role="content" className={styles.main}>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false} onChanged={this.onRowChanged.bind(this)}>
                    <ColumnIt width="15"></ColumnIt>
                    <Column width="20" code="IsChecked" name="选择">
                        <DBCheckbox dataField="IsChecked" isUseChangedEvent={false}></DBCheckbox>
                    </Column>
                    <Column code="LotNo_" name="批号" width="40"></Column>
                    <Column code="TBDate_" name="入库日期" width="40"></Column>
                    <Column code="SrcNo_" name="单号" width="40"></Column>
                    <Column code="Num_" name="数量" width="20"></Column>
                    <Column code="RemainNum_" name="剩余数量" width="20"></Column>
                    <Column code="SelectNum" name="本次选择" width="40" textAlign="center">
                        <DBEdit dataField='SelectNum'></DBEdit>
                    </Column>
                </DBGrid>
                <button onClick={this.saveClick.bind(this)} className={styles.footerBtn}>保存</button>
            </div>
        )
    }

    onRowChanged(row: DataRow, field: string, oldValue: string) {
        this.setState({ ...this.state });
    }

    handleClick(row: DataRow, sender: any) {
        if (sender.target.closest('td').getAttribute('data-field') != 'SelectNum') {
            row.setValue('IsChecked', !row.getBoolean('IsChecked'));
            this.setState(this.state);
        }
    }

    async saveClick() {
        let dataSet = new DataSet();
        dataSet.head.setValue("TBNo_", this.props.tbNo);
        dataSet.head.setValue("TBDate_", this.props.tbDate);
        dataSet.head.setValue("PartCode_", this.props.partCode);
        if (this.props.lotNo)
            dataSet.head.setValue('LotNo_', this.props.lotNo);
        dataSet.appendDataSet(this.state.dataSet);
        let num = 0;
        dataSet.first();
        while (dataSet.fetch()) {
            if (!dataSet.getBoolean('IsChecked'))
                dataSet.delete();
            else {
                if (dataSet.getDouble("SelectNum") > dataSet.getDouble("Num_")) {
                    showMsg("本次选择数量不允许大于批号数量！");
                    return;
                }
                num += dataSet.getDouble("SelectNum");
            }
        }
        if (num > this.props.num) {
            showMsg("选择数量不允许大于单据数量！");
            return;
        }
        if (!dataSet.records.length) {
            showMsg("请选择批号");
            return;
        }
        let dataOut = await DialogApi.saveLotNo(dataSet);
        if (!dataOut.state)
            showMsg(dataOut.message)
        else {
            showMsg("保存成功！");
            if (this.props.tbNo.substring(0, 2) == 'BC')
                location.reload();
            else
                this.handleClose();
        }
    }
}
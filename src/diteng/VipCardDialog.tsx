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
import DBDrop from "../rcc/DBDrop";
import { ColumnIt } from "../rcc/ColumnIt";

type VipCardTypeProps = {
    cusCode: string,
    status: number,
    inputId: string,
} & Partial<BaseDialogStateType>

type VipCardTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    options: Map<string, number>
} & Partial<BaseDialogStateType>

export default class VipCardDialog extends BaseDialog<VipCardTypeProps, VipCardTypeState> {
    constructor(props: VipCardTypeProps) {
        super(props);
        let options = new Map();
        options.set('全部', -1);
        options.set('未使用', 0);
        options.set('已使用', 1);
        options.set('已停用', 2);
        let dataIn = new DataRow();
        dataIn.setValue('Status_', this.props.status);
        dataIn.setValue('MaxRecord_', 100);
        if (this.props.cusCode)
            dataIn.setValue('CusCode_', this.props.cusCode);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            options,
            width: '50rem',
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getVipCardInfo();
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
                    <DBDrop dataName='使用状态' dataField='Status_' options={this.state.options}></DBDrop>
                    <DBEdit dataName='载入笔数' dataField='MaxRecord_'></DBEdit>
                </SearchPanel>
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                    <Column name='卡号' code='Code_' width='10'></Column>
                    <Column name='名称' code='Name_' width='10'></Column>
                    <Column name='手机号码' code='Phone_' width='15'></Column>
                </DBGrid>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet}>
                    <ColumnIt />
                    <Column name='会员卡号' code='Code_' width='10'></Column>
                    <Column name='会员名称' code='Name_' width='10'></Column>
                    <Column name='手机号码' code='Phone_' width='15'></Column>
                    <Column name='打折信息' code='DisAcountType_' width='10' customText={(row: DataRow) => {
                        let disAcountTypeName = '';
                        let disAcountType = row.getValue('DisAcountType_');
                        switch (disAcountType) {
                            case 0:
                                disAcountTypeName = "积分优惠";
                                break;
                            case 1:
                                disAcountTypeName = "打折优惠";
                                break;
                            default:
                                disAcountTypeName = "" + disAcountType;
                                break;
                        }
                        return <span>{disAcountTypeName}</span>
                    }}></Column>
                    <Column name='会员等级' code='Level_' width='10' customText={(row: DataRow) => {
                        let levelName;
                        let level = row.getValue('Level_');
                        switch (level) {
                            case 0:
                                levelName = "普通卡";
                                break;
                            case 1:
                                levelName = "银卡";
                                break;
                            case 2:
                                levelName = "金卡";
                                break;
                            case 3:
                                levelName = "钻石卡";
                                break;
                            default:
                                levelName = "" + level;
                                break;
                        }
                        return <span>{levelName}</span>
                    }}></Column>
                    <Column name='操作' code='opera' width='8' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            )
        }
    }

    async getVipCardInfo(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getVipCardInfo(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input1.value = row.getValue('Name_');
        this.handleSelect();
    }
}
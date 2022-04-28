import { SClient, DataRow, SearchPanel, DBEdit, DBGrid, Column, DataSet, MenuItem, OperatePanel, ToolPanel } from "autumn-ui";
import { ToolItem } from "autumn-ui/src/rcc/ToolPanel";
import React from "react";
import Datetime from "../tool/Datetime";
import Utils from "../tool/Utils";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";

type MoneyRateTypeState = {
    client: SClient,
    dataIn: DataRow,
    message: string
} & Partial<CustomFormStateType>

export default class FrmMoneyDecimalPoint extends CustomForm<CustomFormPropsType, MoneyRateTypeState> {
    constructor(props: CustomFormPropsType) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', '100');
        let client = new SClient(this.props);
        client.setService('MoneyUnit');
        this.state = {
            client,
            dataIn,
            message: ''
        }
        this.handleSearch();
    }
    get pageTitle(): string {
        return '币别代码维护'
    }
    content(): JSX.Element {
        return (
            <React.Fragment>
                <MenuItem code='acc' name='财务总帐' />
                <ToolPanel>
                    <ToolItem title='操作提示'>
                        <div>（这里是相关操作） </div>
                    </ToolItem>
                </ToolPanel>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSearch.bind(this)}>
                    <DBEdit dataField='Code_' dataName='币别代码'></DBEdit>
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.client}>
                    <Column code='Code_' name='币别代码' width='65'>
                        <DBEdit dataField='Code_'></DBEdit>
                    </Column>
                    <Column code='Name_' name='币别名称' width='75'>
                        <DBEdit dataField='Name_'></DBEdit>
                    </Column>
                    <Column code='Rate_' name='固定汇率' width='65'>
                        <DBEdit dataField='Rate_'></DBEdit>
                    </Column>
                    <Column code='Decimal_' name='小数点位数' width='65'>
                        <DBEdit dataField='Decimal_'></DBEdit>
                    </Column>
                    <Column code='LocalDefault_' name='本位币否' width='65' textAlign='center' customText={(row: DataRow) => {
                        return <span style={{ 'width': '100%', 'height': '100%', 'position': 'absolute', 'left': '0', 'top': '0', 'lineHeight': '2.45rem' }} onClick={this.handleClick.bind(this, row)}>{row.getBoolean('LocalDefault_') ? 'Yes' : ''}</span>
                    }}></Column>
                    <Column code='Remark_' name='备注信息' width='145'>
                        <DBEdit dataField='Remark_'></DBEdit>
                    </Column>
                    <Column code='UpdateUser_' name='更新人员' width='65'></Column>
                    <Column code='UpdateDate_' name='更新日期' width='145'></Column>
                    <Column code='AppUser_' name='建档人员' width='65'></Column>
                    <Column code='AppDate_' name='建档日期' width='145'></Column>
                    <Column code='opera' name='操作' width='65' textAlign='center' customText={
                        ((dataRow: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleDelete.bind(this, dataRow)}>删除</span>
                        })
                    }></Column>
                </DBGrid>
                <OperatePanel>
                    <button onClick={this.handleAppend.bind(this)}>新增</button>
                    <button onClick={this.handleSave.bind(this)}>保存</button>
                </OperatePanel>
            </React.Fragment>
        )
    }
    async handleSearch() {
        this.showLoadMessage('系统正在查询中...');
        this.state.client.clear();
        this.state.client.head.copyValues(this.state.dataIn);
        await this.state.client.open();
        this.setLoad(false);
        this.state.client.first();
        if (this.state.client.state <= 0) {
            Toast.error(this.state.client.message)
            return;
        }
        this.setState({ ...this.state });
    }
    handleAppend() {
        let dataSet: DataSet = this.state.client.append();
        dataSet.setValue('Code_', '');
        dataSet.setValue('Name_', '<新的币种>');
        dataSet.setValue('Rate_', '1');
        dataSet.setValue('Decimal_', '2');
        dataSet.setValue('LocalDefault_', false);
        dataSet.setValue('Remark_', '');
        dataSet.setValue('UpdateUser_', 'admin');
        dataSet.setValue('UpdateDate_', new Datetime().toString());
        dataSet.setValue('AppUser_', 'admin');
        dataSet.setValue('AppDate_', new Datetime().toString());
        dataSet.setValue('UpdateKey_', Utils.guid());
        this.setState(this.state);
    }
    handleSave() {
        let bool = true;
        this.state.client.first();
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Code_')) {
                bool = false;
                break;
            }
        }
        if (!bool) {
            Toast.error('币别代码不能为空')
            return;
        }
        this.state.client.head.copyValues(this.state.dataIn);
        this.state.client.save();
        if (this.state.client.state <= 0)
            Toast.error(this.state.client.message);
        else 
            Toast.success('保存成功');
        this.setState({ ...this.state });
    }
    handleDelete(row: DataRow) {
        let recNo = this.state.client.records.indexOf(row);
        if (recNo > -1) {
            this.state.client.setRecNo(recNo + 1);
            this.state.client.delete();
            this.state.client.save();
            if (this.state.client.state <= 0) {
                Toast.error(this.state.client.message);
                return;
            }
            this.setState({ ...this.state });
        }
    }
    handleClick(row: DataRow) {
        row.dataSet.setRecNo(row.dataSet.locationRow(row));
        row.dataSet.edit();
        row.setValue('LocalDefault_', !row.getBoolean('LocalDefault_'));
        this.setState(this.state);
    }
}
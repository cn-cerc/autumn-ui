import React from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBDrop, DBEdit, DBGrid, Column, StatusBar, SearchPanelOnExecute, OnRowChangedEvent } from "autumn-ui";
import DBDatePicker from "../block/DBDatePicker";
import Toast from "../tool/Toast";
import Utils from "../tool/Utils";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";
import MainMenu from "./MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchDateBookA extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>([['所有币别', '']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABB.searchDateBookB');
        let dataIn = new DataRow();
        dataIn.setValue('Final_', 1);
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        this.state = { client, dataIn, message: '' };
        this.getTypeList();
    }

    get pageTitle(): string {
        return '日记帐查询(管理)';
    }

    content(): JSX.Element {
        return (
            <React.Fragment>
                <MenuItem code='acc' name='财务总帐' />
                <ToolPanel>
                    <MainMenu />
                    <ToolItem title='操作提示'>
                        <div>（这里是操作提示）</div>
                        <div>（这里是操作提示）</div>
                        <div>（这里是操作提示）</div>
                    </ToolItem>
                    <ToolItem title='相关操作'>
                        <div>（这里是相关操作） </div>
                    </ToolItem>
                </ToolPanel>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.btnSearch}>
                    <DBDrop dataField='Currency_' dataName='币别' options={this._typeList}></DBDrop>
                    <DBDatePicker dataField='TBDate__from' dataName='凭证日期'></DBDatePicker>
                    <DBDatePicker dataField='TBDate__to' dataName='至'></DBDatePicker>
                    <DBEdit dataField='ManageNo__from' dataName='管理编号' onChanged={this.accCodeFormChange.bind(this)} />
                    <DBEdit dataField='ManageNo__to' dataName='至' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='TBDate_' name='凭证日期' width='4' >
                    </Column>
                    <Column code='TBNo_' name='凭证编号' width='5' >
                    </Column>
                    <Column code='Desp_' name='摘要' width='13' >
                    </Column>
                    <Column code='AccCode_' name='科目代码' width='4' >
                    </Column>
                    <Column code='AccName_' name='科目名称' width='10' >
                    </Column>
                    <Column code='Currency_' name='币别' width='3' >
                    </Column>
                    <Column code='CurrAmount_' name='原币金额' width='3' >
                    </Column>
                    <Column code='ExRate_' name='汇率' width='3' >
                    </Column>
                    <Column code='DrAmount_' name='借方金额' width='3' >
                    </Column>
                    <Column code='CrAmount_' name='贷方金额' width='3' >
                    </Column>
                    <Column code='ManageNo_' name='管理编号' width='5' >
                    </Column>
                </DBGrid>
                <StatusBar>
                </StatusBar>
            </React.Fragment>
        )
    }

    async getTypeList() {
        let typeClient = new SClient(this.props);
        typeClient.setService('MoneyUnit');
        await typeClient.open();
        typeClient.forEach((row: DataRow) => {
            this._typeList.set(row.getString('Code_'), row.getString('Code_'));
        })
    }

    accCodeFormChange() {
        if (!this.state.dataIn.getBoolean('ManageNo__to')) {
            this.state.dataIn.setValue('ManageNo__to', this.state.dataIn.getValue('ManageNo__from'));
            this.setState(this.state)
        }
    }

    btnSearch: SearchPanelOnExecute = async (row: DataRow) => {
        this.state.client.clear()
        this.state.client.head.copyValues(row)
        await this.state.client.open();
        if (this.state.client.state <= 0) {
            console.log(this.state.client.message);
            return;
        } else {
            Toast.success('查询成功');
        }
        this.setState(this.state);
    }

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }
}
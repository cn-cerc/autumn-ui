import React from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../../diteng/CustomForm";
import MainMenu from "../../diteng/MainMenu";
import DBDatePicker from "../../rcc/DBDatePicker";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
import StatusBar from "../../rcc/StatusBar";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchDateBookC extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>([['所有币别', '']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABB.searchDateBookC');
        let dataIn = new DataRow();
        dataIn.setValue('Final_', 1);
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        this.state = { client, dataIn, message: '' };
        this.getTypeList();
    }

    get pageTitle(): string {
        return '日记帐查询(科目)';
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
                    <DBEdit dataField='AccCode__from' dataName='科目代码' onChanged={this.accCodeFormChange.bind(this)} />
                    <DBEdit dataField='AccCode__to' dataName='至' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='Currency_' name='币别' width='3' >
                    </Column>
                    <Column code='Acc_' name='科目代码' width='3' >
                    </Column>
                    <Column code='AccName_' name='科目名称' width='15' >
                    </Column>
                    <Column code='DrAmount_' name='借方金额' width='3' >
                    </Column>
                    <Column code='DrSum_' name='借方笔数' width='3' >
                    </Column>
                    <Column code='CrAmount_' name='贷方金额' width='3' >
                    </Column>
                    <Column code='CrSum_' name='贷方笔数' width='3' >
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
        if (!this.state.dataIn.getBoolean('AccCode__to')) {
            this.state.dataIn.setValue('AccCode__to', this.state.dataIn.getValue('AccCode__from'));
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
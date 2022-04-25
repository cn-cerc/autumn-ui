import React from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../../diteng/CustomForm";
import MainMenu from "../../diteng/MainMenu";
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

export default class SchDateBookB extends CustomForm<CustomFormPropsType, stateType> {
    private _currencyList: Map<string, string> = new Map<string, string>([['所有币别', '']]);
    private _typeList: Map<string, string> = new Map<string, string>([['所有类别', '']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABB.searchDateBookB');
        let dataIn = new DataRow();
        dataIn.setValue('Final_', 1);
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        this.state = { client, dataIn, message: '' };
        this.getCurrencyList();
        this.getTypeList();
    }

    get pageTitle(): string {
        return '日记帐查询(日期)';
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
                    <DBDrop dataField='Currency_' dataName='币别' options={this._currencyList}></DBDrop>
                    <DBDrop dataField='Type_' dataName='对象类别' options={this._typeList} onChanged={this.handleSelect.bind(this)} />
                    <DBEdit dataField='ObjCode_' dataName='对象代码'></DBEdit>
                    <DBEdit dataField='TBDate__from' dataName='凭证日期' />
                    <DBEdit dataField='TBDate__to' dataName='至' />
                    <DBEdit dataField='AccCode__from' dataName='科目代码' onChanged={this.accCodeFormChange.bind(this)} />
                    <DBEdit dataField='AccCode__to' dataName='至' />
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
                    <Column code='Currency_' name='币别' width='3' />
                    <Column code='CurrAmount_' name='原币金额' width='3' />
                    <Column code='ExRate_' name='汇率' width='3' />
                    <Column code='DrAmount_' name='借方金额' width='3' />
                    <Column code='CrAmount_' name='贷方金额' width='3' />
                    <Column code='AppUser_' name='建档人员' width='5' />
                </DBGrid>
                <StatusBar>
                </StatusBar>
            </React.Fragment>
        )
    }

    handleSelect() {
        this.state.dataIn.setValue(`ObjName_`, `ObjCode${this.state.dataIn.getValue('Type_')}_`);
    }

    async getCurrencyList() {
        let currencyClient = new SClient(this.props);
        currencyClient.setService('MoneyUnit');
        await currencyClient.open();
        currencyClient.forEach((row: DataRow) => {
            this._currencyList.set(row.getString('Code_'), row.getString('Code_'));
        })
    }

    async getTypeList() {
        let typeClient = new SClient(this.props);
        typeClient.setService('AC_ObjT');
        await typeClient.open();
        typeClient.forEach((row: DataRow) => {
            this._typeList.set((row.getInt('Type_') + '.' + row.getString('Name_')), row.getInt('Type_') + '');
        })
        this.btnSearch(this.state.dataIn)
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
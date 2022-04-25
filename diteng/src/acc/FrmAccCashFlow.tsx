import React, { MouseEventHandler } from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import DBDatePicker from "../../rcc/DBDatePicker";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../CustomForm";
import MainMenu from "../MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmAccCashFlow extends CustomForm<CustomFormPropsType, stateType> {
    private _currencyList: Map<string, string> = new Map<string, string>([['所有币别', '']]);
    private _typeList: Map<string, string> = new Map<string, string>([['所有类别', '']]);
    private _nameList: Map<string, string> = new Map();
    private _nameList2: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABB.searchAccCashFlow');
        let dataIn = new DataRow();
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        dataIn.setValue('MaxRecord_', 100);
        this.state = { client, dataIn, message: '' };
        this.getCurrencyList();
        this.getTypeList();
        this.getNameList();
        this.getName2List();
    }

    get pageTitle(): string {
        return '凭证现金流量项目维护';
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
                    <DBEdit dataField='TBNo_' dataName='凭证编号' />
                    <DBDatePicker dataField='TBDate__from' dataName='凭证日期'></DBDatePicker>
                    <DBDatePicker dataField='TBDate__to' dataName='至'></DBDatePicker>
                    <DBEdit dataField='AccCode_' dataName='会计科目' />
                    <DBEdit dataField='StatementCode_' dataName='项目代码' />
                    <DBEdit dataField='Desp_' dataName='摘要' />
                    <DBEdit dataField='DrAmount_' dataName='借方金额' />
                    <DBEdit dataField='CrAmount_' dataName='贷方金额' />
                    <DBDrop dataField='Currency_' dataName='币别' options={this._currencyList}></DBDrop>
                    <DBDrop dataField='Type_' dataName='对象类别' options={this._typeList} onChanged={this.handleSelect.bind(this)} />
                    <DBEdit dataField='ObjCode_' dataName='对象代码'></DBEdit>
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='CashCode_' name='项目代码' width='5' >
                        <DBEdit dataField="CashCode_"></DBEdit>
                    </Column>
                    <Column code='CashCodeName_' name='项目名称' width='15' customText={(row: DataRow) => {
                        return <span>{this._nameList2.get(row.getString('CashCode_'))}</span>
                    }}>
                    </Column>
                    <Column code='TBDate_' name='凭证日期' width='10' />
                    <Column code='TBNo_' name='凭证编号' width='10' />
                    <Column code='It_' name='序' width='2' />
                    <Column code='Desp_' name='摘要' width='10' />
                    <Column code='AccCode_' name='科目代码' width='5' />
                    <Column code='Name_' name='科目名称' width='10' />
                    <Column code='CurrAmount_' name='外币金额' width='5' />
                    <Column code='Desp_' name='摘要' width='10' />
                    <Column code='Currency_' name='币别' width='3' />
                    <Column code='ExRate_' name='汇率' width='10' />
                    <Column code='Dr_' name='借/贷' width='3' customText={(row: DataRow) => {
                        return row.getString('DrCr_') == 'true' ? <span>1.借</span> : <span>0.贷</span>
                    }}>
                    </Column>
                    <Column code='ExRate_' name='汇率' width='3' />
                    <Column code='DrAmount_' name='借方金额' width='3' />
                    <Column code='CrAmount_' name='贷方金额' width='3' />
                    <Column code='TotalC_' name='冲帐金额' width='3' />
                    <Column code='ObjCode0_' name='部门代码' width='5' />
                    <Column code='ObjName0_' name='部门名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode0_'))}</span>
                    }} />
                    <Column code='ObjCode1_' name='事业部代码' width='5' />
                    <Column code='ObjName1_' name='事业部名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode1_'))}</span>
                    }} />
                    <Column code='ObjCode2_' name='银行代码' width='5' />
                    <Column code='ObjName2_' name='银行名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode2_'))}</span>
                    }} />
                    <Column code='ObjCode3_' name='客户代码' width='5' />
                    <Column code='ObjName3_' name='客户名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode3_'))}</span>
                    }} />
                    <Column code='ObjCode4_' name='厂商代码' width='5' />
                    <Column code='ObjName4_' name='厂商名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode4_'))}</span>
                    }} />
                    <Column code='ObjCode5_' name='人员代码' width='5' />
                    <Column code='ObjName5_' name='人员名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode5_'))}</span>
                    }} />
                    <Column code='ObjCode6_' name='专项代码' width='5' />
                    <Column code='ObjName6_' name='专项名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode6_'))}</span>
                    }} />
                    <Column code='ObjCode7_' name='商品分类' width='5' />
                    <Column code='ObjName7_' name='分类名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode7_'))}</span>
                    }} />
                    <Column code='ObjCode8_' name='自定义项1' width='5' />
                    <Column code='ObjName8_' name='自定义项名称1' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode8_'))}</span>
                    }} />
                    <Column code='ObjCode9_' name='自定义项2' width='5' />
                    <Column code='ObjName9_' name='自定义项名称2' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode9_'))}</span>
                    }} />
                </DBGrid>
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

    async getNameList() {
        let client = new SClient(this.props);
        client.setService('AC_Obj');
        await client.open();
        client.first();
        while (client.fetch()) {
            this._nameList.set(client.getString('Code_'), client.getString('Name_'));
        }
        this.btnSearch(this.state.dataIn)
    }

    async getName2List() {
        let client = new SClient(this.props);
        client.setService('AC_CashFlow');
        await client.open();
        client.first();
        while (client.fetch()) {
            this._nameList2.set(client.getString('Code_'), client.getString('Name_'));
        }
        this.btnSearch(this.state.dataIn)
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

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.save();
        if (this.state.client.state <= 0) {
            console.log(this.state.client.message);
            return;
        } else {
            Toast.success('保存成功');
        }
        this.setState({ ...this.state });
    }

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }
}
import { data } from "jquery";
import React from "react";
import DataRow from "../../db/DataRow";
import Datetime from "../../db/Datetime";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../../diteng/CustomForm";
import MainMenu from "../../diteng/MainMenu";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAccBookSub extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>([['所有类别', '']]);
    private _nameList: Map<string, string> = new Map();
    private _nameList2: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_Amount.searchAccBookSub');
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        dataIn.setValue('YearMonth_', new Datetime().yearMonth);
        this.state = { client, dataIn, message: '' };
        this.getTypeList();
        this.getNameList();
        this.getNameList2();
    }

    get pageTitle(): string {
        return '科目明细SUB帐册';
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
                    <DBEdit dataField='AccCode_' dataName='科目代码' />
                    <DBEdit dataField='YearMonth_' dataName='会计年月' />
                    <DBDrop dataField='Type_' dataName='对象类别' options={this._typeList} onChanged={this.handleSelect.bind(this)} />
                    <DBEdit dataField='ObjCode_' dataName='对象代码'></DBEdit>
                    <DBEdit dataField='1' dataName='仅显示底阶科目(勾选)' />
                    <DBEdit dataField='2' dataName='仅显示记账科目(勾选)' />
                    <DBEdit dataField='3' dataName='仅显示一阶科目(勾选)' />
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='YearMonth_' name='会计年月' width='10' />
                    <Column code='AccCode_' name='科目代码' width='10' />
                    <Column code='AccName_' name='科目名称' width='15' customText={(row: DataRow) => {
                        return <span>{this._nameList2.get(row.getString('AccCode_'))}</span>
                    }}/>
                    <Column code='OriInit_' name='期初原币余额' width='3' />
                    <Column code='InitAmount_' name='期初母币余额' width='3' />
                    <Column code='OriCurDr_' name='借方原币金额' width='3' />
                    <Column code='OriCurCr_' name='贷方原币金额' width='3' />
                    <Column code='DrAmount_' name='母币借方金额' width='3' />
                    <Column code='CrAmount_' name='母币贷方金额' width='3' />
                    <Column code='Amount_' name='母币余额' width='3' />
                    <Column code='ObjInfo_' name='辅助核算项目' width='10' />
                    <Column code='Amount_' name='母币余额' width='3' />
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
        let Nameclient = new SClient(this.props);
        Nameclient.setService('AC_Obj');
        await Nameclient.open();
        Nameclient.first();
        while (Nameclient.fetch()) {
            this._nameList.set(Nameclient.getString('Code_'), Nameclient.getString('Name_'));
        }
        this.btnSearch(this.state.dataIn)
    }

    async getNameList2() {
        let Name2client = new SClient(this.props);
        Name2client.setService('AccSubject');
        await Name2client.open();
        Name2client.first();
        while (Name2client.fetch()) {
            this._nameList2.set(Name2client.getString('AccCode_'), Name2client.getString('Name_'));
        }
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
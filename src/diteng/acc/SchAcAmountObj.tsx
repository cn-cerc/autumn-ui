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
import SearchPanel from "../../rcc/SearchPanel";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAcAmountObj extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>();
    private _nameList: Map<string, string> = new Map();
    private _nameList2: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_Amount.searchAcAmountObj');
        let dataIn = new DataRow();
        dataIn.setValue('YearMonth_', new Datetime().yearMonth);
        this.state = { client, dataIn, message: '' };
        this.getTypeList();
        this.getNameList();
        this.getNameList2();
    }

    get pageTitle(): string {
        return '辅助核算科目汇总表';
    }

    content(): JSX.Element {
        return (
            <React.Fragment>
                <MenuItem code='acc' name='财务总帐' />
                console.log(this.state.dataIn);
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
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.btnSearch.bind(this)}>
                    <DBEdit dataField='YearMonth_' dataName='会计年月' />
                    <DBEdit dataField='AccCode_' dataName='科目代码' />
                    <DBDrop dataField='ObjName_' dataName='核算项目' options={this._typeList} />
                    <DBEdit dataField='ObjCode_' dataName='对象代码'></DBEdit>
                    <DBEdit dataField='3' dataName='仅统计科目借方属性发生额(勾选)' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='YearMonth_' name='会计年月' width='10' />
                    <Column code='AccCode_' name='科目代码' width='10' />
                    <Column code='AccName_' name='科目名称' width='15' customText={(row: DataRow) => {
                        return <span>{this._nameList2.get(row.getString('AccCode_'))}</span>
                    }} />
                    <Column code='ObjCode_' name='核算项目' width='5' />
                    <Column code='ObjName_' name='部门名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('ObjCode_'))}</span>
                    }} />
                    <Column code='DrCr_' name='借/贷' width='3' />
                    <Column code='Currency_' name='币别' width='3' />
                    <Column code='OriInit_' name='期初原币余额' width='3' />
                    <Column code='InitAmount_' name='期初母币余额' width='3' />
                    <Column code='OriCurDr_' name='借方原币金额' width='3' />
                    <Column code='OriCurCr_' name='贷方原币金额' width='3' />
                    <Column code='DrAmount_' name='母币借方金额' width='3' />
                    <Column code='CrAmount_' name='母币贷方金额' width='3' />
                    <Column code='OriAmount_' name='期末原币余额' width='3' />
                    <Column code='Amount_' name='期末母币余额' width='3' />
                </DBGrid>
            </React.Fragment>
        )
    }

    handleSelect() {
        this.state.dataIn.setValue(`ObjName_`, `ObjCode${this.state.dataIn.getValue('ObjName_')}_`);
    }

    async getTypeList() {
        let typeClient = new SClient(this.props);
        typeClient.first();
        typeClient.setService('AC_ObjT');
        await typeClient.open();
        while (typeClient.fetch()) {
            let val = `ObjCode${typeClient.getString('Type_')}_`;
            if (typeClient.recNo == 1)
                this.state.dataIn.setValue(`ObjName_`, val);
            this._typeList.set((typeClient.getDouble('Type_') + '.' + typeClient.getString('Name_')), val);
        }
        this.btnSearch()
    }

    async getNameList() {
        let Nameclient = new SClient(this.props);
        Nameclient.setService('AC_Obj');
        await Nameclient.open();
        Nameclient.first();
        while (Nameclient.fetch()) {
            this._nameList.set(Nameclient.getString('Code_'), Nameclient.getString('Name_'));
        }
    }

    async getNameList2() {
        let Name2client = new SClient(this.props);
        Name2client.setService('AccSubject');
        await Name2client.open();
        Name2client.first();
        while (Name2client.fetch()) {
            this._nameList2.set(Name2client.getString('AccCode_'), Name2client.getString('Name_'));
        }
    }

    accCodeFormChange() {
        if (!this.state.dataIn.getBoolean('AccCode__to')) {
            this.state.dataIn.setValue('AccCode__to', this.state.dataIn.getValue('AccCode__from'));
            this.setState(this.state)
        }
    }

    async btnSearch() {
        this.state.client.clear()
        this.state.client.head.copyValues(this.state.dataIn);
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
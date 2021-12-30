import React from "react";
import DataRow from "../../db/DataRow";
import DataSet from "../../db/DataSet";
import Datetime from "../../db/Datetime";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import DBDatePicker from "../../rcc/DBDatePicker";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import OperatePanel from "../../rcc/OperatePanel";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../CustomForm";
import MoneyUnitDialog from "../MoneyUnitDialog";

type MoneyRateTypeState = {
    client: SClient,
    dataIn: DataRow,
    message: string
} & Partial<CustomFormStateType>

export default class FrmMoneyRate extends CustomForm<CustomFormPropsType, MoneyRateTypeState> {
    get pageTitle(): string {
        return '币别汇率维护';
    }

    private _typeList: Map<string, string> = new Map([['所有类别', ''], ['1.月结汇率', '1'], ['2.三旬汇率', '2'], ['3.浮动汇率', '3']]);
    private _typeList2: Map<string, string> = new Map([['1.月结汇率', '1'], ['2.三旬汇率', '2'], ['3.浮动汇率', '3']]);
    private _codeList: Map<string, string> = new Map();

    private _append: boolean = false;

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('Code_', '*');
        dataIn.setValue('StartDate_min', Utils.getMonthStartDay())
        dataIn.setValue('StartDate_max', Utils.getMonthEndDay())
        dataIn.setValue('MaxRecord', 100);
        client.setService('MoneyRate');
        this.state = {
            client,
            dataIn,
            message: ''
        }
    }

    componentDidMount(): void {
        this.initCodeList();
    }

    async initCodeList() {
        let client = new SClient(this.props);
        client.setService('MoneyUnit');
        client.head.setValue('Code_', '');
        await client.open();
        client.first();
        while (client.fetch()) {
            this._codeList.set(client.getString('Code_'), client.getString('Name_'));
        }
        this.handleSearch(this.state.client.head);
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
                    <DBDatePicker dataField='StartDate_min' dataName='开始时间'></DBDatePicker>
                    <DBDatePicker dataField='StartDate_max' dataName='结束时间'></DBDatePicker>
                    <DBEdit dataField='Rate_' dataName='币别换算率'></DBEdit>
                    <DBDrop dataField='RateType_' dataName='汇率类别' options={this._typeList}></DBDrop>
                    <DBEdit dataField='MaxRecord' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.client} key={this.state.client.updateKey} onChanged={this.handleChange.bind(this)}>
                    <Column name='代码' code='Code_' width='65'>
                        <DBEdit dataField='Code_' onFocus={this.chooseCode.bind(this)}>
                            <MoneyUnitDialog isChild={true} dataFields='Code_'></MoneyUnitDialog>
                        </DBEdit>
                    </Column>
                    <Column name='名称' code='Name_' width='75' customText={(row: DataRow) => {
                        return <span>{this._codeList.get(row.getString('Code_'))}</span>
                    }}></Column>
                    <Column name='币别换算率' code='Rate_' width='65'>
                        <DBEdit dataField='Rate_'></DBEdit>
                    </Column>
                    <Column name='汇率类别' code='RateType_' width='65'>
                        <DBDrop dataField='RateType_' options={this._typeList2}></DBDrop>
                    </Column>
                    <Column name='买入汇率' code='BuyType_' width='65'>
                        <DBEdit dataField='BuyType_'></DBEdit>
                    </Column>
                    <Column name='启动日期' code='StartDate_' width='65'></Column>
                    <Column name='备注' code='Remark_' width='145'>
                        <DBEdit dataField='Remark_'></DBEdit>
                    </Column>
                    <Column name='更新人员' code='UpdateUser_' width='65'></Column>
                    <Column name='更新日期' code='UpdateDate_' width='145'></Column>
                    <Column name='建档人员' code='AppUser_' width='65'></Column>
                    <Column name='建档日期' code='AppDate_' width='145'></Column>
                    <Column code='opera' name='操作' width='40' textAlign='center' customText={
                        ((dataRow: DataRow) => {
                            return <span role='opera' onClick={this.handleDelete.bind(this, dataRow)}>删除</span>
                        })
                    } />
                </DBGrid>
                <OperatePanel>
                    <button onClick={this.handleAppend.bind(this)}>新增</button>
                    <button onClick={this.handleSave.bind(this)}>保存</button>
                </OperatePanel>
            </React.Fragment>
        )
    }

    handleSearch: SearchPanelOnExecute = async (row: DataRow) => {
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
        if (this._append)
            return;
        let dataSet: DataSet = this.state.client.append();
        dataSet.setValue('Code_', '');
        dataSet.setValue('Rate_', '1');
        dataSet.setValue('RateType_', '1');
        dataSet.setValue('BuyType_', false);
        dataSet.setValue('StartDate_', Utils.getMonthStartDay());
        dataSet.setValue('Remark_', '');
        dataSet.setValue('UpdateUser_', 'admin');
        dataSet.setValue('UpdateDate_', new Datetime().toString());
        dataSet.setValue('AppUser_', 'admin');
        dataSet.setValue('AppDate_', new Datetime().toString());
        dataSet.setValue('UpdateKey_', Utils.guid());
        this._append = true;
        this.setState({ ...this.state });
    }

    chooseCode(sender: any) {
        sender.target.parentNode.querySelector('span').click();
    }

    handleChange() {
        this.setState(this.state);
    }

    async handleSave() {
        let bool = true;
        this.state.client.first();
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Code_'))
                bool = false;
        }
        if (!bool) {
            Toast.error('币别代码不能为空')
            return;
        }
        this.state.client.head.copyValues(this.state.dataIn);
        this.state.client.save();
        this._append = false;
        if (this.state.client.state <= 0)
            Toast.error(this.state.client.message);
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
}
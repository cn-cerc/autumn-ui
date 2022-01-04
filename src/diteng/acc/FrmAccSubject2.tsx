import React, { MouseEventHandler } from "react";
import DataRow from "../../db/DataRow";
import Datetime from "../../db/Datetime";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../../diteng/CustomForm";
import MainMenu from "../../diteng/MainMenu";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import OperatePanel from "../../rcc/OperatePanel";
import SearchPanel from "../../rcc/SearchPanel";
import StatusBar from "../../rcc/StatusBar";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";
import styles from "/sample/SchAccTran.css";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmAccSubject2 extends CustomForm<CustomFormPropsType, stateType> {

    private _currencyList: Map<string, string> = new Map<string, string>([['所有币别', '']]);
    private _isObj: Map<string, string> = new Map<string, string>([['0.不管控', '0'], ['1.管控', '1']]);
    private _nameList: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('IsObj_', '0');
        client.setService('AccSubject');
        this.state = { client, dataIn, message: '' };
        this.getCurrencyList();
        this.getNameList();
    }

    get pageTitle(): string {
        return '会计科目批次维护';
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
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.btnSearch.bind(this)}>
                    <DBEdit dataField='AccCode_' dataName='科目代码' />
                    <DBEdit dataField='DefDeptCode_' dataName='部门代码' />
                    <DBDrop dataField='DefCurrency_' dataName='币别' options={this._currencyList}></DBDrop>
                    <DBEdit dataField='Type_' dataName='科目类别' />
                    <DBDrop dataField='IsObj_' dataName='辅助项目' options={this._isObj}></DBDrop>
                    <DBEdit dataField='Disable_' dataName='仅显示有效科目' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='AccCode_' name='科目代码' width='10' >
                        <DBEdit dataField='AccCode_' />
                    </Column>
                    <Column code='ShortName_' name='科目简称(中文)' width='10' >
                        <DBEdit dataField='ShortName_' />
                    </Column>
                    <Column code='Name_' name='科目名称(中文)' width='10' >
                        <DBEdit dataField='Name_' />
                    </Column>
                    <Column code='ParentCode_' name='上级科目' width='10' >
                        <DBEdit dataField='ParentCode_' />
                    </Column>
                    <Column code='Level_' name='科目级次' width='10' >
                        <DBEdit dataField='Level_' />
                    </Column>
                    <Column code='Type_' name='大类' width='10' >
                        <DBEdit dataField='Type_' />
                    </Column>
                    <Column code='TypeName_' name='类别说明' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('Type_'))}</span>
                    }} />
                    <Column code='DrCr_' name='借方科目' width='10' >
                        <DBEdit dataField='DrCr_' />
                    </Column>
                    <Column code='ABIn_' name='底阶否' width='10' >
                        <DBEdit dataField='ABIn_' />
                    </Column>
                    <Column code='DefCurrency_' name='默认币别' width='10' >
                        <DBEdit dataField='DefCurrency_' />
                    </Column>
                    <Column code='DefDeptCode_' name='内设部门' width='10' >
                        <DBEdit dataField='DefDeptCode_' />
                    </Column>
                    <Column code='IsObj_' name='对象别管控' width='10' >
                        <DBEdit dataField='IsObj_' />
                    </Column>
                    <Column code='Disable_' name='作废否' width='10' >
                        <DBEdit dataField='Disable_' />
                    </Column>
                    <Column code='IsGroup_' name='纳入集团统计' width='10' >
                        <DBEdit dataField='IsGroup_' />
                    </Column>
                    <Column code='NameE_' name='科目名称(英文)' width='10' >
                        <DBEdit dataField='NameE_' />
                    </Column>
                    <Column code='DefAmount_' name='预设金额' width='10' >
                        <DBEdit dataField='DefAmount_' />
                    </Column>
                    <Column code='DefDesc_' name='预设摘要' width='10' >
                        <DBEdit dataField='DefDesc_' />
                    </Column>
                    <Column code='DepPlan_' name='部门预算' width='10' >
                        <DBEdit dataField='DepPlan_' />
                    </Column>
                    <Column code='LC_' name='立冲科目' width='10' >
                        <DBEdit dataField='LC_' />
                    </Column>
                    <Column code='FirstCode_' name='一级科目' width='10' >
                        <DBEdit dataField='FirstCode_' />
                    </Column>
                    <Column code='AppDesp_' name='科目使用范围' width='30' >
                        <DBEdit dataField='AppDesp_' />
                    </Column>
                    <Column code='opera' name='操作' textAlign='center' width='10' customText={
                        ((dataRow: DataRow) => {
                            return <span role='opera' onClick={this.deleteRow.bind(this, dataRow)}>删除</span>
                        })
                    } />
                </DBGrid>
                <OperatePanel>
                    <button className={styles.operaButton} onClick={this.btnAppend}>新增</button>
                    <button className={styles.operaButton} onClick={this.btnSave}>保存</button>
                </OperatePanel>
                <StatusBar>
                </StatusBar>
            </React.Fragment>
        )
    }

    async getCurrencyList() {
        let currencyClient = new SClient(this.props);
        currencyClient.setService('MoneyUnit');
        await currencyClient.open();
        currencyClient.forEach((row: DataRow) => {
            this._currencyList.set(row.getString('Code_'), row.getString('Code_'));
        })
        this.setState(this.state);
    }

    async getNameList() {
        let nameListClient = new SClient(this.props);
        nameListClient.setService('AC_SubjectType');
        await nameListClient.open();
        nameListClient.forEach((row: DataRow) => {
            this._nameList.set(row.getString('Code_'), row.getString('Name_'));
        })
        this.setState(this.state);
    }

    async btnSearch() {
        this.state.client.clear()
        console.log(this.state.dataIn)
        this.state.client.head.copyValues(this.state.dataIn)
        await this.state.client.open();
        if (this.state.client.state <= 0) {
            console.log(this.state.client.message);
            return;
        } else {
            Toast.success('查询成功');
        }
        this.setState(this.state);
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let row = this.state.client.append();
        row.setValue('AppUser_', 'admin');
        row.setValue('AppDate_', new Datetime().toString());
        row.setValue('UpdateUser_', 'admin');
        row.setValue('UpdateDate_', new Datetime().toString());
        row.setValue('UpdateKey_', Utils.guid());
        row.setValue('ABIn_', 'False');
        row.setValue('DepPlan_', 'False');
        row.setValue('Disable_', 'False');
        row.setValue('LC_', 'False');
        row.setValue('DrCr_', 'False');
        row.setValue('IsObj_', 'False');
        row.setValue('IsTranRate_', 'False');
        this.setState({ ...this.state });
    }

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.first();
        let text: string = '';
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Level_')) text = '阶次不能为空';
            else if (!this.state.client.getString('AccCode_')) text = '会计科目不能为空';
            else if (!this.state.client.getString('Name_')) text = '名称不能为空';
            else if (!this.state.client.getString('ShortName_')) text = '简称不能为空';
            else if (!this.state.client.getString('ABIn_')) text = '底阶否不能为空';
            else if (!this.state.client.getString('DrCr_')) text = '借方科目不能为空';
            else if (!this.state.client.getString('Type_')) text = '类别不能为空';
            else if (!this.state.client.getString('IsGroup_')) text = '纳入集团报表统计不能为空';
            else if (!this.state.client.getString('DefAmount_')) text = '默认金额不能为空';
            else if (!this.state.client.getString('FirstCode_')) text = '一级科目不能为空';
            else if (!this.state.client.getString('Type_')) text = '大类不能为空';
            if (text != '') break;
        }
        if (text != '') {
            Toast.error(text);
            return;
        }
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
        let recNo = this.state.client.records.indexOf(row);
        this.state.client.setRecNo(recNo + 1);
        let name = row.getString('Name_');
        this.state.client.setValue('Name_', this._nameList.get(name));
        this.setState({ ...this.state });
    }

    deleteRow = async (row: DataRow): Promise<void> => {
        let recNo = this.state.client.records.indexOf(row);
        if (recNo > -1) {
            this.state.client.setRecNo(recNo + 1);
            this.state.client.delete();
            this.state.client.head.copyValues(this.state.dataIn);
            await this.state.client.save();
            if (this.state.client.state <= 0) {
                console.log(this.state.client.message);
                return;
            } else {
                Toast.success('删除成功');
            }
            this.setState({ ...this.state });
        }
    }
}
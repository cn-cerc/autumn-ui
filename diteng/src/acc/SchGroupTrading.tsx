import React, { MouseEventHandler } from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBGrid, Column, OperatePanel, StatusBar, SearchPanelOnExecute, OnRowChangedEvent } from "autumn-ui";
import Datetime from "../tool/Datetime";
import Toast from "../tool/Toast";
import Utils from "../tool/Utils";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";
import MainMenu from "./MainMenu";
import styles from "/sample/SchAccTran.css";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchGroupTrading extends CustomForm<CustomFormPropsType, stateType> {
    private _nameList: Map<string, string> = new Map();
    private _nameList2: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_GroupTrading');
        let dataIn = new DataRow();
        dataIn.setValue('YearMonth_', new Datetime().yearMonth);
        dataIn.setValue('MaxRecord_', 100);
        this.state = { client, dataIn, message: '' };
        this.getNameList();
        this.getNameList2();
    }

    async getNameList() {
        let nameClient = new SClient(this.props);
        nameClient.setService('CusSup');
        await nameClient.open();
        nameClient.forEach((row: DataRow) => {
            this._nameList.set(row.getString('Code_'), row.getString('ShortName_'));
        })
        this.btnSearch(this.state.dataIn)
    }

    async getNameList2() {
        let nameClient = new SClient(this.props);
        nameClient.setService('AccSubject');
        await nameClient.open();
        nameClient.forEach((row: DataRow) => {
            this._nameList.set(row.getString('AccCode_'), row.getString('Name_'));
        })
        this.btnSearch(this.state.dataIn)
    }

    get pageTitle(): string {
        return '集团交易抵消分录登记';
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
                    <DBEdit dataField='YearMonth_' dataName='作业年月' />
                    <DBEdit dataField='SrcCorp_' dataName='源公司别' />
                    <DBEdit dataField='AccCode_' dataName='科目代码' />
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='YearMonth_' name='会计年月' width='7' />
                    <Column code='SrcCorp_' name='源公司' width='10' >
                        <DBEdit dataField="SrcCorp_"></DBEdit>
                    </Column>
                    <Column code='SrcName_' name='公司简称(源)' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('SrcCorp_'))}</span>
                    }} />
                    <Column code='TrgCorp_' name='交易公司' width='10' >
                        <DBEdit dataField="TrgCorp_"></DBEdit>
                    </Column>
                    <Column code='TrgName_' name='公司简称(交)' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('TrgCorp_'))}</span>
                    }} />
                    <Column code='AccCode_' name='会计科目' width='10' >
                        <DBEdit dataField="AccCode_"></DBEdit>
                    </Column>
                    <Column code='AccName_' name='科目名称' width='15' customText={(row: DataRow) => {
                        return <span>{this._nameList2.get(row.getString('AccCode_'))}</span>
                    }} />
                    <Column code='DrCr_' name='借/贷' width='5' textAlign="center" customText={(row: DataRow) => {
                        return row.getString('DrCr_') == 'true' ? <span>1.借</span> : <span>0.贷</span>
                    }} />
                    <Column code='DrAmount_' name='借方金额' width='5' >
                        <DBEdit dataField="DrAmount_"></DBEdit>
                    </Column>
                    <Column code='CrAmount_' name='贷方金额' width='5' >
                        <DBEdit dataField="CrAmount_"></DBEdit>
                    </Column>
                    <Column code='WaitDr_' name='未过帐借方额' width='5' >
                        <DBEdit dataField="WaitDr_"></DBEdit>
                    </Column>
                    <Column code='WaitCr_' name='未过帐贷方额 ' width='5' >
                        <DBEdit dataField="WaitCr_"></DBEdit>
                    </Column>
                    <Column code='Type_' name='手工录入否' width='5' textAlign="center" customText={(row: DataRow) => {
                        return row.getString('DrCr_') == 'true' ? <span>Yes</span> : <span></span>
                    }} />
                    <Column code='UpdateUser_' name='更新人员' width='5'></Column>
                    <Column code='UpdateDate_' name='更新日期' width='10'></Column>
                    <Column code='AppUser_' name='建档人员' width='5'></Column>
                    <Column code='AppDate_' name='建档日期' width='10'></Column>
                    <Column code='opera' name='操作' textAlign='center' width='5' customText={
                        ((dataRow: DataRow) => {
                            return <span role='auiOpera' onClick={this.deleteRow.bind(this, dataRow)}>删除</span>
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

    btnSearch: SearchPanelOnExecute = async () => {
        this.state.client.clear()
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
        row.setValue('Type_', 'True');
        row.setValue('DrCr_', 'True');
        row.setValue('DrAmount_', 0);
        row.setValue('CrAmount_', 0);
        row.setValue('WaitDr_', 0);
        row.setValue('WaitCr_', 0);
        row.setValue('YearMonth_', this.state.dataIn.getString('YearMonth_'));
        this.setState({ ...this.state });
    }

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.first();
        let text: string = '';
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('YearMonth_')) text = '会计年月不能为空';
            else if (!this.state.client.getString('SrcCorp_')) text = '源公司不能为空';
            else if (!this.state.client.getString('TrgCorp_')) text = '交易公司不能为空';
            else if (!this.state.client.getString('AccCode_')) text = '会计科目不能为空';
            else if (!this.state.client.getString('DrCr_')) text = '借/贷不能为空';
            else if (!this.state.client.getString('CrAmount_')) text = '贷方金额不能为空';
            else if (!this.state.client.getString('DrAmount_')) text = '借方金额不能为空';
            else if (!this.state.client.getString('WaitDr_')) text = '未过帐借方额不能为空';
            else if (!this.state.client.getString('WaitCr_')) text = '未过帐贷方额不能为空';
            else if (!this.state.client.getString('Type_')) text = '手工录入否不能为空';
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
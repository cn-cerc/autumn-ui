import React, { MouseEventHandler } from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBGrid, Column, OperatePanel, StatusBar, OnRowChangedEvent } from "autumn-ui";
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

export default class FrmOffsetCashGroup extends CustomForm<CustomFormPropsType, stateType> {

    private _nameList: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('YearMonth_', new Datetime().yearMonth);
        dataIn.setValue('MaxRecord_', 100);
        client.setService('AC_OffsetCashGroup');
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '集团现金流量表抵消分录登记';
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
                    <DBEdit dataField='YearMonth_' dataName='作业年月' />
                    <DBEdit dataField='CashCode_' dataName='项目代码' />
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='YearMonth_' name='会计年月' width='10' >
                        <DBEdit dataField='YearMonth_' />
                    </Column>
                    <Column code='CashCode_' name='项目代码' width='10' >
                        <DBEdit dataField='CashCode_' />
                    </Column>
                    <Column code='Name_' name='项目名称' width='10' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('CashCode_'))}</span>
                    }} />
                    <Column code='Amount_' name='抵消金额' width='10' >
                        <DBEdit dataField='Amount_' />
                    </Column>
                    <Column code='Remark_' name='备注' width='30' >
                        <DBEdit dataField='Remark_' />
                    </Column>
                    <Column code='AppUser_' name='建档人员' width='10' />
                    <Column code='AppDate_' name='建档时间' width='15' />
                    <Column code='UpdateUser_' name='更新人员' width='10' />
                    <Column code='UpdateDate_' name='更新时间' width='15' />
                    <Column code='opera' name='操作' textAlign='center' width='10' customText={
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

    componentDidMount(): void {
        this.initNameList();
    }

    async initNameList() {
        let client = new SClient(this.props);
        client.setService('AC_CashFlow');
        await client.open();
        client.first();
        while (client.fetch()) {
            this._nameList.set(client.getString('Code_'), client.getString('Name_'));
        }
        this.btnSearch();
    }

    async btnSearch() {
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
        row.setValue('YearMonth_', this.state.dataIn.getString('YearMonth_'));
        this.setState({ ...this.state });
    }

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.first();
        let text: string = '';
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('YearMonth_')) text = '会计年月不能为空';
            if (!this.state.client.getString('CashCode_')) text = '项目代码不能为空';
            if (!this.state.client.getString('Amount_')) text = '抵消金额不能为空';
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
        console.log(row, field, oldValue)
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
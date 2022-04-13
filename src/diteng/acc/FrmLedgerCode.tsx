import React, { MouseEventHandler } from "react";
import DataRow from "../../db/DataRow";
import Datetime from "../../db/Datetime";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import DBDatePicker from "../../rcc/DBDatePicker";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import OperatePanel from "../../rcc/OperatePanel";
import SearchPanel from "../../rcc/SearchPanel";
import StatusBar from "../../rcc/StatusBar";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../CustomForm";
import MainMenu from "../MainMenu";
import styles from "/sample/SchAccTran.css";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmLedgerCode extends CustomForm<CustomFormPropsType, stateType> {

    private _nameList: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('Code_', '*');
        dataIn.setValue('AppDate__from', Utils.getMonthStartDay())
        dataIn.setValue('AppDate__to', Utils.getMonthEndDay())
        dataIn.setValue('MaxRecord_', 100);
        client.setService('LedgerCode');
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '分类帐代码表维护';
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
                    <DBEdit dataField='Code_' dataName='帐码编号' />
                    <DBDatePicker dataField='AppDate__from' dataName='创建日期'></DBDatePicker>
                    <DBDatePicker dataField='AppDate__to' dataName='至'></DBDatePicker>
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='Code_' name='帐码编号' width='10' >
                        <DBEdit dataField='Code_' />
                    </Column>
                    <Column code='Name_' name='帐码名称' width='20' >
                        <DBEdit dataField='Name_' />
                    </Column>
                    <Column code='ToAcc_' name='冲帐否' width='10' >
                        <DBEdit dataField='ToAcc_' />
                    </Column>
                    <Column code='AccCode_' name='科目代码' width='30' >
                        <DBEdit dataField='AccCode_' />
                    </Column>
                    <Column code='AccName_' name='科目名称' width='30' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('AccCode_'))}</span>
                    }}>
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
        client.setService('AccSubject');
        await client.open();
        client.first();
        while (client.fetch()) {
            this._nameList.set(client.getString('AccCode_'), client.getString('Name_'));
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
        row.setValue('ToAcc_', 'False');
        this.setState({ ...this.state });
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
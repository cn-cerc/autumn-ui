import React from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBGrid, Column, SearchPanelOnExecute, OnRowChangedEvent } from "autumn-ui";
import Toast from "../tool/Toast";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";
import MainMenu from "./MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAccBookSub1 extends CustomForm<CustomFormPropsType, stateType> {
    private _nameList: Map<string, string> = new Map();

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_Amount.searchAccBookSub1');
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        this.state = { client, dataIn, message: '' };
        this.getNameList();
    }

    get pageTitle(): string {
        return '会计账目汇总(SUB)查询';
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
                    <DBEdit dataField='1' dataName='仅显示底阶科目(勾选)' />
                    <DBEdit dataField='2' dataName='仅显示记账科目(勾选)' />
                    <DBEdit dataField='3' dataName='仅显示一阶科目(勾选)' />
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='YearMonth_' name='会计年月' width='10' >
                    </Column>
                    <Column code='AccCode_' name='科目代码' width='10' >
                    </Column>
                    <Column code='AccName_' name='科目名称' width='15' customText={(row: DataRow) => {
                        return <span>{this._nameList.get(row.getString('AccCode_'))}</span>
                    }} />
                    <Column code='InitAmount_' name='期初母币余额' width='3' >
                    </Column>
                    <Column code='DrAmount_' name='母币借方金额' width='3' >
                    </Column>
                    <Column code='CrAmount_' name='母币贷方金额' width='3' >
                    </Column>
                    <Column code='Amount_' name='母币余额' width='3' >
                    </Column>
                </DBGrid>
            </React.Fragment>
        )
    }

    async getNameList() {
        let nameClient = new SClient(this.props);
        nameClient.setService('AccSubject');
        await nameClient.open();
        nameClient.forEach((row: DataRow) => {
            this._nameList.set(row.getString('AccCode_'), row.getString('Name_'));
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
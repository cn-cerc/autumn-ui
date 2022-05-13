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

export default class FrmStatementChanges extends CustomForm<CustomFormPropsType, stateType> {

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('Code_', '*');
        client.setService('AC_State');
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '所有者权利变更项目设置';
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
                    <DBEdit dataField='Code_' dataName='项目代码' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='Code_' name='项目代码' width='10' >
                        <DBEdit dataField='Code_' />
                    </Column>
                    <Column code='Name_' name='项目名称' width='10' >
                        <DBEdit dataField='Name_' />
                    </Column>
                    <Column code='Remark_' name='备注' width='20' >
                        <DBEdit dataField='Remark_' />
                    </Column>
                    <Column code='FnlFinal_' name='末级否' width='30' >
                        <DBEdit dataField='FnlFinal_' />
                    </Column>
                    <Column code='Level_' name='项目级次' width='30' >
                        <DBEdit dataField='Level_' />
                    </Column>
                    <Column code='ParentCode_' name='项目父阶' width='30' >
                        <DBEdit dataField='ParentCode_' />
                    </Column>
                    <Column code='Final_' name='确认否' width='30' >
                        <DBEdit dataField="Final_" />
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

    btnSearch: SearchPanelOnExecute = async (row: DataRow) => {
        this.state.client.clear()
        this.state.client.head.copyValues(row)
        await this.state.client.open();
        if (this.state.client.state <= 0) {
            console.log(this.state.client.message);
            return;
        } else {
            Toast.success('保存成功');
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
        row.setValue('FnlFinal_', 'True');
        row.setValue('Level_', 1);
        row.setValue('Final_', 'False');
        this.setState({ ...this.state });
    }

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.first();
        let text: string = '';
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Code_')) text = '项目代码不能为空';
            else if (!this.state.client.getString('Name_')) text = '项目描述不能为空';
            else if (!this.state.client.getValue('FnlFinal_')) text = '末级否不能为空';
            else if (!this.state.client.getString('Level_')) text = '层级不能为空';
            else if (!this.state.client.getString('ParentCode_')) text = '父接点不能为空';
            else if (!this.state.client.getValue('Final_')) text = '确认否不能为空';
            else if (text != '') break;
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
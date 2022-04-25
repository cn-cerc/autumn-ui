import React, { MouseEventHandler } from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import OperatePanel from "../../rcc/OperatePanel";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
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

export default class FrmAccParam extends CustomForm<CustomFormPropsType, stateType> {

    private _reportCtrl: Map<string, string> = new Map([['0.不控制', '0'], ['1.作废单据不允许打印', '1'], ['2.作废与草稿单据不允许打印', '2']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AccBookH');
        let dataIn = new DataRow();
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '财务帐别维护';
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
                    <DBEdit dataField='Code_' dataName='帐别代码' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='Code_' name='帐别代码' width='5' >
                        <DBEdit dataField="Code_"></DBEdit>
                    </Column>
                    <Column code='Name_' name='帐别名称' width='10' >
                        <DBEdit dataField="Name_"></DBEdit>
                    </Column>
                    <Column code='Mode_' name='编号方式' width='5' >
                        <DBEdit dataField="Mode_"></DBEdit>
                    </Column>
                    <Column code='DateFM_' name='有效日期从' width='10' >
                        <DBEdit dataField="DateFM_"></DBEdit>
                    </Column>
                    <Column code='DateTO_' name='有效日期至' width='10' >
                        <DBEdit dataField="DateTO_"></DBEdit>
                    </Column>
                    <Column code='Currency_' name='母币' width='5' >
                        <DBEdit dataField="Currency_"></DBEdit>
                    </Column>
                    <Column code='AccWith_' name='单号长度' width='5' >
                        <DBEdit dataField="AccWith_"></DBEdit>
                    </Column>
                    <Column code='ReportCtrl_' name='打印控制' width='5' >
                        <DBDrop dataField='ReportCtrl_' options={this._reportCtrl}></DBDrop>
                    </Column>
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

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let row = this.state.client.append();
        row.setValue('UpdateKey_', Utils.guid());
        row.setValue('ID_', Utils.guid());
        row.setValue('Name_', '<新的帐别>');
        row.setValue('DateFM_', Utils.getMonthStartDay());
        row.setValue('DateTO_', Utils.getMonthEndDay());
        row.setValue('Mode_', 'D');
        row.setValue('Currency_', 'CNY');
        row.setValue('HasChild_', 'False');
        row.setValue('UpdateMode_', 'False');
        row.setValue('ReportCtrl_', 0);
        row.setValue('Default_', 'False');
        row.setValue('ShortYear_', 'False');
        this.setState({ ...this.state });
    }

    btnSave: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        this.state.client.first();
        let text: string = '';
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Code_')) text = '帐别代码不能为空';
            else if (!this.state.client.getString('Name_')) text = '帐别名称不能为空';
            else if (!this.state.client.getString('Mode_')) text = '编号方式不能为空';
            else if (!this.state.client.getString('DateFM_')) text = '有效日期从不能为空';
            else if (!this.state.client.getString('DateTO_')) text = '有效日期至不能为空';
            else if (!this.state.client.getString('Currency_')) text = '母币不能为空';
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

}
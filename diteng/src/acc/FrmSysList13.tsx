import React from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBGrid, Column, OperatePanel, SearchPanelOnExecute, DataSet } from "autumn-ui";
import Datetime from "../tool/Datetime";
import Toast from "../tool/Toast";
import Utils from "../tool/Utils";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";

type SysListTypeState = {
    client: SClient,
    dataIn: DataRow,
    message: string
} & Partial<CustomFormStateType>

export default class FrmSysList13 extends CustomForm<CustomFormPropsType, SysListTypeState> {
    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        let dataIn = new DataRow();
        dataIn.setValue('Class_', 13);
        dataIn.setValue('Code_', '*');
        dataIn.setValue('MaxRecord', 100);
        client.setService('SysList');
        this.state = {
            client,
            dataIn,
            message: ''
        }
    }

    get pageTitle(): string {
        return '会计摘要维护'
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
                    <DBEdit dataField='Code_' dataName='代码编号'></DBEdit>
                    <DBEdit dataField='MaxRecord' dataName='载入笔数'></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.client} key={this.state.client.updateKey}>
                    <Column name='代码' code='Code_' width='65'>
                        <DBEdit dataField='Code_'></DBEdit>
                    </Column>
                    <Column name='名称' code='Name_' width='145'>
                        <DBEdit dataField='Name_'></DBEdit>
                    </Column>
                    <Column name='备注说明' code='Remark_' width='145'>
                        <DBEdit dataField='Remark_'></DBEdit>
                    </Column>
                    <Column name='更新人员' code='UpdateUser_' width='65'></Column>
                    <Column name='更新日期' code='UpdateDate_' width='145'></Column>
                    <Column name='建档人员' code='AppUser_' width='65'></Column>
                    <Column name='建档日期' code='AppDate_' width='145'></Column>
                    <Column code='opera' name='操作' width='40' textAlign='center' customText={
                        ((dataRow: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleDelete.bind(this, dataRow)}>删除</span>
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

    componentDidMount(): void {
        this.handleSearch(this.state.client.head);
    }

    handleSearch: SearchPanelOnExecute = async (row: DataRow) => {
        this.state.client.head.close;
        this.showLoadMessage('系统正在查询中...');
        this.state.client.head.copyValues(this.state.dataIn)
        await this.state.client.open();
        this.setLoad(false);
        if (this.state.client.state <= 0) {
            Toast.error(this.state.client.message);
            return;
        }
        this.setState({ ...this.state });
    }

    handleAppend() {
        let dataSet: DataSet = this.state.client.append();
        dataSet.setValue('Class_', 13);
        dataSet.setValue('Code_', '');
        dataSet.setValue('Name_', '<新的代码>');
        dataSet.setValue('Remark_', '');
        dataSet.setValue('UpdateUser_', 'admin');
        dataSet.setValue('UpdateDate_', new Datetime().toString());
        dataSet.setValue('AppUser_', 'admin');
        dataSet.setValue('AppDate_', new Datetime().toString());
        dataSet.setValue('UpdateKey_', Utils.guid());
        this.setState({ ...this.state });
    }

    async handleSave() {
        let bool = true;
        this.state.client.first();
        while (this.state.client.fetch()) {
            if (!this.state.client.getString('Code_')) {
                bool = false;
                break;
            }
        }
        if (!bool) {
            Toast.error('币别代码不能为空');
            return;
        }
        await this.state.client.save();
        if (this.state.client.state <= 0)
            Toast.error(this.state.client.message);
        else
            Toast.success('保存成功');
        this.setState({ ...this.state });
    }

    handleDelete(row: DataRow) {
        let recNo = this.state.client.locationRow(row);
        if (recNo > 0) {
            this.state.client.setRecNo(recNo);
            this.state.client.delete();
            Toast.success(('删除成功'));
            this.setState({ ...this.state });
        }
    }
}
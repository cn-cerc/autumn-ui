import React, { MouseEventHandler } from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBDrop, DBGrid, Column, OperatePanel, StatusBar, OnRowChangedEvent, SearchPanelOnExecute } from "autumn-ui";
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

export default class FrmAccObj extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>([['所有类别', '']]);
    get typeList(): Map<string, string> {
        return this._typeList;
    }

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_Obj');
        this.state = { client, dataIn: new DataRow(), message: '' };
        this.init();
    }

    async init() {
        let typeClient = new SClient(this.props);
        typeClient.setService('AC_ObjT');
        await typeClient.open();
        typeClient.forEach((row: DataRow) => {
            this._typeList.set((row.getInt('Type_') + '.' + row.getString('Name_')), row.getInt('Type_') + '');
        })
        this.btnSearch(this.state.dataIn)
    }

    get pageTitle(): string {
        return '对象别资料表维护';
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
                    <DBEdit dataField='Code_' dataName='对象代码' />
                    <DBEdit dataField='Name_' dataName='对象名称' />
                    <DBDrop dataField='Type_' dataName='对象类别' options={this._typeList} />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='Type_' name='对象类别' width='10' >
                        <DBDrop dataField='Type_' options={this._typeList} />
                    </Column>
                    <Column code='Code_' name='代码' width='10' >
                        <DBEdit dataField='Code_' />
                    </Column>
                    <Column code='Name_' name='名称' width='20' >
                        <DBEdit dataField='Name_' />
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

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let row = this.state.client.append();
        row.setValue('AppUser_', 'admin');
        row.setValue('AppDate_', new Datetime().toString());
        row.setValue('UpdateUser_', 'admin');
        row.setValue('UpdateDate_', new Datetime().toString());
        row.setValue('UpdateKey_', Utils.guid());
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
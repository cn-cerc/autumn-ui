import React, { MouseEventHandler } from "react";
import DataRow from "../src/db/DataRow";
import Datetime from "../src/db/Datetime";
import SClient from "../src/db/SClient";
import Utils from "../src/db/Utils";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../src/diteng/CustomForm";
import MainMenu from "../src/diteng/MainMenu";
import DBDrop from "../src/rcc/DBDrop";
import DBEdit from "../src/rcc/DBEdit";
import DBGrid, { Column } from "../src/rcc/DBGrid";
import MenuItem from "../src/rcc/MenuItem";
import OperatePanel from "../src/rcc/OperatePanel";
import SearchPanel, { SearchPanelOnExecute } from "../src/rcc/SearchPanel";
import StatusBar from "../src/rcc/StatusBar";
import ToolPanel, { ToolItem } from "../src/rcc/ToolPanel";
import styles from "./SchAccTran.css";

type stateType = {
    client: SClient;
    message: string;
} & Partial<CustomFormStateType>

export default class AcPaySet extends CustomForm<CustomFormPropsType, stateType> {
    private _typeList: Map<string, string> = new Map<string, string>([['现金', '0'], ['货到付款', '1'], ['月结', '2'], ['隔月结', '3'], ['分期付款', '4']]);
    get typeList(): Map<string, string> { return this._typeList; }

    private _styleList: Map<string, string> = new Map<string, string>([['L/C信用证', '0'], ['T/T电汇', '1'], ['CASH现金', '2'], ['CHECK票据', '3'], ['D/P付款交单', '4'], ['D/A承兑交单', '5']]);
    get styleList(): Map<string, string> { return this._styleList; }

    private _modeList: Map<string, string> = new Map<string, string>([['M', '0'], ['D', '1']]);
    public get modeList(): Map<string, string> { return this._modeList; }

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.server.setHost('http://127.0.0.1:8080/');
        client.server.setToken(this.props.token);
        client.setService('AC_PaySet');
        this.state = { client, message: '' };
        this.btnSearch(this.state.client.head)
    }

    render() {
        return (
            <CustomForm title='结算方式资料维护' className={styles.main}>
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
                <SearchPanel dataRow={this.state.client.head} onExecute={this.btnSearch}>
                    <DBEdit dataField='Code_' dataName='类别代码' />
                </SearchPanel>
                <DBGrid dataSet={this.state.client} readOnly={false}>
                    <Column code='Code_' name='代码' width='10' >
                        <DBEdit dataField='Code_' />
                    </Column>
                    <Column code='Name_' name='描述' width='30' >
                        <DBEdit dataField='Name_' />
                    </Column>
                    <Column code='Type_' name='付款类别' width='10'>
                        <DBDrop dataField="Type_" options={this.typeList}></DBDrop>
                    </Column>
                    <Column code='Style_' name='付款方式' width='10'>
                        <DBDrop dataField="Style_" options={this.styleList}></DBDrop>
                    </Column>
                    <Column code='DayNum_' name='期限' width='10' >
                        <DBEdit dataField='DayNum_' />
                    </Column>
                    <Column code='Mode_' name='期限类型' width='10'>
                        <DBDrop dataField="Mode_" options={this.modeList}></DBDrop>
                    </Column>
                    <Column code='AppUser_' name='建档人员' width='10' />
                    <Column code='AppDate_' name='建档时间' width='15' />
                    <Column code='UpdateUser_' name='更新人员' width='10' />
                    <Column code='UpdateDate_' name='更新时间' width='15' />
                    <Column code='opera' name='操作' width='10' customText={
                        ((dataRow: DataRow) => {
                            return <a href='#' onClick={this.deleteRow.bind(this, dataRow)}>删除</a>
                        })
                    } />
                </DBGrid>
                <OperatePanel>
                    <button className={styles.operaButton} onClick={this.btnAppend}>新增</button>
                    <button className={styles.operaButton} onClick={this.btnSave}>保存</button>
                </OperatePanel>
                <StatusBar>
                </StatusBar>
            </CustomForm>
        )
    }

    btnSearch: SearchPanelOnExecute = async (row: DataRow) => {
        this.state.client.head.close
        this.state.client.head.copyValues(row)
        await this.state.client.open();
        if (this.state.client.state <= 0) {
            console.log(this.state.client.message);
            return;
        }
        console.log('查询成功')
        this.setState(this.state);
    }

    btnAppend: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        let row = this.state.client.append();
        row.setValue('Type_', 0);
        row.setValue('Style_', 0);
        row.setValue('Mode_', 0);
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
        }
        this.setState({ ...this.state });
    }

    OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
        let row = this.state.client.setRecNo(recNo).current;
        if (field == 'Type_') {
        }
    }

    deleteRow = async (row: DataRow): Promise<void> => {
        let recNo = this.state.client.records.indexOf(row);
        if (recNo > -1) {
            this.state.client.setRecNo(recNo + 1);
            this.state.client.delete();
            await this.state.client.save();
            if (this.state.client.state <= 0) {
                console.log(this.state.client.message);
                return;
            }
            console.log('删除成功')
            this.setState({ ...this.state });
        }
    }
}
import React from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
import Utils from "../../db/Utils";
import DBDatePicker from "../../rcc/DBDatePicker";
import DBDrop from "../../rcc/DBDrop";
import DBEdit from "../../rcc/DBEdit";
import DBGrid, { Column, OnRowChangedEvent } from "../../rcc/DBGrid";
import MenuItem from "../../rcc/MenuItem";
import SearchPanel, { SearchPanelOnExecute } from "../../rcc/SearchPanel";
import StatusBar from "../../rcc/StatusBar";
import ToolPanel, { ToolItem } from "../../rcc/ToolPanel";
import CustomForm, { CustomFormPropsType, CustomFormStateType } from "../CustomForm";
import MainMenu from "../MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class FrmAccTransfter extends CustomForm<CustomFormPropsType, stateType> {

    private _transfter: Map<string, string> = new Map<string, string>([['0.未记账凭证', '0'], ['1.已记账凭证', '1']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABH');
        let dataIn = new DataRow();
        dataIn.setValue('Final_', 1);
        dataIn.setValue('Transfter_', '0');
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '会计凭证记账作业';
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
                    <DBDatePicker dataField='TBDate__from' dataName='制单日期'></DBDatePicker>
                    <DBDatePicker dataField='TBDate__to' dataName='至'></DBDatePicker>
                    <DBEdit dataField='TBNo_' dataName='凭证单号' />
                    <DBEdit dataField='AppUser_' dataName='制单人员' />
                    <DBDrop dataField='Transfter_' dataName='记账凭证' options={this._transfter}></DBDrop>
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='TBNo_' name='凭证单号' width='10' />
                    <Column code='TBDate_' name='制单日期' width='15' />
                    <Column code='DrAmount_' name='借方金额' width='5' />
                    <Column code='CrAmount_' name='贷方金额' width='5' />
                    <Column code='AppUser_' name='制单人员' width='10' />
                    <Column code='Transfter_' name='记账否' width='10' />
                </DBGrid>
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

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }

}
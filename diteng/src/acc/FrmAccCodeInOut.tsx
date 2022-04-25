import React from "react";
import DataRow from "../../db/DataRow";
import SClient from "../../db/SClient";
import Toast from "../../db/Toast";
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

export default class FrmAccCodeInOut extends CustomForm<CustomFormPropsType, stateType> {

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AccSubject');
        let dataIn = new DataRow();
        dataIn.setValue('MaxRecord_', 100);
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '会计科目导入与导出';
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
                    <DBEdit dataField='Type_' dataName='仅导出有效科目' />
                    <DBEdit dataField='MaxRecord_' dataName='载入笔数' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='ParentCode_' name='上级科目代码' width='10' />
                    <Column code='Type_' name='对象类别' width='15' />
                    <Column code='AccCode_' name='科目代码' width='10' />
                    <Column code='ShortName_' name='科目简称(中文)' width='15' />
                    <Column code='Name_' name='科目名称(中文)' width='10' />
                    <Column code='DrCr_' name='借/贷' width='10' />
                    <Column code='ABIn_' name='底阶科目' width='10' />
                    <Column code='Level_' name='层级' width='10' />
                    <Column code='FirstCode_' name='一级科目' width='10' />
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
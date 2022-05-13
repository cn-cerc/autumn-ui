import React from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBDrop, DBGrid, Column, StatusBar, SearchPanelOnExecute, OnRowChangedEvent } from "autumn-ui";
import Datetime from "../tool/Datetime";
import Toast from "../tool/Toast";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";
import MainMenu from "./MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAccBalances extends CustomForm<CustomFormPropsType, stateType> {

    private _transfter: Map<string, string> = new Map<string, string>([['0.按底阶科目统计', '0'], ['1.按一级科目统计', '1']]);

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('AC_Amount.searchAccBalances');
        let dataIn = new DataRow();
        dataIn.setValue('List_', 0);
        dataIn.setValue('ABIn_', 1);
        dataIn.setValue('YearMonth_', new Datetime().yearMonth);
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '试算平衡表列印';
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
                    <DBEdit dataField='YearMonth_' dataName='会计年月' />
                    <DBEdit dataField='Type1_' dataName='包含未记账的凭证' />
                    <DBDrop dataField='List_' dataName='记账凭证' options={this._transfter} onChanged={this.handleChange.bind(this)}></DBDrop>
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='AccCode_' name='科目代码' width='10' />
                    <Column code='AccName_' name='科目名称' width='15' />
                    <Column code='DrCr_' name='借/贷' width='10' />
                    <Column code='InitAmount_' name='期初余额' width='15' />
                    <Column code='DrAmount_' name='借方小计' width='10' />
                    <Column code='CrAmount_' name='贷方小计' width='10' />
                    <Column code='InitTotal_' name='年初余额 ' width='10' />
                    <Column code='DrTotal_' name='本年累计借方' width='10' />
                    <Column code='CrTotal_' name='本年累计贷方' width='10' />
                    <Column code='TTotal_' name='本年余额' width='10' />
                </DBGrid>
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

    handleChange() {
        this.state.dataIn.setValue('Level_', '');
        this.state.dataIn.setValue('ABIn_', '');
        let val = this.state.dataIn.getString('List_');
        if (val == '1')
            this.state.dataIn.setValue('Level_', 1);
        else
            this.state.dataIn.setValue('ABIn_', 1);
    }

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }

}
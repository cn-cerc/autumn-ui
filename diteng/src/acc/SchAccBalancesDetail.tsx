import React from "react";
import { SClient, DataRow, MenuItem, ToolPanel, ToolItem, SearchPanel, DBEdit, DBGrid, Column, StatusBar, SearchPanelOnExecute, OnRowChangedEvent } from "autumn-ui";
import DBDatePicker from "../block/DBDatePicker";
import Toast from "../tool/Toast";
import Utils from "../tool/Utils";
import CustomForm, { CustomFormStateType, CustomFormPropsType } from "./CustomForm";
import MainMenu from "./MainMenu";

type stateType = {
    client: SClient;
    dataIn: DataRow;
    message: string;
} & Partial<CustomFormStateType>

export default class SchAccBalancesDetail extends CustomForm<CustomFormPropsType, stateType> {

    constructor(props: CustomFormPropsType) {
        super(props);
        let client = new SClient(this.props);
        client.setService('ABB.searchAccBalancesDetail');
        let dataIn = new DataRow();
        dataIn.setValue('Final_', 1);
        dataIn.setValue('TBDate__from', Utils.getMonthStartDay());
        dataIn.setValue('TBDate__to', Utils.getMonthEndDay());
        this.state = { client, dataIn, message: '' };
    }

    get pageTitle(): string {
        return '试算平衡表列印-明细';
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
                    <DBDatePicker dataField='TBDate__from' dataName='凭证日期'></DBDatePicker>
                    <DBDatePicker dataField='TBDate__to' dataName='至'></DBDatePicker>
                    <DBEdit dataField='CostDept_' dataName='成本中心' />
                    <DBEdit dataField='AccCode_' dataName='会计科目' />
                    <DBEdit dataField='Type1_' dataName='含本期未有发生额(勾选)' />
                    <DBEdit dataField='Type1_' dataName='含未记账(勾选)' />
                    <DBEdit dataField='Type1_' dataName='清空为零记录(勾选)' />
                </SearchPanel>
                <DBGrid key={this.state.client.updateKey} dataSet={this.state.client} readOnly={false} onChanged={this.onRowChanged.bind(this)}>
                    <Column code='AccCode_' name='科目代码' width='10' />
                    <Column code='AccName_' name='科目名称' width='15' />
                    <Column code='DrCr_' name='借/贷' width='5' customText={(row: DataRow) => {
                        return row.getString('DrCr_') == 'true' ? <span>1.借</span> : <span>0.贷</span>
                    }}>
                    </Column>
                    <Column code='Currency_' name='币别' width='5' />
                    <Column code='CurrInitAmt_' name='前期余额外币' width='5' />
                    <Column code='DrNum_' name='笔数' width='5' />
                    <Column code='DrCurrAmt_' name='本期借方外币 ' width='5' />
                    <Column code='CrNum_' name='笔数' width='5' />
                    <Column code='CrCurrAmt_' name='本期贷方外币' width='5' />
                    <Column code='DrCrCurrAmt_' name='本期余额外币' width='5' />
                    <Column code='TotalCurr_' name='期未余额外币' width='5' />
                    <Column code='InitAmt_' name='前期余额' width='5' />
                    <Column code='DrAmt_' name='借方小计' width='5' />
                    <Column code='CrAmt_' name='贷方小计' width='5' />
                    <Column code='DrCrAmt_' name='本期余额' width='5' />
                    <Column code='Total_' name='期未余额 ' width='5' />
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

    onRowChanged: OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => {
        this.setState({ ...this.state });
    }

}
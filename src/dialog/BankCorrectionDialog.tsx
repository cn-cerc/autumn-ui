import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../visualization/src/tool/Summer";

type BankCorrectionTypeState = {
    dataRow: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BankCorrectionDialog extends BaseDialog<BaseDialogPropsType, BankCorrectionTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataRow = new DataRow();
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        dataRow.setValue('banknameInput', input.value);
        this.state = {
            ...this.state,
            width: '45rem',
            height: '30rem',
            dataRow,
            dataSet: new DataSet()
        }
    }

    content(): JSX.Element {
        return <div style={{ "height": "100%" }} role='content'>
            <SearchPanel dataRow={this.state.dataRow} onExecute={this.init.bind(this)}>
                <DBEdit dataField='banknameInput' dataName='支行名称'></DBEdit>
            </SearchPanel>
            {this.getTable()}
        </div>
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        if (this.state.dataRow.getString('banknameInput').length < 6) {
            showMsg('请至少输入6个字的分行名称');
            return;
        }
        this.setLoad(true);
        let dataSet = await FplApi.getBankCorrection(this.state.dataRow);
        this.setState({
            dataSet
        }, () => {
            this.setLoad(false);
        })
    }

    getTable() {
        if (this.isPhone) {
            return <Block dataSet={this.state.dataSet}>
                <Line>
                    <ColumnIt width='10' name=''></ColumnIt>
                    <Column width='90' name='' code='bankName'></Column>
                </Line>
                <Line>
                    <Column width='50' name='支行号码' code='bankCode'></Column>
                </Line>
                <Line>
                    <Column code='bankRatio' width='85' name="匹配度" textAlign="center"></Column>
                    <Column code='Opera' width='15' name='' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </Line>
            </Block>
        } else {
            return <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                <ColumnIt width='10'></ColumnIt>
                <Column code='bankCode' width='40' name="支行号码"></Column>
                <Column code='bankName' width='60' name="支行名称"></Column>
                <Column code='bankRatio' width='20' name="匹配度" textAlign="center"></Column>
                <Column code='Opera' width='20' name='操作' textAlign="center" customText={(row: DataRow) => {
                    return <span role='auiOpera'>选择</span>
                }}></Column>
            </DBGrid>
        }
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('bankName');
        this.handleClose();
    }
}
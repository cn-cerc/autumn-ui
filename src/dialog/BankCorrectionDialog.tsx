import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";

type BankCorrectionTypeProps = {
    banknameInput: string
} & Partial<BaseDialogPropsType>

type BankCorrectionTypeState = {
    dataRow: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BankCorrectionDialog extends BaseDialog<BankCorrectionTypeProps, BankCorrectionTypeState> {
    constructor(props: BankCorrectionTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('banknameInput', this.props.banknameInput);
        this.state = {
            ...this.state,
            width: '40rem',
            height: '30rem',
            dataRow,
            dataSet: new DataSet()
        }
    }

    content(): JSX.Element {
        return <React.Fragment>
            <SearchPanel dataRow={this.state.dataRow} onExecute={this.init.bind(this)}>
                <DBEdit dataField='banknameInput' dataName='支行名称'></DBEdit>
            </SearchPanel>
            <DBGrid dataSet={this.state.dataSet}>
                <ColumnIt></ColumnIt>
            </DBGrid>
        </React.Fragment>
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        if(!this.state.dataRow.getString('banknameInput')) {
            return;
        }
        this.setLoad(true);
        let ds = await FplApi.getBankCorrection(this.state.dataRow);
        console.log(ds)
        let dataSet = new DataSet();
        let data = JSON.parse(ds.head.getString('data'));
        // dataSet.append().setValue('Name_', data.bankname || )
        this.setState({
            dataSet: ds
        }, () => {
            this.setLoad(false);
        })
    }
}
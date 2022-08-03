import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type AddressProps = {
    parms?: String,
    personID: String,
    callBack?: Function;
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class AddressDialog extends BaseDialog<AddressProps, StaffTypeState> {
    constructor(props: AddressProps) {
        let dataIn = new DataRow();
        dataIn.setValue('maxRecord', 100);
        super(props)
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '60rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getAddress(this.state.dataIn);

        console.log(this.props)

        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="contact_" dataName="联系人" autoFocus></DBEdit>
                    <DBEdit dataField="mobile_" dataName="手机号" ></DBEdit>
                    <DBEdit dataField="maxRecord" dataName="载入笔数" ></DBEdit>
                </SearchPanel>
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return <Block dataSet={this.state.dataSet}>
                <Line>
                    <ColumnIt width='10' name='' />
                    <Column code="contact_" name="联系人" width="100"></Column>
                </Line>
                <Line>
                    <Column code="mobile_" name="手机号" width="100"></Column>
                </Line>
                <Line>
                    <Column width='85' code='remark_' name='备注'></Column>
                    <Column code="opera" name="" width="15" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </Line>
            </Block>
        } else {
            return <DBGrid dataSet={this.state.dataSet} openPage={false} onRowClick={this.handleClick.bind(this)}>
                <ColumnIt />
                <Column code="contact_" name="联系人" width="100"></Column>
                <Column code="mobile_" name="手机号" width="100"></Column>
                <Column code="address_" name="地址" width="100"></Column>
                <Column code="area5_" name="详细地址" width="100"></Column>
                <Column code="remark_" name="备注" width="100"></Column>
                <Column code="opera" name="操作" width="100" textAlign='center' customText={(row: DataRow) => {
                    return <span role="auiOpera" id='category'>选择</span>
                }}></Column>
            </DBGrid>
        }
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        if (input1)
            input1.value = dataRow.getString('contact_');
        if (this.props.callBack)
            this.props.callBack(dataRow);
        if (this.props.parms)
            this.callBackInputs(dataRow, this.props.parms);
        if (this.props.personID)
            $("#" + this.props.personID).val(dataRow.getString("contact_"));
        this.handleSelect();
    }
    callBackInputs(dataRow: DataRow, parms: String) {
        if (parms) {
            let arr = parms.split(",");
            for (let i = 0; i < arr.length / 2; i++) {
                let key = arr[i];
                let value = arr[i + 1];
                if (dataRow)
                    $("#" + value).val(dataRow.getValue(key));
            }
        }
    }
}
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type SendCarDriverProps = {
    callBack?: Function,
    affiliated?: boolean,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class SendCarDriverDialog extends BaseDialog<SendCarDriverProps, StaffTypeState> {
    constructor(props: SendCarDriverProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue("maxRecord", 100);
        dataIn.setValue("affiliated", this.props.affiliated);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle("选择司机")
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getSendCarDriver(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="name_" dataName="司机名称" autoFocus></DBEdit>
                    <DBEdit dataField="maxRecord" dataName="载入笔数"></DBEdit>
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
                    <Column code="name_" name="司机名称" width="90"></Column>
                </Line>
                <Line>
                    <Column code="phone_num_" name="联系方式" width="80"></Column>
                    <Column code="opera" name="" width="20" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </Line>
            </Block>
        } else {
            return <DBGrid dataSet={this.state.dataSet} openPage={false} onRowClick={this.handleClick.bind(this)}>
                <ColumnIt />
                <Column code="name_" name="司机名称" width="20"></Column>
                <Column code="phone_num_" name="联系方式" width="20"></Column>
                <Column code="type_" name="司机类别" width="20" textAlign='center' customText={(row: DataRow) => {
                    let type = row.getInt("type_");
                    return type == 0 ? "员工" : type == 1 ? "挂靠" : "托管";
                }}></Column>

                <Column code="opera" name="操作" width="20" textAlign='center' customText={(row: DataRow) => {
                    return <span role="auiOpera" id='category'>选择</span>
                }}></Column>
            </DBGrid>
        }
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        let input3 = document.getElementById(inputIds[2]) as HTMLInputElement;
        input1.value = dataRow.getString('driver_no_');
        if (input2)
            input2.value = dataRow.getString('name_');
        if (input3)
            input3.value = dataRow.getString('phone_num_');
        if (this.props.callBack)
            this.props.callBack(dataRow);
        this.handleSelect();
    }
}
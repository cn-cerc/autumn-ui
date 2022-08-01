import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type NumberPlateProps = {
    deptCode: string,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class NumberPlateDialog extends BaseDialog<NumberPlateProps, StaffTypeState> {
    constructor(props: NumberPlateProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('dept_code_', this.props.deptCode);
        dataIn.setValue('maxRecord', 100);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getCarsByDeptCode(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="car_num_" dataName="车牌号" autoFocus></DBEdit>
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
                    <ColumnIt width="10" name='' />
                    <Column code="car_num_" name="车牌号" width="90"></Column>
                </Line>
                <Line>
                    <Column code="approved_load_" name="核定载重" width="80"></Column>
                    <Column code="opera" name="" width="20" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </Line>
            </Block>
        } else {
            return <DBGrid dataSet={this.state.dataSet} openPage={false} onRowClick={this.handleClick.bind(this)}>
                <ColumnIt width="10" />
                <Column code="car_num_" name="车牌号" width="50"></Column>
                <Column code="approved_load_" name="核定载重" width="50"></Column>
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
        input1.value = dataRow.getString('car_no_');
        input2.value = dataRow.getString('car_num_');
        this.handleSelect();
    }
}
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type ContractProps = {
    code: String,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class CodeRecordTwoDialog extends BaseDialog<ContractProps, StaffTypeState> {
    constructor(props: ContractProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('parent_code_', this.props.code);
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
        let dataSet = await FplApi.getCargoCodeRecord(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="code_" dataName="货物名称" autoFocus></DBEdit>
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
                    <Column width='90' code='code_' name=''></Column>
                </Line>
                <Line>
                    <Column width='50' code='unit_price_' name='订单价'></Column>
                    <Column width='50' code='waybill_unit_price_' name='运单价'></Column>
                </Line>
                <Line>
                    <Column width='100' code='main_unit_' name='单位' customText={
                        ((dataRow: DataRow) => {
                            let unit = dataRow.getValue("main_unit_");
                            return unit == 0 ? "吨" : unit == 1 ? "方" : unit == 2 ? "件" : "车";
                        })
                    }></Column>
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
                <Column code="code_" name="货物名称" width="100"></Column>
                <Column code="main_unit_" name="主单位" width="100" customText={
                    ((dataRow: DataRow) => {
                        let unit = dataRow.getValue("main_unit_");
                        return unit == 0 ? "吨" : unit == 1 ? "方" : "件";
                    })
                }></Column>
                <Column code="unit_price_" name="主单价" width="100" ></Column>
                <Column code="deputy_unit_" name="副单位" width="100"></Column>
                <Column code="deputy_unit_price_" name="副单价" width="100"></Column>
                <Column code="conversion_value_" name="换算值" width="100"></Column>
                <Column code="cargo_loss_rate_" name="货损率" width="100"></Column>
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
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        let mainUnit = document.getElementById("main_unit_") as HTMLInputElement;
        let unitPrice = document.getElementById("unit_price_") as HTMLInputElement;
        let deputyUnit = document.getElementById("deputy_unit_") as HTMLInputElement;
        let deputyUnitPrice = document.getElementById("deputy_unit_price_") as HTMLInputElement;
        let conversionValue = document.getElementById("conversion_value_") as HTMLInputElement;
        let cargoLossRate = document.getElementById("cargo_loss_rate_") as HTMLInputElement;

        if (input1)
            input1.value = dataRow.getString('code_');
        if (input2)
            input2.value = dataRow.getString('code_');
        if (mainUnit)
            mainUnit.value = dataRow.getValue("main_unit_");
        if (unitPrice)
            unitPrice.value = dataRow.getString('unit_price_');
        if (deputyUnit)
            deputyUnit.value = dataRow.getString('deputy_unit_');
        if (deputyUnitPrice)
            deputyUnitPrice.value = dataRow.getString('deputy_unit_price_');
        if (conversionValue)
            conversionValue.value = dataRow.getString('conversion_value_');
        if (cargoLossRate)
            cargoLossRate.value = dataRow.getString('cargo_loss_rate_');
        //切换单位
        $("#main_unit_").change();
        this.handleSelect();
    }
}
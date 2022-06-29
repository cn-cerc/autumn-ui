import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import FplDialogApi from "./FplDialogApi";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";

type ContractProps = {
    code:String,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class CodeRecordDialog extends BaseDialog<ContractProps, StaffTypeState> {
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
        let dataSet = await FplDialogApi.getCargoCodeRecord(this.state.dataIn);
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
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code="code_" name="货物名称" width="100"></Column>
                    <Column code="main_unit_" name="主单位" width="100" customText={
                        ((dataRow: DataRow) => {
                            let unit =dataRow.getValue("main_unit_");
                            return unit==0?"吨":unit==1?"方":"件";
                        })
                    }></Column>
                    <Column code="unit_price_" name="主单价" width="100" ></Column>
                    <Column code="deputy_unit_" name="副单位" width="100"></Column>
                    <Column code="deputy_unit_price_" name="副单价" width="100"></Column>
                    <Column code="conversion_value_" name="换算值" width="100"></Column>
                    <Column code="cargo_loss_rate_" name="货损率" width="100"></Column>
                    <Column code="remark_" name="备注" width="100"></Column> 
                    <Column code="opera" name="操作" width="100" textAlign='center' customText={(row: DataRow)=>{
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        let code = document.getElementById("code_") as HTMLInputElement;
        let total = document.getElementById("total_") as HTMLInputElement;
        let unitPrice = document.getElementById("unit_price_") as HTMLInputElement;
        let deputyUnit = document.getElementById("deputy_unit_") as HTMLInputElement;
        let deputyUnitPrice = document.getElementById("deputy_unit_price_") as HTMLInputElement;
        let conversionValue = document.getElementById("conversion_value_") as HTMLInputElement;
        let cargoLossRate = document.getElementById("cargo_loss_rate_") as HTMLInputElement;

        input1.value = dataRow.getString('code_');
        input2.value = dataRow.getString('code_');
        code.value = dataRow.getString('code_');
        total.value = dataRow.getString('total_');
        unitPrice.value = dataRow.getString('unit_price_');
        deputyUnit.value = dataRow.getString('deputy_unit_');
        deputyUnitPrice.value = dataRow.getString('deputy_unit_price_');
        conversionValue.value = dataRow.getString('conversion_value_');
        cargoLossRate.value = dataRow.getString('cargo_loss_rate_');
        //切换单位
        $("#main_unit_").change();
        this.handleSelect();
    }
}
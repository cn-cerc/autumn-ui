import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import FplDialogApi from "./FplDialogApi";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";

type CargoCodeTypeProps = {
    code:String
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class CargoCodeTypeDialog extends BaseDialog<CargoCodeTypeProps, StaffTypeState> {
    constructor(props: CargoCodeTypeProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('parent_code_', this.props.code);
        console.log(this.props.code);
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
        let dataSet = await FplDialogApi.getCargoCodeTypeRecord(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="name_" dataName="运输类型" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code="opera" name="操作" width="100" textAlign='center' customText={(row: DataRow)=>{
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                    <Column code="name_" name="运输类型" width="100"></Column>
                    <Column code="count" name="货物数量" width="100"></Column>
                    <Column code="remark_" name="备注" width="100"></Column>
                </DBGrid>   
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;

        input1.value = dataRow.getString('code_');
        input2.value = dataRow.getString('name_');
        this.handleSelect();
    }
}
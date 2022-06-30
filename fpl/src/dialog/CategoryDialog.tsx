import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import FplDialogApi from "./FplDialogApi";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";

type CategoryProps = {
    parentCode: string,
} & Partial<BaseDialogPropsType>

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class CategoryDialog extends BaseDialog<CategoryProps, StaffTypeState> {
    constructor(props: CategoryProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('parent_code_', this.props.parentCode);
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
        let dataSet = await FplDialogApi.getCategorys(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="name_" dataName="类别名称" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code="name_" name="类别名称" width="50"></Column>
                    <Column code="opera" name="操作" width="20" textAlign='center' customText={(row: DataRow)=>{
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
        input1.value = dataRow.getString('code_');
        input2.value = dataRow.getString('name_');
        this.handleSelect();
    }
}
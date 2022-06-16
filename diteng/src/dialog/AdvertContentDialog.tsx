import React from "react";
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import DialogApi from './DialogApi';
import styles from "./StaffDialog.css";

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class AdvertContentDialog extends BaseDialog<BaseDialogPropsType, StaffTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props)
        let dataIn = new DataRow();
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
        let dataSet = await DialogApi.getAdvertContentList(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="name_" dataName="广告名称" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code="advert_no_" name="广告编号" width="50"></Column>
                    <Column code="advert_name_" name="广告名称" width="50"></Column>
                    <Column code="summary_" name="摘要内容" width="50"></Column>
                    <Column code="remark_" name="备注" width="50"></Column>
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
        input1.value = dataRow.getString('advert_no_');
        input2.value = dataRow.getString('advert_name_');
        this.handleSelect();
    }
}
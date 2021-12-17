import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import DialogApi from "./DialogApi";
import styles from "./StaffDialog.css";

type UserTypeProps = {
    title: string;
} & Partial<BaseDialogPropsType>

type UserTypeState = {
    dataIn: DataRow;
    dataSet: DataSet;
} & Partial<BaseDialogStateType>

export default class UserDialog extends BaseDialog<UserTypeProps, UserTypeState> {

    constructor(props: UserTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('Enabled_', 1);
        if(this.props.title)
            this.setTitle(this.props.title);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getCusList(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }
    content() {
        return (
            <div className={styles.main} role='content'>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName="查询条件" dataField="SearchText_" placeholder="请输入查询条件" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                    <Column name='账号' code='Code_' width='5'></Column>
                    <Column name='姓名' code='Name_' width='10'></Column>
                    <Column name='操作' code='opera' width='3' textAlign='center' customText={(row: DataRow) => {
                        return <span role='opera'>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        var inputIds = this.props.inputId.split(",");
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        if (inputIds.length > 1) {
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            input2.value = row.getValue('Name_');
        }
        this.handleSelect();
    }
}

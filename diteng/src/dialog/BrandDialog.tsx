import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, ColumnIt, Column } from "autumn-ui";
import DialogApi from "./DialogApi";
import styles from './StaffDialog.css';
import "../tool/Summer.css";

type BrandTypeState = {
    dataIn: DataRow;
    dataSet: DataSet;
} & Partial<BaseDialogStateType>

export default class BrandDialog extends BaseDialog<BaseDialogPropsType, BrandTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet: DataSet = new DataSet();
        let dataIn = new DataRow();
        dataIn.setValue('i', 0);
        this.state = {
            ...this.state,
            dataIn,
            dataSet,
            width: '40rem',
            height: this.isPhone ? '25rem' : '30rem'
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getSearchBrand(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    handleClick(brand: string) {
        if(this.props.onSelect) {
            let row = new DataRow();
            row.setValue(this.props.dataField, brand);
            this.props.onSelect(row);
            this.handleClose();
        } else {
            let input = document.getElementById(this.props.inputId) as HTMLInputElement;
            input.value = brand;
        }
        this.handleSelect();
    }

    content() {
        return (
            <div className={styles.main} role='content'>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' placeholder='请输入查询条件' autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt width="1" />
                    <Column code='Brand_' name='品牌' width='4'></Column>
                    <Column code='ShareMode_' name='开放模式' width='3' customText={(row: DataRow) => {
                        let span: string;
                        let shareMode = row.getString("ShareMode_");
                        switch (shareMode) {
                            case "0":
                                span = shareMode + ",不允许指定客户";
                                break;
                            case "1":
                                span = shareMode + ",允许指定客户";
                                break;
                            case "2":
                                span = shareMode + ",允许所有客户";
                                break;
                            default:
                                span = "0,不允许指定客户";
                                break;
                        }
                        return <span>{span}</span>;
                    }}></Column>
                    <Column code='opera' name='操作' width='2' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row.getString("Brand_"))}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        );
    }
}
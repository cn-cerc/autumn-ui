import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBDrop, DBCheckbox, DBGrid, Column } from "autumn-ui";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";
import FplDialogApi from "./FplDialogApi";
import StaticFile from "@diteng/StaticFile";
import ImageConfig from "@diteng/ImageConfig";

type SupTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    options: Map<string, string>
} & Partial<BaseDialogStateType>

export default class SupAndCusDialog extends BaseDialog<BaseDialogPropsType, SupTypeState> {
    constructor(props: BaseDialogStateType) {
        super(props);
        let dataSet = new DataSet();
        let dataIn = new DataRow();
        dataIn.setValue('type', '-1');
        let options = new Map();
        options.set("厂商+客户", "-1");
        options.set("厂商", "0");
        options.set("客户", "1");
        this.state = {
            ...this.state,
            dataIn,
            dataSet,
            options,
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle("选择厂商或客户")
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplDialogApi.getSupAndCus(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBDrop dataName='筛选类型' dataField='type' options={this.state.options}></DBDrop>
                    <DBEdit dataField="Name_" dataName="公司名称" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <Column code="Name_" name="公司全称" width="40" customText={(row: DataRow) => {
                        if (row.getBoolean('VineCorp_')) {
                            return <span>{row.getString('Name_')}<img src={StaticFile.getImage(ImageConfig.ICON_LINK_BOTH)} width='22' height='16'/></span>
                        } else {
                            return <span>{row.getString('Name_')}</span>;
                        }
                    }}></Column>
                    <Column code="type_name" textAlign='center' name="类型" width="15"></Column>
                    <Column code="Contact_" name="联系方式" width="35" customText={(row: DataRow) => {
                        return <span>{row.getValue("Contact_")},{row.getValue("Tel1_")}</span>
                    }}></Column>
                    <Column code="Code_" name="操作" width="15" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera">选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(",");
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = dataRow.getValue("Code_");
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if (input2) input2.value = dataRow.getValue("Name_");
        this.handleSelect();
    }
}
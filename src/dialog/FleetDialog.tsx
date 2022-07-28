import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBDrop, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import styles from "./DialogCommon.css";

const CUSTOMER_204008 = '204008';

type FleetProps = {
    corpNo: string,
} & Partial<BaseDialogPropsType>


type DepartmentTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    options: Map<string, string>,
    showBack: boolean,
    history: DataSet[]
} & Partial<BaseDialogStateType>

export default class FleetDialog extends BaseDialog<FleetProps, DepartmentTypeState> {
    constructor(props: FleetProps) {
        super(props);
        let options = new Map();
        options.set("一级车队", "8");
        options.set("二级车队", "12");
        options.set("三级车队", "16");
        options.set("四级车队", "20");
        options.set("五级车队", "24");
        options.set("六级车队", "28");
        let dataIn = new DataRow();
        dataIn.setValue('DeptLevel_', '8');
        dataIn.setValue('Disable_', false);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            options,
            showBack: false,
            width: '45rem',
            history: new Array(),
            height: this.isPhone ? '25rem' : '35rem'
        }
        this.setTitle('请选择车队');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let ds = await DitengApi.getUserInfo();
        let userData = new DataSet();
        userData.setJson(ds.json);
        let cropNo = userData.head.getString('CorpNo_');
        if (cropNo == CUSTOMER_204008)
            this.state.dataIn.setValue('DeptLevel_', '12');
        this.state.dataIn.setValue('fleet_', true);
        this.state.dataIn.setValue('corp_no_', this.props.corpNo);
        let dataSet = await this.getFleets();
        this.state.history.push(dataSet);
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            this.setState({
                dataSet
            })
        }
    }

    content() {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSearch.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                    <DBDrop dataName='车队层级' dataField='DeptLevel_' options={this.state.options}></DBDrop>
                </SearchPanel>
                {this.state.showBack ? <div style={{ 'padding': '0 1rem' }}><span role='auiOpera' style={{ 'cursor': 'pointer' }} onClick={this.handleBack.bind(this)}>返回上一级</span></div> : ''}
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet}>
                    <Line>
                        <Column name='车队代码' code='Code_' width='100'></Column>
                    </Line>
                    <Line>
                        <Column name='车队名称' code='Name_' width='100' customText={(row: DataRow) => {
                            return (
                                <React.Fragment>
                                    <span>车队名称：</span>
                                    <span role='auiOpera' onClick={this.nameClick.bind(this, row)}>{row.getString('Name_')}</span>
                                </React.Fragment>
                            )
                        }}></Column>
                    </Line>
                    <Line>
                        <Column name='停用否' code='Disable_' width='80' customText={(row: DataRow) => {
                            let text = row.getValue('Disable_') ? '是' : '否';
                            return <span>停用否：{text}</span>
                        }}></Column>
                        <Column code='opera' textAlign='right' width='20' customText={(row: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }}></Column>
                    </Line>
                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt />
                    <Column name='车队代码' code='Code_' width='20'></Column>
                    <Column name='车队名称' code='Name_' width='20' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.nameClick.bind(this, row)}>{row.getString('Name_')}</span>
                    }}></Column>
                    <Column name='停用否' code='Disable_' width='20' customText={(row: DataRow) => {
                        let text = row.getValue('Disable_') ? '是' : '否';
                        return <span>{text}</span>
                    }}></Column>
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}  >选择</span>
                    }}></Column>
                </DBGrid>
            )
        }
    }

    async getFleets(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await FplApi.getFleets(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    async handleSearch() {
        if (this.state.dataIn.getValue('PCode'))
            this.state.dataIn.setValue('PCode', '');
        let dataSet = await this.getFleets();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            let history: DataSet[] = [];
            this.state.dataIn.setValue('SearchText_', '');
            history.push(dataSet)
            this.setState({
                dataSet,
                history,
                showBack: false,
            })
        }
    }

    async nameClick(row: DataRow) {
        let level = Number(this.state.dataIn.getString('DeptLevel_')) + 4;
        this.state.dataIn.setValue('DeptLevel_', String(level)).setValue('PCode', row.getString('Code_'));
        let dataSet = await this.getFleets();
        this.state.history.push(dataSet);
        this.setState({
            showBack: true,
            dataSet
        })
    }

    async handleBack() {
        let level = Number(this.state.dataIn.getString('DeptLevel_')) - 4;
        this.state.dataIn.setValue('DeptLevel_', String(level));
        this.state.history.pop();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.history[this.state.history.length - 1])
        this.setState({
            showBack: this.state.history.length > 1 ? true : false,
            dataSet
        })
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        if (this.props.onSelect) {
            let dataRow = new DataRow();
            dataRow.setValue(inputIds[0], row.getString('Code_'));
            dataRow.setValue(inputIds[1], row.getString('Name_'));
            this.props.onSelect(dataRow);
            this.handleClose();
        } else {
            let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
            input1.value = row.getString('Code_');
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            if (input2) input2.value = row.getString('Name_');
            this.handleSelect();
        }
    }
}
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import styles from "./DialogCommon.css";
import styles1 from "./WorkItemDialog.css";

type CusTypeProps = {
    code: String
} & Partial<BaseDialogPropsType>

type CusTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    dataSetShow: DataSet,
    inputValue: string;
} & Partial<BaseDialogStateType>
//WorkItem
export default class WorkItemDialog extends BaseDialog<CusTypeProps, CusTypeState> {
    constructor(props: CusTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('repair_item_', this.props.code);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            dataSetShow: new DataSet(),
            width: '40rem',
            height: '30rem',
            inputValue: "",
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let new_dataOut = new DataSet();
        let dataOut = await FplApi.getWorkItem();
        dataOut.first();
        while (dataOut.fetch()) {
            if (dataOut.getString("parent_code_")) {
                new_dataOut.append().copyRecord(dataOut.current);
            }
        }
        this.setState({
            dataSet: new_dataOut,
            dataSetShow: new_dataOut
        })
    }
    content(): JSX.Element {
        return <div role="content" className={styles.main}>
            <div className={styles1.searchDiv}>
                <div>
                    <label htmlFor="">项目名称:</label>
                    <input type="text" placeholder="请输入查询条件" onChange={this.onchange.bind(this)} />
                </div>
                <button onClick={this.onclick.bind(this)}>查询</button>
            </div>
            <DBGrid dataSet={this.state.dataSetShow} openPage={false}>
                <ColumnIt width="50" />
                <Column code="code_" name="编号" width="100" textAlign='center'></Column>
                <Column code="repair_item_" name="项目名称" width="100" textAlign='center'></Column>
                <Column code="ordinary_cost_" name="普档(单位/元)" width="100" textAlign='center' customText={(row: DataRow) => {
                    return <span role="auiOpera" id='category' onClick={this.select.bind(this, 0, row.getString("code_"))}>{row.getString("ordinary_cost_")}</span>
                }}></Column>
                <Column code="secondary_cost_" name="中档(单位/元)" width="100" textAlign='center' customText={(row: DataRow) => {
                    return <span role="auiOpera" id='category' onClick={this.select.bind(this, 1, row.getString("code_"))}>{row.getString("secondary_cost_")}</span>
                }}></Column>
                <Column code="higt_cost_" name="高档(单位/元)" width="100" textAlign='center' customText={(row: DataRow) => {
                    return <span role="auiOpera" id='category' onClick={this.select.bind(this, 2, row.getString("code_"))}>{row.getString("higt_cost_")}</span>
                }}></Column>
            </DBGrid>
        </div>;
    }

    onchange(event: any) {
        this.setState({
            inputValue: event.target.value
        })
    }

    onclick() {
        let dataSetShow = new DataSet();
        let dataSet = this.state.dataSet;
        dataSet.first();
        while (dataSet.fetch()) {
            if (dataSet.getString("repair_item_").indexOf(this.state.inputValue) > -1) {
                dataSetShow.append().copyRecord(dataSet.current);
            }
        }
        this.setState({
            dataSetShow
        })
    }

    async select(index: number, code: string) {
        let headIn = new DataRow();
        headIn.setValue('order_tb_no_', this.props.inputId);
        headIn.setValue('work_tb_no_', code);
        headIn.setValue('work_grade_', index);
        let dataOut = await FplApi.appendSvrRepairItems(headIn);
        if ((dataOut).state > 0) {
            showMsg('添加成功');
            this.handleClose();
        } else {
            showMsg((dataOut).message);
        }
    }
}
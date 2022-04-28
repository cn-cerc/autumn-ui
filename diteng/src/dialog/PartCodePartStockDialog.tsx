import React from "react";
import DialogApi from './DialogApi';
import styles from "./StaffDialog.css";
import { showMsg } from "../tool/Summer";
import { BaseDialogPropsType, DataSet, DataRow, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, ColumnIt, Column } from "autumn-ui";

type PartCodePartStockTypeProps = {
    partCode: string
} & Partial<BaseDialogPropsType>

type PartCodePartStockTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    tStock: number
} & Partial<BaseDialogStateType>

export default class PartCodePartStockDialog extends BaseDialog<PartCodePartStockTypeProps, PartCodePartStockTypeState> {
    constructor(props: PartCodePartStockTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn: new DataRow(),
            tStock: 0,
            width: '50rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getDfPartCWList();
        let dataOut = await this.getDisplay();
        let tStock: number = 0;
        dataSet.records.forEach((row: DataRow) => {
            if (dataOut.locate('CWCode_', row.getString('CWCode_'))) {
                row.setValue('Stock_', dataOut.getDouble('Stock_'))
            } else {
                row.setValue('Stock_', '0')
            }
            let stock = Number(row.getValue('Stock_'));
            row.getNumber
            if (stock)
                tStock += stock;

        })
        dataSet.setSort("Stock_ DESC", "CWCode_");
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            this.setState({
                dataSet,
                tStock
            })
        }
    }

    content() {
        return (
            <div role='content' className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                </SearchPanel>
                <div className={styles.dbgridSum}>数量汇总：{this.state.tStock}</div>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt/>
                    <Column name='仓别' code='CWCode_' width='20'></Column>
                    <Column name='仓存量' code='Stock_' width='20'></Column>
                    <Column name='操作' code='opera' width='10' textAlign='center' customText={
                        (row: DataRow) => {
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                        }
                    }></Column>
                </DBGrid>
            </div>
        )
    }

    async getDfPartCWList(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getDfPartCWList({
            SearchText_: this.state.dataIn.getString('SearchText_')
        });
        this.setLoad(false);
        return dataSet;
    }

    async getDisplay(): Promise<DataSet> {
        let dataSet = await DialogApi.getDisplay({
            SearchText_: this.state.dataIn.getString('SearchText_'),
            PartCode_: this.props.partCode
        });
        return dataSet;
    }

    handleClick(row: DataRow) {
        let inputDom = document.getElementById(this.props.inputId) as HTMLInputElement;
        inputDom.value = row.getString('CWCode_');
        if (inputDom.closest('tr')) {
            let curStocks = inputDom.closest('tr').querySelectorAll('[role=CurStock_]');
            if (curStocks.length > 0) {
                curStocks.forEach((curStock: HTMLElement) => {
                    curStock.innerText = row.getString('Stock_');
                })
            }
        }
        if (inputDom.closest('tr')) {
            let stockAHs = inputDom.closest('tr').querySelectorAll('[role=Stock_]');
            if (stockAHs.length > 0) {
                stockAHs.forEach((stockAH: HTMLElement) => {
                    stockAH.innerText = row.getString('Stock_');
                })
            }
        }
        this.handleSelect();
    }
}
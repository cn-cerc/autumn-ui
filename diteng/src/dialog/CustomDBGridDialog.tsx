import React, { isValidElement } from "react";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBGrid, { Column } from "../rcc/DBGrid";
import DataSet from "../db/DataSet";
import { ColumnIt } from "../rcc/ColumnIt";
import DataRow from "../db/DataRow";
import styles from "./CustomDBGridDialog.css";
import DBCheckbox from "../rcc/DBCheckbox";
import { ClientStorage } from "../db/Utils";
import { showMsg } from "./Summer";

type CustomDBGridTypeProps = {
    tb: string,
    userNo: string,
    reloadState: () => void,
    initColumns: () => React.ReactNode[]
} & Partial<BaseDialogPropsType>

type CustomDBGridTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class CustomDBGridDialog extends BaseDialog<CustomDBGridTypeProps, CustomDBGridTypeState> {
    private _client = new ClientStorage(`diteng_${this.props.userNo}`);
    private _upDateKey = new Date().getTime();
    constructor(props: CustomDBGridTypeProps) {
        super(props);
        this.setTitle('表格自定义');
        this.state = {
            ...this.state,
            dataSet: new DataSet()
        }
    }
    content(): JSX.Element {
        return (
            <div className={styles.main}>
                <DBGrid dataSet={this.state.dataSet}>
                    <ColumnIt width='10'></ColumnIt>
                    <Column name='列名' code='columnName' width='20'></Column>
                    <Column name='显示' code='show' width='10' textAlign='center' onChanged={this.changeVisible.bind(this)}>
                        <DBCheckbox dataField='show'></DBCheckbox>
                    </Column>
                    <Column name='编辑' code='edit' width='10' textAlign='center'></Column>
                    <Column name='操作' code='opera' width='40' textAlign='center' customText={(row: DataRow) => {
                        return <div className={styles.sort}>
                            <button onClick={this.handleUp.bind(this, row)}>向上↑</button>
                            <button onClick={this.handleDown.bind(this, row)}>向下↓</button>
                        </div>
                    }}></Column>
                </DBGrid>
                <div className={styles.operate}>
                    <button onClick={this.handleSave.bind(this)}>保存</button>
                    <button onClick={this.handleDefault.bind(this)}>恢复默认</button>
                </div>
            </div>
        );
    }
    componentDidMount(): void {
        this.initDataSet();
    }
    getAdornment(): JSX.Element {
        return <span></span>
    }
    initDataSet() {
        let items: React.ReactNode[] = this.props.initColumns();
        let dataSet = new DataSet();
        let dataJson = this._client.get(this.props.tb);
        if (dataJson) {
            let ds = new DataSet();
            ds.setJson(dataJson);
            ds.first();
            while (ds.fetch()) {
                React.Children.map(items, child => {
                    if (isValidElement(child)) {
                        // @ts-ignore
                        let className = child.type.className || ''
                        if (className == Column.className && child.props.code == ds.getString('field')) {
                            dataSet.append().setValue('columnName', child.props.name).setValue('visible', ds.current.getBoolean('visible')).setValue('edit', '否').setValue('field', child.props.code).setValue('show', !ds.current.getBoolean('visible'));
                        }
                    }
                })
            }
        } else {
            React.Children.map(items, child => {
                if (isValidElement(child)) {
                    // @ts-ignore
                    let className = child.type.className || ''
                    if (className == Column.className) {
                        dataSet.append().setValue('columnName', child.props.name).setValue('visible', child.props.visible).setValue('edit', '否').setValue('field', child.props.code).setValue('show', !child.props.visible);
                    }
                }
            })
        }
        console.log(dataSet)
        this.setState({
            dataSet
        })
    }
    reloadUpDateKey() {
        this._upDateKey = new Date().getTime();
    }
    changeVisible(recNo: number) {
        let row = this.state.dataSet.records[recNo - 1];
        row.setValue('visible', !row.getBoolean('show'))
        this.setState(this.state);
    }
    handleUp(row: DataRow) {
        let index = this.state.dataSet.records.indexOf(row);
        if (index - 1 < 0) {
            return;
        }
        [this.state.dataSet.records[index], this.state.dataSet.records[index - 1]] = [this.state.dataSet.records[index - 1], this.state.dataSet.records[index]]
        this.reloadUpDateKey();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.dataSet);
        this.setState({
            dataSet: new DataSet()
        }, () => {
            this.setState({
                dataSet
            })
        })
    }
    handleDown(row: DataRow) {
        let index = this.state.dataSet.records.indexOf(row);
        if (index + 1 < this.state.dataSet.size) {
            [this.state.dataSet.records[index], this.state.dataSet.records[index + 1]] = [this.state.dataSet.records[index + 1], this.state.dataSet.records[index]]
            this.reloadUpDateKey();
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.state.dataSet);
            this.setState({
                dataSet: new DataSet()
            }, () => {
                this.setState({
                    dataSet
                })
            })
        }
    }
    handleSave() {
        this._client.set(this.props.tb, this.state.dataSet.json);
        showMsg('保存成功!');
        this.props.reloadState();
        this.handleClose();
    }
    handleDefault() {
        let items: React.ReactNode[] = this.props.initColumns();
        let dataSet = new DataSet();
        React.Children.map(items, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    dataSet.append().setValue('columnName', child.props.name).setValue('visible', child.props.visible).setValue('edit', '否').setValue('field', child.props.code).setValue('show', !child.props.visible);
                }
            }
        })
        this._client.remove(this.props.tb);
        this.setState({
            dataSet
        }, () => {
            showMsg('系统已恢复至默认表格。');
            this.props.reloadState();
            this.handleClose();
        })
    }
}
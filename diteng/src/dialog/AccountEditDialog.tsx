import React from "react";
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import DialogApi from './DialogApi';
import styles from "./StaffDialog.css";
import { showMsg } from "../tool/Summer";

type AccountEditTypeState = {
    dataSet: DataSet,
    dataIn: DataRow,
    showBack: boolean,
    history: DataSet[],
    codeHistory: string[]
} & Partial<BaseDialogStateType>

export default class AccountEditDialog extends BaseDialog<BaseDialogPropsType, AccountEditTypeState> {
    private showOpera = false;

    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataIn = new DataRow();
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            dataIn,
            showBack: false,
            width: '45rem',
            history: new Array(),
            codeHistory: new Array(),
            height: this.isPhone ? '25rem' : '35rem'
        }
        this.setTitle('选择会计科目');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getAccountEdit();
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
                </SearchPanel>
                {this.state.showBack ? <div style={{ 'padding': '0 1rem' }}><span role='auiOpera' style={{ 'cursor': 'pointer' }} onClick={this.handleBack.bind(this)}>返回上一级</span></div> : ''}
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return (
                <Block dataSet={this.state.dataSet} key={new Date().getTime()}>
                    <Line>
                        <Column name='科目属性' code='DrCr_' width='100' customText={(row: DataRow) => {
                            return row.getString('DrCr_') == 'true' ? <span>科目属性：贷</span> : <span>科目属性：借</span>
                        }}></Column>
                    </Line>
                    <Line>
                        <Column name='科目代码' code='Code_' width='100'></Column>
                    </Line>
                    <Line>
                        <Column name='科目名称' code='Disable_' width='100' customText={(row: DataRow) => {
                            let name = row.getString('Name_');
                            return row.getValue('Children_') == '0' ? <span>科目名称：{name}</span> : <div><span>科目名称：</span><span role='auiOpera' onClick={this.nameClick.bind(this, row)}>{name}</span></div>;
                        }}></Column>
                    </Line>
                    <Line>
                        <Column name='对象代码' code='ObjCode_' width='80'></Column>
                        {this.showOpera ? <Column name='操作' code='opera' width='20' textAlign='right' customText={(row: DataRow) => {
                            if (row.getNumber('Level_') > 0)
                                return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}  >选择</span>
                        }}></Column> : ''}
                    </Line>

                </Block>
            )
        } else {
            return (
                <DBGrid dataSet={this.state.dataSet} key={new Date().getTime()} openPage={false}>
                    <Column name='科目属性' code='DrCr_' textAlign='center' width='20' customText={(row: DataRow) => {
                        return row.getString('DrCr_') == 'true' ? <span>贷</span> : <span>借</span>
                    }}></Column>
                    <Column name='科目代码' code='Code_' width='20'></Column>
                    <Column name='科目名称' code='Disable_' width='30' customText={(row: DataRow) => {
                        let name = row.getString('Name_');
                        return row.getValue('Children_') == '0' ? <span>{name}</span> : <span role='auiOpera' onClick={this.nameClick.bind(this, row)}>{name}</span>;
                    }}></Column>
                    <Column name='对象代码' code='ObjCode_' width='20' textAlign='center'></Column>
                    {this.showOpera ? <Column name='操作' code='opera' width='20' textAlign='center' customText={(row: DataRow) => {
                        if (row.getNumber('Level_') > 0)
                            return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}  >选择</span>
                    }}></Column> : ''}
                </DBGrid>
            )
        }
    }

    async getAccountEdit(): Promise<DataSet> {
        this.setLoad(true);
        let dataIn = new DataRow();
        let text = this.state.dataIn.getString('SearchText_');
        if (!this.state.codeHistory.length && !text)
            dataIn.setValue('Level_', '0');
        else
            dataIn.setValue('PCode_', this.state.codeHistory[this.state.codeHistory.length - 1]);
        dataIn.setValue('SearchText_', text)
        let dataSet = await DialogApi.getAccountEdit(dataIn);
        dataSet.first();
        let bool = true;
        while (dataSet.fetch()) {
            if (dataSet.getDouble('Level_') !== 0)
                bool = false;
        }
        this.showOpera = bool ? false : true;
        this.setLoad(false);
        return dataSet;
    }

    async handleSearch() {
        let dataSet = await this.getAccountEdit();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message);
        } else {
            this.state.history.pop();
            this.state.history.push(dataSet)
            this.setState({
                dataSet,
                showBack: this.state.history.length > 1 ? true : false,
            })
        }
    }

    async nameClick(row: DataRow) {
        this.state.dataIn.setValue('SearchText_', '');
        this.state.codeHistory.push(row.getString('Code_'));
        let dataSet = await this.getAccountEdit();
        this.state.history.push(dataSet);
        this.setState({
            showBack: true,
            dataSet
        })
    }

    async handleBack() {
        this.state.history.pop();
        this.state.codeHistory.pop();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.history[this.state.history.length - 1])
        this.setState({
            showBack: this.state.history.length > 1 ? true : false,
            dataSet
        })
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('Code_');
        if (inputIds.length > 1) {
            let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
            input2.value = row.getString('Name_');
        }
        this.handleSelect();
    }
}
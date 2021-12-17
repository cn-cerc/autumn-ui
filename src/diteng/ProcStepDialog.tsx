import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBDrop from "../rcc/DBDrop";
import DBEdit from "../rcc/DBEdit";
import DBGrid, { Column } from "../rcc/DBGrid";
import SearchPanel from "../rcc/SearchPanel";
import styles from "./StaffDialog.css";
import DialogApi from './DialogApi';
import { showMsg } from "./Summer";
import { ColumnIt } from "../rcc/ColumnIt";

type ProcStepTypeProps = {
    showProc?: string,
} & Partial<BaseDialogPropsType>

type ProcStepTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    options: Map<string, string>
} & Partial<BaseDialogStateType>

export default class ProcStepDialog extends BaseDialog<ProcStepTypeProps, ProcStepTypeState> {
    constructor(props: ProcStepTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('Disable_', false);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            options: new Map(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle('请选择制程工序');
    }

    componentWillMount() {
        this.init();
    }

    content(): JSX.Element {
        return (
            <div className={styles.main} role='content'>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.handleSearch.bind(this)}>
                    <DBEdit dataName='查询条件' dataField='SearchText_' autoFocus></DBEdit>
                    <DBDrop dataName='制程选择' dataField='ProcCode_' options={this.state.options}></DBDrop>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)}>
                    <ColumnIt width='10'/>
                    <Column name='制程' textAlign='center' code='ProName_' width='15'></Column>
                    <Column name='工序' textAlign='right' code='StepName_' width='25'></Column>
                    <Column name='报价' textAlign='right' code='StepWage_' width='15'></Column>
                    <Column name='选择' textAlign='center' code='opera' width='15' customText={(row: DataRow) => {
                        return <span role='opera'>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    async init() {
        let dataSet1 = await DialogApi.getProcessList();
        let options = new Map();
        options.set('所有制程', '');
        while (dataSet1.fetch()) {
            options.set(dataSet1.getString('Name_'), dataSet1.getString('Code_'));
        }
        let dataSet = await this.getProcSteps();
        this.setState({
            dataSet,
            options
        })
    }

    async getProcSteps(): Promise<DataSet> {
        this.setLoad(true);
        let dataSet = await DialogApi.getProcSteps(this.state.dataIn);
        this.setLoad(false);
        return dataSet;
    }

    async handleSearch() {
        let dataSet = await this.getProcSteps();
        if (dataSet.state <= 0) {
            showMsg(dataSet.message)
        } else {
            this.setState({
                dataSet
            })
        }
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if(this.props.showProc) {
            input1.value = row.getString('StepCode_');
            input2.value = row.getString('StepName_');
        } else {
            let input3 = document.getElementById(inputIds[2]) as HTMLInputElement;
            let input4 = document.getElementById(inputIds[3]) as HTMLInputElement;
            input1.value = row.getString('ProcCode_');
            input2.value = row.getString('ProName_');
            input3.value = row.getString('StepCode_');
            input4.value = row.getString('StepName_');
        }
        this.handleSelect();
    }
}
import { DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, DataRow } from "autumn-ui";
import React from "react";
import DialogApi from "./DialogApi";
import styles from './PartStockDialog.css';

type BOMProcessTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BOMProcessDialog extends BaseDialog<BaseDialogPropsType, BOMProcessTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.setTitle('请选择制程');
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            width: '30rem',
            height: '20rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await DialogApi.getSearchBOMProcess();
        this.setState({
            dataSet
        })
    }

    content(): JSX.Element {
        return (
            <ul className={styles.main}>
                {this.state.dataSet.records.map((row: DataRow) => {
                    return <li key={row.getValue('Code_')} onClick={this.handleClick.bind(this, row)}>{row.getValue('Name_')}</li>
                })}
            </ul>
        )
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getValue('Code_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if(input2) input2.value = row.getValue('Name_');
        this.handleSelect();
    }
}
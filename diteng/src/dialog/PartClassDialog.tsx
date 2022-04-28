import { BaseDialogPropsType, DataSet, BaseDialogStateType, BaseDialog } from "autumn-ui";
import React from "react";
import DialogApi from "./DialogApi";
import styles from "./PartStockDialog.css";

type PartClassTypeProps = {
    repairedCW: string,
} & Partial<BaseDialogPropsType>

type PartClassTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class PartClassDialog extends BaseDialog<PartClassTypeProps, PartClassTypeState> {
    constructor(props: PartClassTypeProps) {
        super(props);
        this.setTitle('请选择商品大类');
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
        this.setLoad(true);
        let dataSet = await DialogApi.getClass1();
        this.setState({
            dataSet
        })
        this.setLoad(false);
    }

    content() {
        return (
            <ul className={styles.main}>
                {this.state.dataSet.records.map((row) => {
                    let name = row.getString('Name_');
                    return <li key={name} onClick={this.handleClick.bind(this, name)}>{name}</li>
                })}
            </ul>
        )
    }

    handleClick(name: string) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = name;
        this.handleSelect();
    }
}
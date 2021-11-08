import React, { isValidElement, LegacyRef } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";
import styles from './DialogForm.css'

export type OnSelectDataSetEvent = (values: DataSet) => void;

type DialogFormProps = {
    title: string;
    dataSource?: DataSource;
    onSelect?: OnSelectDataSetEvent;
    active: () => boolean;
    setActive: (active: boolean) => void;
}

export class DialogForm extends React.Component<DialogFormProps> {

    constructor(props: DialogFormProps) {
        super(props)
        this.state = { active: this.props.active }
    }

    render() {
        return (<div className={styles.dialogForm}>
            <button style={{ cursor: 'pointer' }} onClick={this.btnShow}>...</button>
            <div className={styles.dialogClient} style={{ display: this.props.active() ? 'inline' : 'none' }}>
                <div className={styles.dialogTitle}>
                    <span>{this.props.title}</span>
                    <span className={styles.dialogClose} onClick={this.btnClose}>X</span>
                </div>
                <div className={styles.dialogContent}>
                    {React.Children.map(this.props.children, child => {
                        if (isValidElement(child))
                            return React.cloneElement(child, { onSelect: this.onSelect })
                        else
                            return child
                    })}
                </div>
            </div>
        </div >)
    }

    onSelect = (values: DataRow) => {
        if (this.props.onSelect) {
            let ds = new DataSet()
            ds.append().copyRecord(values)
            this.setState({ ...this.state, active: false })
            this.props.onSelect(ds);
        }
    }

    btnShow: any = (sender: any) => {
        if (this.props.setActive)
            this.props.setActive(true);
    }

    btnClose: any = (sender: any) => {
        if (this.props.setActive)
            this.props.setActive(false);
    }

}
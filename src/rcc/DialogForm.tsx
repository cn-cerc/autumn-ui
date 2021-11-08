import React, { isValidElement, LegacyRef } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";
import { ISelectDialog } from "./DBEdit";
import './DialogForm.css'

export type OnSelectDataSetEvent = (values: DataSet) => void;

type DialogFormProps = {
    title: string;
    dataSource?: DataSource;
    onSelect?: OnSelectDataSetEvent;
    active: () => boolean;
    setActive: (active: boolean) => void;
}

export class DialogForm extends React.Component<DialogFormProps> {
    dialog: HTMLDivElement;

    constructor(props: DialogFormProps) {
        super(props)
        this.state = { active: this.props.active }
    }

    render() {
        return (<div className='dialogForm'>
            <button style={{ cursor: 'pointer' }} onClick={this.btnShow}>...</button>
            <div className='dialogClient' style={{ display: this.props.active() ? 'inline' : 'none' }}
                ref={this.setDialog}>
                <div className='dialogTitle'>
                    <span>{this.props.title}</span>
                    <span className='dialogClose' onClick={this.btnClose}>X</span>
                </div>
                <div className='dialogContent'>
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

    setDialog: LegacyRef<HTMLDivElement> = (sender: HTMLDivElement) => {
        this.dialog = sender;
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
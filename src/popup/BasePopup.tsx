import { DataRow, WebControl } from "autumn-ui";
import React from "react";
import StaticFile from "../static/StaticFile";
import styles from "./BasePopup.css";

export type BasePopupTypeProps = {
    height: string,
    title?: string,
    inputId?: string,
}

export type BasePopupTypeState = {
    title?: string,
    showLoad: boolean,
    message: string,
    height: string
}

export default abstract class BasePopup<T extends BasePopupTypeProps = BasePopupTypeProps, S extends BasePopupTypeState = BasePopupTypeState> extends WebControl<T, S> {
    state = {
        showLoad: false,
        message: '系统正在查询中,请稍后...',
        height: '20rem'
    } as S;
    constructor(props: T) {
        super(props);
    }

    abstract content(): JSX.Element;

    render() {
        if (this.isPhone)
            return <div className={styles.main} onClick={this.handleClose}>
                <div className={styles.content} style={{ 'height': this.state.height }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <div className={styles.title}>
                        <span>{this.props.title || this.state.title || '弹窗选择'}</span>
                        <span className={styles.close} onClick={this.handleClose}></span>
                    </div>
                    <div className={styles.popupContent}>
                        {this.content()}
                    </div>
                    {this.getLoad()}
                </div>
            </div>
    }

    showLoad(message?: string) {
        this.setState({
            showLoad: true,
            message: message || this.state.message
        })
    }

    hideLoad() {
        this.setState({
            showLoad: false
        })
    }

    getLoad() {
        if (this.state.showLoad)
            return <div className={styles.load}>
                <img src={StaticFile.getImage('images/loading.gif')} />
                <span>{this.state.message}</span>
            </div>
    }

    handleClose() {
        let dom = document.querySelector(`.${styles.content}`) as HTMLDivElement;
        dom.classList.add(styles.closePopup);
        setTimeout(function () {
            let box = document.getElementById('dialogBox');
            //@ts-ignore
            ReactDOM.unmountComponentAtNode(box);
            if (box) box.remove();
        }, 100);
    }
}

type PopupEditTypeProps = {
    dataRow: DataRow,
    dataField: string,
    onChange?: Function,
    class?: string,
    placeHolder?: string
}

type PopupEditTypeState = {
    value: string
}

export class PopupEdit extends React.Component<PopupEditTypeProps, PopupEditTypeState> {
    constructor(props: PopupEditTypeProps) {
        super(props);
        this.state = {
            value: this.props.dataRow.getString(this.props.dataField)
        }
    }

    render(): React.ReactNode {
        return <input type='text' value={this.state.value} onChange={(e) => this.handleChange(e)} className={this.props.class || styles.popupEdit} placeholder={this.props.placeHolder || ''}></input>
    }

    handleChange(e: any) {
        let value = e.target.value;
        this.props.dataRow.setValue(this.props.dataField, value);
        if (this.props.onChange)
            this.props.onChange();
        this.setState({
            value
        });
    }
}
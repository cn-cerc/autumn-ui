import React, { isValidElement } from "react";
import classNames from "../../node_modules/classnames/index";
import BaseForm, { BaseFormPropsType } from "../rcc/BaseForm";
import Block from "../rcc/Block";
import DBGrid from "../rcc/DBGrid";
import MainMessage from "../rcc/MainMessage";
import MenuItem from "../rcc/MenuItem";
import StatusBar from "../rcc/StatusBar";
import ToolPanel from "../rcc/ToolPanel";
import styles from './CustomForm.css';
import MainNavigator from "./MainNavigator";

export type CustomFormPropsType = {
    token?: string;
    title: string;
    className?: string;
} & Partial<BaseFormPropsType>;

export type CustomFormStateType = {
    message: string;
}

enum Device {
    PC, Phone
}

export default abstract class CustomForm<T extends CustomFormPropsType, S extends CustomFormStateType>
    extends BaseForm<T, S> {
    abstract get pageTitle(): string;

    private _load:  boolean = false;
    // 查询或保存时的提示信息，默认为查询
    private _loadMessage: string = '系统正在查询中,请稍后...';
    setLoad(bool: boolean) {
        this._load = bool;
        this.setState({...this.state});
    }
    setLoadMessage(message: string) {
        this._loadMessage = message;
    }
    showLoadMessage(message: string) {
        this._load = true;
        this._loadMessage = message;
        this.setState({...this.state});
    }
    showLoad() {
        this.setLoad(true);
    }
    closeLoad() {
        this.setLoad(false);
    }
    constructor(props: T) {
        super(props);
        this.state = { ...this.state, message: '' };
    }

    render() {
        return (
            <BaseForm title={this.pageTitle}>
                <MainNavigator >
                    {this.getMenus()}
                </MainNavigator>
                <div className={classNames(this.props.className, styles.main_content, this.isPhone ? styles.main_phone : styles.main_pc)}>
                    {this.getToolPanel()}
                    <div className={styles.content}>
                        <MainMessage message={this.state.message} />
                        <article>
                            {this.getContentComponents()}
                        </article>
                        {this.getStatusBar(Device.PC)}
                    </div>
                </div>
                {this.getStatusBar(Device.Phone)}
                {this.getLoading()}
            </BaseForm>
        )
    }
    /** 页面内容 */
    abstract content(): JSX.Element;

    getMenus(): React.ReactElement[] {
        let items: React.ReactElement[] = [];
        React.Children.map(this.content().props.children, child => {
            if (isValidElement(child) && (child.type == MenuItem)) {
                items.push(child);
            }
        })
        return items;
    }

    getToolPanel(): React.ReactElement {
        if (!this.content().props.children)
            return null;
        let items: React.ReactElement[] = [];
        React.Children.map(this.content().props.children, child => {
            if (isValidElement(child) && (child.type == ToolPanel)) {
                items.push(child);
            }
        })
        if (items.length == 0)
            return null;

        if (items.length > 1)
            throw new Error('ToolPanel count >１')
        return items[0];
    }

    getStatusBar(device: Device): React.ReactNode {
        if (device == Device.Phone && !this.isPhone)
            return null;
        if (device == Device.PC && this.isPhone)
            return null;

        if (!this.content().props.children)
            return null;

        let items: React.ReactElement[] = [];
        React.Children.map(this.content().props.children, (child) => {
            if (isValidElement(child) && (child.type == StatusBar))
                items.push(child);
        });
        if (items.length == 0)
            return null;
        if (items.length > 1)
            throw Error('StatusBar > 1');
        return items[0];
    }

    getContentComponents(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.content().props.children, (child) => {
            if (isValidElement(child)) {
                if (child.type == MenuItem) return;
                if (child.type == ToolPanel) return;
                if (child.type == StatusBar) return;
                if (this.isPhone) {
                    if (child.type == DBGrid) return;
                } else {
                    if (child.type == Block) return;
                }
                items.push(child);
            }
        })
        return items;
    }

    getLoading() {
        if(this._load) {
            return (
                <div className={styles.load}>
                    <img src='https://www.diteng.site/public/images/loading.gif' />
                    <span>{this._loadMessage}</span>
                </div>
            )
        }
    }

    get message(): string { return this.state.message }
    setMessage(value: string) { this.setState({ ...this.state, message: value }); return this; }
}

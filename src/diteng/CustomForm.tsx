import React, { Children, isValidElement } from "react";
import BaseForm, { BaseFormPropsType } from "../rcc/BaseForm";
import ToolPanel from "../rcc/ToolPanel";
import MainNavigator from "./MainNavigator";
import MainMessage from "../rcc/MainMessage";
import StatusBar from "../rcc/StatusBar";
import MenuItem from "../rcc/MenuItem";
import Block from "../rcc/Block";
import DBGrid from "../rcc/DBGrid";
import styles from './CustomForm.css';
import classNames from "../../node_modules/classnames/index";

export type CustomFormPropsType = {
    title: string;
    token?: string;
} & Partial<BaseFormPropsType>;

export type CustomFormStateType = {
    message: string;
}

enum Device {
    PC, Phone
}

export default class CustomForm<T extends CustomFormPropsType, S extends CustomFormStateType>
    extends BaseForm<T, S> {

    constructor(props: T) {
        super(props);
        this.state = { ...this.state, message: '' };
    }

    render() {
        return (
            <BaseForm title={this.props.title}>
                <MainNavigator >
                    {this.getMenus()}
                </MainNavigator>
                <div className={classNames(styles.main_content, this.isPhone ? styles.main_phone : styles.main_pc)}>
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
            </BaseForm>
        )
    }

    getMenus(): React.ReactElement[] {
        let items: React.ReactElement[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && (child.type == MenuItem)) {
                items.push(child);
            }
        })
        return items;
    }

    getToolPanel(): React.ReactElement {
        if (!this.props.children)
            return null;
        let items: React.ReactElement[] = [];
        React.Children.map(this.props.children, child => {
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

        if (!this.props.children)
            return null;

        let items: React.ReactElement[] = [];
        React.Children.map(this.props.children, (child) => {
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
        console.log(this.props.children)
        React.Children.map(this.props.children, (child) => {
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

    get message(): string { return this.state.message }
    setMessage(value: string) { this.setState({ ...this.state, message: value }); return this; }
}

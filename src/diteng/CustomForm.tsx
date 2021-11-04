import React, { Children, isValidElement } from "react";
import BaseForm, { BaseFormPropsType } from "../rcc/BaseForm";
import ToolPanel from "../rcc/ToolPanel";
import MainNavigator from "./MainNavigator";
import MainMessage from "../rcc/MainMessage";
import StatusBar from "../rcc/StatusBar";
import MenuItem from "../rcc/MenuItem";
import './CustomForm.css';

export type CustomFormPropsType = {
    title: string;
    token?: string;
} & Partial<BaseFormPropsType>;

export type CustomFormStateType = {
    message: string;
}

export default class TCustomForm<T extends CustomFormPropsType, S extends CustomFormStateType>
    extends BaseForm<T, S> {

    constructor(props: T) {
        super(props);
        this.state = { ...this.state, message: '' };
    }

    render() {
        return (
            <BaseForm title={this.props.title}>
                <MainNavigator >
                    {this.getMenus().map(item => item)}
                </MainNavigator>
                <div className='main'>
                    {this.getToolPanel()}
                    <div className='content'>
                        <MainMessage message={this.state.message} />
                        {this.getContentComponents()}
                        {this.getStatusBar(!this.isPhone)}
                    </div>
                </div>
                {this.getStatusBar(this.isPhone)}
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

    getStatusBar(isPhone: boolean): React.ReactNode {
        if (isPhone != this.isPhone)
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
        React.Children.map(this.props.children, (child) => {
            if (isValidElement(child)) {
                if (child.type == MenuItem) return;
                if (child.type == ToolPanel) return;
                if (child.type == StatusBar) return;
                items.push(child);
            }
        })
        return items;
    }

    get message(): string { return this.state.message }
    setMessage(value: string) { this.setState({ ...this.state, message: value }); return this; }
}
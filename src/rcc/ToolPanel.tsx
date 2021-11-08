import React from "react";
import WebControl from "./WebControl";
import styles from './ToolPanel.css'

type propsType = {
}

export default class ToolPanel extends WebControl<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className={styles.main}>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }
}

type itemPropsType = {
    title: string;
}

export class ToolItem extends WebControl<itemPropsType> {

    render() {
        return (
            <React.Fragment>
                <div className={styles.toolGroup}>
                    {this.props.title}
                </div>
                <div className={styles.toolItem}>
                    {React.Children.map(this.props.children, child => child)}
                </div>
            </React.Fragment>
        )
    }
}
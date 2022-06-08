import { DataRow } from "autumn-ui";
import React from "react";
import styles from "./Message.css"

export type messageTypeProps = {
    row: DataRow;
    hideName?: boolean;
    name: string,
    siteR?:boolean
}

export default abstract class Message<T extends messageTypeProps = messageTypeProps, S = {}> extends React.Component<T, S> {
    constructor(props: T) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={`${styles.main} ${ this.props.siteR?styles.msgRight:styles.msgLeft}`}>
            <div className={styles.imageBox}>{this.props.name.substring(this.props.name.length - 2)}</div>
            <div className={styles.message}>
                {this.getName()}
                {this.getMessage()}
            </div>
        </div>
    }

    getName() {
        if (!this.props.hideName)
            return <div style={{ 'paddingBottom': '3px' }}>{this.props.name}</div>
    }

    abstract getMessage(): JSX.Element;
}
import { DataRow } from "autumn-ui";
import React from "react";
import styles from "./Message.css"

export type messageTypeProps = {
    row: DataRow;
    hideName?: boolean;
    name: string,
    siteR?: boolean,
    systemMsg?: boolean,
    msgStatus?: string,
    mvClass?: string
    time?: string,
    reloadMessage?: Function
}

export default abstract class Message<T extends messageTypeProps = messageTypeProps, S = {}> extends React.Component<T, S> {
    constructor(props: T) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={`${styles.main} ${this.props.siteR ? styles.msgRight : styles.msgLeft}`}>
            <div className={styles.personBox}>
                <div className={styles.imageBox}>{this.props.name == '系统消息' ? '系统' : this.props.name.substring(this.props.name.length - 2)}</div>
                <div className={styles.person}>
                    <div>{this.props.name}</div>
                    <div style={{ 'paddingTop': '6px' }}>{this.props.time}</div>
                </div>
            </div>
            <div className={styles.message}>
                {this.getMessage()}
                {this.props.siteR ? this.getReadMsg() : ''}
            </div>
        </div>
    }
    //标记是否已读
    getReadMsg() {
        return <div style={{ marginTop: '4px', 'lineHeight': '1em' }}>
            <span className={styles.msgStatus}>{this.props.msgStatus == '1' ? '已读' : '未读'}</span>
        </div>
    }
    // 同意按钮
    agreeFun() {

    }
    //已读按钮
    readMsgFun() {

    }
    //刷新当前消息数据
    reload() {
        this.props.reloadMessage();
    }
    abstract getMessage(): JSX.Element;
}
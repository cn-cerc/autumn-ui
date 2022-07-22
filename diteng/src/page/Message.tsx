import { DataRow, WebControl } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import styles from "./Message.css"
import PageApi from "./PageApi";

export type messageTypeState = {
    showReport?: boolean
}

export type messageTypeProps = {
    row: DataRow;
    hideName?: boolean;
    name: string,
    isSelf?: boolean,
    systemMsg?: boolean,
    msgStatus?: string,
    mvClass?: string
    time?: string,
    reloadMessage?: Function
}

export default abstract class Message<T extends messageTypeProps = messageTypeProps, S extends messageTypeState = messageTypeState> extends WebControl<T, S> {
    state = {
        showReport: false
    } as S
    private touchEvent: any = null;
    constructor(props: T) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={`${styles.main} ${this.props.isSelf ? styles.msgRight : styles.msgLeft}`}>
            <div className={styles.personBox}>
                <div className={styles.imageBox}>{this.props.name == '系统消息' ? '系统' : this.props.name.substring(this.props.name.length - 2)}</div>
                <div className={styles.person}>
                    <div>{this.props.name}{this.props.row.getBoolean('FromCorp_') ? `@${this.props.row.getString('FromCorp_')}` : ''}</div>
                    <div style={{ 'paddingTop': '6px' }}>{this.props.time}</div>
                </div>
            </div>
            <div className={styles.message}>
                <div className={this.state.showReport ? styles.reportLine : ''} onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleClear.bind(this)} onMouseDown={this.handleTouchStart.bind(this)} onMouseUp={this.handleClear.bind(this)}>
                    {this.getMessage()}
                </div>
                {this.props.isSelf ? this.getReadMsg() : ''}
            </div>
            {this.getToastBox()}
        </div>
    }

    getToastBox() {
        if (this.state.showReport)
            return <div className={styles.toastBox}>
                <div className={styles.toast}>
                    <p>是否对该条消息进行举报！</p>
                    <div>
                        <span onClick={() => this.setState({ showReport: false })}>取消</span>
                        <span onClick={this.handleReport.bind(this)}>确定</span>
                    </div>
                </div>
            </div>
    }

    handleTouchStart() {
        this.touchEvent = setTimeout(() => {
            this.touchEvent = 0;
            this.setState({
                showReport: true
            })
        }, 500);
    }

    handleClear() {
        clearTimeout(this.touchEvent);
        this.touchEvent = null;
    }

    //举报消息
    async handleReport() {
        let dataOut = await PageApi.messageReport(new DataRow().setValue('uid', this.props.row.getString('UID_')));
        if (dataOut.state <= 0)
            showMsg(dataOut.message);
        else
            showMsg('已对该条消息进行举报，请耐心等待系统的处理。');
        this.setState({
            showReport: false
        })
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
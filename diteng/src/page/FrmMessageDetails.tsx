import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";

type FrmMessageDetailsTypeProps = {
    fromUser: string,
    date: string,
    name: string,
    userCode: string,
    userName: string
}

type FrmMessageDetailsTypeState = {
    messageData: DataSet,
    messageText: string,
    showQuicReply: boolean,
    sendText:string
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            messageData: new DataSet(),
            messageText: '',
            showQuicReply: false,
            sendText:'' //需要发送的消息
        }
    }

    componentDidMount(): void {
        this.getMessageData();
    }

    async getMessageData() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', this.props.date);
        let messageData = await PageApi.getMessageDetails(row);
        this.setState({
            messageData
        }, () => {
            this.scrollBottom();
        })
    }

    render(): React.ReactNode {
        return <div className={styles.details}>
            {this.getMessageList()}
            <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                <textarea value={this.state.messageText} onChange={(e) => {
                    this.setState({
                        messageText: e.target.value,
                        sendText: e.target.value
                    })
                }}></textarea>
                <div>
                    <div className={`${this.state.showQuicReply ? styles.show : styles.hide} ${styles.quicReplyBox}`}>
                        {this.getQuicReplyList()}
                    </div>
                    <button className={`${this.props.fromUser ? '' : styles.disEvents} ${styles.quicReplyBtn}`} onClick={this.openQuicReplyList.bind(this)}>+</button>
                    <button className={this.props.fromUser ? '' : styles.disEvents}>发送</button>
                </div>
            </form>
        </div>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false;
            let name = this.props.name;
            if (ds.getString('FromUser_') == this.props.userCode) {
                siteR = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            list.push(<li key={ds.recNo} className={styles.messageLeft}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                <DefaultMessage row={ds.current} code='Content_' name={name} hideName={true} siteR={siteR} systemMsg={systemMsg}></DefaultMessage>
            </li>)
        }
        return <ul className={styles.messageList}>{list}</ul>
    }

    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    async handleSubmit(e: any) {
        e.preventDefault();
        let row = new DataRow();
        row.setValue('ToUser_', this.props.fromUser).setValue('Content_', this.state.sendText);
        let dataOut = await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
            sendText:''
        })
        this.getMessageData();
    }

    scrollBottom() {
        var el = document.getElementsByClassName(styles.messageList)[0];
        //@ts-ignore
        el.scrollTop = el.scrollHeight;
    }

    getQuicReplyList() {
        return <ul>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>收到！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>谢谢！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>等等马上到！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>快点吧，我等到花儿都谢了！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>快点吧，我等到花儿都谢了！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>快点吧，我等到花儿都谢了！</li>
        </ul>
    }

    quicReplySend(e: any) {
        this.setState({
            sendText: e.target.innerText
        }, () => {
            this.handleSubmit(e);
            this.openQuicReplyList();
        })
    }

    openQuicReplyList() {
        this.setState({
            showQuicReply: !this.state.showQuicReply
        })
    }
}
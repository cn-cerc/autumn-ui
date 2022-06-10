import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import TaskMessage from "./TaskMessage";

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
    sendText:string,
    quicReplyList:Array<{text:string,uid:string}>
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            messageData: new DataSet(),
            messageText: '',
            showQuicReply: false,
            sendText:'', //需要发送的消息
            quicReplyList:[],
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
                    <span className={`${this.props.fromUser ? '' : styles.disEvents} ${styles.quicReplyBtn}`} onClick={this.openQuicReplyList.bind(this)}>+</span>
                    <button className={this.props.fromUser && this.state.messageText != '' ? '' : styles.disEvents}>发送</button>
                </div>
            </form>
        </div>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        let temp:number;
        let showFalg:boolean = false;
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false,msgStatus=ds.getString('Subject_');
            let name = this.props.name;
            if (ds.getString('FromUser_') == this.props.userCode) {
                siteR = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            let mvClass = ds.getString('MVClass_'); //消息类别
            temp = new Date(ds.getString('AppDate_')).getTime();
            let messageName;
            switch (mvClass) {
                case 'MVTask':
                    messageName = TaskMessage;
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            list.push(<li key={ds.recNo}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    hideName: false,
                    siteR,
                    msgStatus
                })}
                {/* <SignMessage row={ds.current} name={name} hideName={false} siteR={siteR}></SignMessage> */}
                {/* <DefaultMessage row={ds.current} code='Content_' name={name} hideName={false} siteR={siteR} systemMsg={systemMsg} msgStatus={ds.getString('Status_')} mvClass={mvClass}></DefaultMessage> */}
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
        if(this.state.sendText == '') return false;
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
        let datalist = this.state.quicReplyList;
        let List:any = [];
        datalist.forEach((item)=>{
            List.push(<li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)} key={item.uid}>{item.text}</li>);
        })
        return <ul>
            {List}
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
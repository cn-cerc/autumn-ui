import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import ExportMessage from "./ExportMessage";
import styles from "./FrmMessage.css";
import NoticeMessage from "./NoticeMessage";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import TaskMessage from "./TaskMessage";
import { timing } from "./FrmMessage";

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
    quicReplyList:Array<{text:string,uid:string}>,
    HistoricalRecordsDay:number,
    HistoricalRecordsFlag:boolean,
    HistoricalRecordsList:DataSet,
    scrollFlag:boolean,
    scrollHeightNub:number,
    timing:number
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            timing:timing,
            messageData: new DataSet(),
            messageText: '',
            showQuicReply: false,
            sendText:'', //需要发送的消息
            quicReplyList:[],
            HistoricalRecordsDay:1,     //获取前面第几天的数据
            HistoricalRecordsFlag:false,    //控制是否累加消息
            HistoricalRecordsList:new DataSet(),     //保存历史记录List
            scrollFlag:true,    //标记是否需要将聊天区域自动滚动到底部
            scrollHeightNub:0,  //记录最新高度
        }
    }

    componentDidMount(): void {
        this.getMessageData();
        this.startTimer();
    }

    async getMessageData() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', this.props.date);
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
        messageData.appendDataSet(this.state.HistoricalRecordsList);
        messageData.appendDataSet(ds);
        this.setState({
            HistoricalRecordsFlag:false,
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
            let siteR = false, systemMsg = false,msgStatus=ds.getString('Status_');
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
                case 'MVNotice':
                    messageName = NoticeMessage;
                    break;
                case 'MVTask':
                    messageName = TaskMessage;
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                case 'MVExport':
                    messageName = ExportMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            let date = new Date(ds.getString('AppDate_'));
            let h: number | string = date.getHours();
            if (h < 10)
                h = '0' + h;
            let m: number | string = date.getMinutes();
            if (m < 10)
                m = '0' + m;
            let s: number | string = date.getSeconds();
            if (s < 10)
                s = '0' + s;
            list.push(<li key={ds.recNo}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    time: `${h}:${m}:${s}`,
                    hideName: false,
                    siteR,
                    msgStatus
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e)=>{
            this.scrollEventFun(e);
        }}><li key="10-1" className={styles.historicalRecordsBox}><span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>查看更多记录</span></li>{list}</ul>
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
        if(this.state.scrollFlag){
            var el = document.getElementsByClassName(styles.messageList)[0];
            //@ts-ignore
            el.scrollTop = el.scrollHeight;
            this.setState({
                scrollHeightNub:el.scrollHeight
            })
        }
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

    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun(){
        let date:any;
        var nowTime = new Date().getTime() - (this.state.HistoricalRecordsDay * 24 * 60 * 60 * 1000);
        var now = new Date(nowTime);
        var yyyy = now.getFullYear();
        var m:any = now.getMonth()+1;
        var day:any = now.getDate();
        if(m<10) m = '0'+m;
        if(day<10) day = '0'+day;
        date = yyyy+'-'+m+'-'+day;
        let row = new DataRow();
        let HistoricalRecordsList = new DataSet();
        row.setValue('FromUser_', this.props.userCode).setValue('Date_', date);
        let messageData = await PageApi.getMessageDetails(row);
        HistoricalRecordsList.appendDataSet(messageData);
        HistoricalRecordsList.appendDataSet(this.state.HistoricalRecordsList);
        this.setState({
            HistoricalRecordsFlag:true,
            HistoricalRecordsList,
            HistoricalRecordsDay : this.state.HistoricalRecordsDay + 1
        },()=>{
            this.getMessageData();
            console.log(this.state.HistoricalRecordsList);
        });
    }
    
    //自动滚动功能
    scrollEventFun(e: any){
        let scrollHeight = e.target.scrollTop + e.target.offsetHeight;
        if(scrollHeight < this.state.scrollHeightNub){
            this.setState({
                scrollFlag:false,
                scrollHeightNub:e.target.scrollHeight
            })
        }else{
            this.setState({
                scrollFlag:true,
                scrollHeightNub:e.target.scrollHeight
            })
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getMessageData();
        }, this.state.timing * 1000)
    }
}
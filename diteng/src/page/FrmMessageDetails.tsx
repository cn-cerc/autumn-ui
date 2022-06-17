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
import SubscribeMessage from "./SubscribeMessage";

type FrmMessageDetailsTypeProps = {
    fromUser: string,
    date: string,
    name: string,
    userCode: string,
    userName: string
}

type FrmMessageDetailsTypeState = {
    messageData: DataSet,
    date: string,
    lastDate: string
    messageText: string,
    showQuicReply: boolean,
    quicReplyList: Array<{ text: string, uid: string }>,
    leaveBottom: number,
    timing: number
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            timing: timing,
            messageData: new DataSet(),
            messageText: '',        //需要发送的消息
            showQuicReply: false,       // 是否展示快捷发送
            quicReplyList: [],      // 快捷发送列表
            date: this.props.date,
            lastDate: this.props.date,
            leaveBottom: 0
        }
    }

    componentDidMount(): void {
        this.getFirstMessageDate();
        // this.getQuicReplyListFun();
        this.startTimer();
    }

    componentWillUnmount(): void {
        clearInterval(this.timer);
    }

    async getFirstMessageDate() {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', this.state.lastDate);
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
        messageData.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            if (messageData.locate('UID_', ds.getString('UID_'))) {
                messageData.copyRecord(ds.current);
            } else {
                messageData.append();
                messageData.copyRecord(ds.current);
            }
        }
        messageData.setSort('AppDate_');
        this.setState({
            messageData
        }, () => {
            this.initMessageScroll();
        })
    }

    async getMessageData(date: string) {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.fromUser).setValue('Date_', date);
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
        messageData.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            if (messageData.locate('UID_', ds.getString('UID_'))) {
                messageData.copyRecord(ds.current);
            } else {
                messageData.append();
                messageData.copyRecord(ds.current);
            }
        }
        messageData.setSort('AppDate_');
        this.setState({
            messageData,
            date
        }, () => {
            this.initMessageScroll();
        })
    }

    render(): React.ReactNode {
        return <div className={styles.details}>
            {this.getMessageList()}
            <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                <textarea value={this.state.messageText} onChange={(e) => {
                    this.setState({
                        messageText: e.target.value,
                    })
                }}></textarea>
                <div>
                    <div className={`${this.state.showQuicReply ? styles.show : styles.hide} ${styles.quicReplyBox}`}>
                        {this.getQuicReplyList()}
                    </div>
                    {/* <span className={`${this.props.fromUser ? '' : styles.disEvents} ${styles.quicReplyBtn}`} onClick={this.openQuicReplyList.bind(this)}>+</span> */}
                    <button className={this.props.fromUser && this.state.messageText != '' ? '' : styles.disEvents}>发送</button>
                </div>
            </form>
        </div>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        let temp: number;
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false, msgStatus = ds.getString('Status_');
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
                case 'MVSubscribe':
                    messageName = SubscribeMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            list.push(<li key={ds.recNo}>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    time: ds.getString('AppDate_'),
                    hideName: false,
                    siteR,
                    msgStatus
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e) => {
            this.scrollEventFun(e);
        }}><li key="10-1" className={styles.historicalRecordsBox}>{this.getHistoryBtn()}</li>{list}</ul>
    }

    getHistoryBtn() {
        if (this.moreThanOneMonth(this.state.date)) {
            return <span className={styles.noHistory}>暂无更多历史消息</span>
        } else {
            return <span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>获取更多历史消息</span>;
        }
    }

    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    async handleSubmit(e: any) {
        if (this.state.messageText == '') return false;
        e.preventDefault();
        let row = new DataRow();
        row.setValue('ToUser_', this.props.fromUser).setValue('Content_', this.state.messageText);
        await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
        })
    }

    // 设置聊天区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.messageList)[0] as HTMLDivElement;
        el.scrollTop = el.scrollHeight - this.state.leaveBottom;
    }

    //获取快捷回复列表
    async getQuicReplyListFun() {
        let quicReplyList: Array<{ text: string, uid: string }> = [];
        let row = new DataRow();
        let dataOut = await PageApi.getQuickReplyList(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        while (ds.fetch()) {
            quicReplyList.push({ text: ds.getString('reply_content_'), uid: ds.getString('uid_') });
        }
        this.setState({ quicReplyList });
    }

    getQuicReplyList() {
        let datalist = this.state.quicReplyList;
        console.log(datalist)
        let list: any = [];
        datalist.forEach((item) => {
            list.push(<li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)} key={item.uid}>{item.text}</li>);
        })
        return <ul>
            {list}
        </ul>
    }

    quicReplySend(e: any) {
        this.setState({
            messageText: e.target.innerText
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
    async getHistoricalRecordsFun() {
        let beginTimer = new Date(this.state.date).getTime();
        let endTimer = beginTimer - (24 * 60 * 60 * 1000 * 7);
        let date = new Date(endTimer);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let date_ = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        let dataOut = await this.getHistoryData(date_);
        console.log(dataOut.size)
        if (dataOut.size <= 0 && !this.moreThanOneMonth(date_)) {
            this.setState({
                date: date_
            }, () => {
                console.log('我要触发了')
                this.getHistoricalRecordsFun();
            })
        } else {
            let ds = new DataSet();
            ds.appendDataSet(this.state.messageData);
            dataOut.first();
            while (dataOut.fetch()) {
                if (ds.locate('UID_', dataOut.getString('UID_'))) {
                    ds.copyRecord(dataOut.current);
                } else {
                    ds.append();
                    ds.copyRecord(dataOut.current);
                }
            }
            ds.setSort('AppDate_');
            this.setState({
                messageData: ds,
                date: date_
            }, () => {
                this.initMessageScroll();
            });
        }
    }

    moreThanOneMonth(date: string) {
        let date_ = new Date(date);
        let year_ = date_.getFullYear();
        let month_ = date_.getMonth() + 1;
        let day_ = date_.getDate();
        let _date = new Date();
        let _year = _date.getFullYear();
        let _month = _date.getMonth() + 1;
        let _day = _date.getDate();
        let bool = true;
        if (year_ == _year && month_ == _month)
            bool = false;
        else if (year_ == year_ && month_ != _month && day_ >= _day)
            bool = false
        else if (year_ != year_ && month_ == 12 && _month == 1 && day_ >= _day)
            bool = false;
        return bool;
    }

    // 获取历史消息
    async getHistoryData(date: string) {
        let row = new DataRow();
        row.setValue('FromUser_', this.props.userCode).setValue('Date_', date);
        let dataOut = await PageApi.getMessageDetails(row);
        return dataOut;
    }

    //自动滚动功能
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        this.setState({
            leaveBottom: el.scrollHeight - el.scrollTop
        })
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getFirstMessageDate();
        }, this.state.timing * 1000)
    }
}
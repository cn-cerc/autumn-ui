import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";

type FrmMessageTypeProps = {
    fromUser?: string
}

type FrmMessageTypeState = {
    timing: number,
    contactData: DataSet,
    messageData: DataSet,
    currentContact: number,
    contactName: string,
    contactDate: string,
    fromUser: string,
    messageText: string,
    showMessage: boolean
}

export default class FrmMessage extends WebControl<FrmMessageTypeProps, FrmMessageTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageTypeProps) {
        super(props);
        let fromUser = this.props.fromUser || null;
        let showMessage = this.isPhone ? false : true;
        this.state = {
            timing: 15,
            contactData: new DataSet(),     //联系人DataSet
            messageData: new DataSet(),     //消息列表DataSet
            currentContact: this.isPhone ? -1 : 0,      //当前选中的联系人下标
            contactName: '',        //当前选中的联系人名称
            contactDate: '',        //当前选中人消息查询的日期
            fromUser,       //当前选中的联系人Code字段
            messageText: '',        //当前输入的消息
            showMessage,        //是否展示消息列表
        }
    }

    componentDidMount(): void {
        this.initData();
        this.startTimer();
    }

    componentWillUnmount(): void {
        this.removeTimer();
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getContactList()}
            {this.getMessageBox()}
        </div>
    }

    async initData() {
        await this.getContactData();
        let ds = new DataSet();
        ds.appendDataSet(this.state.contactData);
        ds.first();
        let fromUser = ds.getString('AppUser_');
        let date = ds.getString('LatestDate_');
        let contactName = ds.getString('Name_');
        if (!this.isPhone)
            this.getMessageData(fromUser, date, contactName, 0);
    }

    async getContactData() {
        let contactData = await PageApi.getContactList();
        this.setState({
            contactData
        })
    }

    async getMessageData(fromUser: string, date: string, name: string, num: number) {
        let row = new DataRow();
        row.setValue('FromUser_', fromUser).setValue('Date_', date);
        let messageData = await PageApi.getMessageDetails(row);
        this.setState({
            currentContact: num,
            messageData,
            contactName: name,
            fromUser: fromUser,
            contactDate: date
        });
    }

    getContactList() {
        if (!this.isPhone || !this.state.showMessage) {
            let list = [];
            let ds = new DataSet();
            ds.appendDataSet(this.state.contactData);
            ds.first();
            while (ds.fetch()) {
                let name = ds.getString('Name_') || '未知发件人';
                let date = new Date(ds.getString('LatestDate_'));
                let hour = date.getHours();
                let seconds: string | number = date.getSeconds();
                let num = ds.recNo - 1;
                if (seconds < 10)
                    seconds = '0' + seconds;
                list.push(<li key={ds.recNo} className={num == this.state.currentContact ? styles.selectContact : ''} onClick={this.handleClick.bind(this, ds.getString('AppUser_'), ds.getString('LatestDate_'), name, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                            <span>{`${hour}:${seconds}`}</span>
                        </div>
                        <div>{ds.getString('LatestMessage_')}</div>
                    </div>
                </li>);
            }
            return <ul className={styles.contactList}>{list}</ul>
        }
    }

    getMessageBox() {
        if (this.state.showMessage) {
            return <div className={styles.messageBox}>
                <div className={styles.messageTitle}>
                    <span>{this.state.contactName}</span>
                    {/* <img src=""></img> */}
                </div>
                {this.getMessageList()}
                <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                    <textarea value={this.state.messageText} onChange={(e) => {
                        this.setState({
                            messageText: e.target.value
                        })
                    }}></textarea>
                    <div>
                        <button>发送(S)</button>
                    </div>
                </form>
            </div>
        }
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            list.push(<li key={ds.recNo} className={styles.messageLeft}>
                <DefaultMessage row={ds.current} code='Content_' name={this.state.contactName} hideName={true}></DefaultMessage>
            </li>)
        }
        return <ul className={styles.messageList}>{list}</ul>
    }

    handleClick(fromUser: string, date: string, name: string, num: number) {
        if (!this.isPhone)
            this.getMessageData(fromUser, date, name, num);
        else {
            location.href = `./FrmNewMessage.details?fromUser=${fromUser}&date=${date}&name=${name}`
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getMessageData(this.state.fromUser, this.state.contactDate, this.state.contactName, this.state.currentContact);
        }, this.state.timing * 1000)
    }

    removeTimer() {
        clearInterval(this.timer);
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
        row.setValue('ToUser_', this.state.fromUser).setValue('Content_', this.state.messageText);
        let dataOut = await PageApi.replyMessage(row);
        console.log(dataOut)
    }
}
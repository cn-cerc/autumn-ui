import { DataRow, DataSet, WebControl } from "autumn-ui";
import React, {useRef} from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";

type FrmMessageTypeProps = {
    fromUser?: string,
    userCode:string,
    userName:string
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
            timing: 5,
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
            {this.getUserInfo()}
        </div>
    }

    async initData() {
        await this.getContactData();
        let ds = new DataSet();
        ds.appendDataSet(this.state.contactData);
        ds.first();
        let fromUser = ds.getString('FromUser_');
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
        this.scrollBottom();
    }

    getContactList() {
        if (!this.isPhone || !this.state.showMessage) {
            let list = [];
            let ds = new DataSet();
            ds.appendDataSet(this.state.contactData);
            ds.first();
            while (ds.fetch()) {
                let name = ds.getString('Name_') || '系统消息';
                let date = new Date(ds.getString('LatestDate_'));
                let hour = date.getHours();
                let Minut: string | number = date.getMinutes()
                let num = ds.recNo - 1;
                if (Minut < 10)
                Minut = '0' + Minut;
                list.push(<li key={ds.recNo} className={num == this.state.currentContact ? styles.selectContact : ''} onClick={this.handleClick.bind(this, ds.getString('FromUser_'), ds.getString('LatestDate_'), name, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                            <span>{`${hour}:${Minut}`}</span>
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
                        <button className={this.state.fromUser?'':styles.disEvents}>发送(S)</button>
                    </div>
                </form>
            </div>
        }
    }

    getUserInfo(){
        return <div className={styles.suerInfoBox}>
            <div>用户详细信息</div>
            <div>快速回复</div>
        </div>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false;
            let name = this.state.contactName;
            if(ds.getString('AppUser_') == this.props.userCode){
                siteR = true;
                name = this.props.userName;
            }
            list.push(<li key={ds.recNo} className={styles.messageLeft}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                <DefaultMessage row={ds.current} code='Content_' name={name} hideName={false} siteR={siteR}></DefaultMessage>
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
        this.setState({
            messageText:''
        })
        this.getMessageData(this.state.fromUser, this.state.contactDate, this.state.contactName, this.state.currentContact);
        this.getContactData();
        console.log(dataOut)
    }
    
    scrollBottom(){
        var el = document.getElementsByClassName(styles.messageList)[0];
        //@ts-ignore
        el.scrollTop = el.scrollHeight;
    }
}
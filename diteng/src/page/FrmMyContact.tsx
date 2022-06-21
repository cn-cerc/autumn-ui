import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import styles from "./FrmMyContact.css";
import PageApi from "./PageApi";


type FrmMyContactTypeProps = {

}

type FrmMyContactTypeState = {
    searchType: Array<string>,
    searchTypeIndex: number,
    messageDataList: messageDetail[],
    AllMessageDetail: AllMessageDetail[],
    currentUserId: string,
    AllContactList: DataSet
}

type messageDetail = {
    data: DataSet,
    latestDate: string,
    latestMessage: string,
    date: string,
    fromBottom: number,
    fromUser: string,
    name: string,
};

type AllMessageDetail = {
    data: DataSet,
    fromBottom: number,
    fromUser: string,
    name: string,
};

export default class FrmMyContact extends WebControl<FrmMyContactTypeProps, FrmMyContactTypeState>{
    constructor(props: FrmMyContactTypeProps) {
        super(props);
        this.state = {
            searchType: ['公司同事', '客户清单', '厂商清单', '其他人员'],
            searchTypeIndex: null,
            messageDataList: [{
                data: new DataSet(),
                latestDate: '',
                latestMessage: '',
                date: '',
                fromBottom: 0,
                fromUser: '',
                name: '',
            }],     //消息列表DataSet
            AllMessageDetail: [{
                data: new DataSet(),
                fromBottom: 0,
                fromUser: '',
                name: '',
            }],     //消息列表DataSet
            currentUserId: null,
            AllContactList: new DataSet(),
        }
    }

    componentDidMount(): void {
        this.initGroup();
        this.initData();
    }

    initGroup() {
        let AllMessageDetail: AllMessageDetail[] = [];
        this.state.searchType.forEach((item, index) => {
            AllMessageDetail.push({
                data: new DataSet(),
                fromBottom: 0,
                fromUser: '',
                name: ''
            })
        })
        if (!this.isPhone) {
            this.setState({
                AllMessageDetail,
                searchTypeIndex: 0
            }, () => {
                this.handleClickGroup(0);
            })
        }
    }

    componentWillUnmount(): void {

    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getContactListDOM()}
            {this.getRightBox()}
        </div>
    }

    // 初始化页面数据加载
    async initData() {
        let messageDataList = await this.getContactFirstData();
        let currentUserId = messageDataList[0].fromUser;
        this.setState({
            messageDataList,
        })
    }

    // 第一次获取联系人列表数据
    async getContactFirstData() {
        let dataOut = await PageApi.getContactList();
        dataOut.setSort('LatestDate_ DESC');
        dataOut.first();
        let messageDataList: messageDetail[] = [];
        let allUnReadNum = 0;
        while (dataOut.fetch()) {
            let latestDate = dataOut.getString('LatestDate_');
            let date_ = new Date(latestDate);
            let year_ = date_.getFullYear();
            let month_ = date_.getMonth() + 1;
            let day_ = date_.getDate();
            let unReadNum = dataOut.getDouble('UnReadNum_');
            messageDataList.push({
                data: new DataSet(),
                latestDate,
                latestMessage: dataOut.getString('LatestMessage_'),
                date: `${year_}-${month_ < 10 ? '0' + month_ : month_}-${day_ < 10 ? '0' + day_ : day_}`,
                fromBottom: 0,
                fromUser: dataOut.getString('FromUser_'),
                name: dataOut.getString('Name_'),
            })
            allUnReadNum += unReadNum;
        }
        this.setHeaderMessageNum(allUnReadNum);
        return messageDataList;
    }

    setHeaderMessageNum(num: number) {
        //@ts-ignore
        setHeaderMessageNum(num);
    }

    // 获取联系人JSX结构
    getContactListDOM() {
        let list = [];
        for (let i = 0; i < this.state.searchType.length; i++) {
            let name = this.state.searchType[i];
            let num = i;
            list.push(<li key={num} className={i == this.state.searchTypeIndex ? styles.selectContact : ''} onClick={this.handleClickGroup.bind(this, num)}>
                <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                <div>
                    <div className={styles.contactTitle}>
                        <span>{name}</span>
                        {this.isPhone ? <span><img src="images/icon/arrow-right.png" /></span> : ''}
                    </div>
                </div>
            </li>);
        }
        return <ul className={styles.contactList}>
            <li>
                <div className={styles.title}>
                    所有联系人
                    <button className={styles.addContactBtn} onClick={this.handleClickToAdd.bind(this)}>新增联系人</button>
                </div>
            </li>
            {list}
            <li>
                <div className={styles.title}>最近联系人</div>
            </li>
            {this.getNearestContactList()}
        </ul>
    }

    // 获取最近联系人JSX结构
    getNearestContactList() {
        let list = [];
        for (let i = 0; i < this.state.messageDataList.length; i++) {
            let messageData = this.state.messageDataList[i];
            let name = messageData.name || '系统消息';
            let num = i;
            if(name == '系统消息') continue;
            list.push(<li key={num} className={messageData.fromUser == this.state.currentUserId ? styles.selectContact : ''} onClick={this.handleClick.bind(this, messageData.latestDate, messageData.fromUser)}>
                <div className={styles.contactImage}>{name == '系统消息' ? '系统' : name.substring(name.length - 2)}</div>
                <div>
                    <div className={styles.contactTitle}>
                        <span>{name}</span>
                    </div>
                    <div>{messageData.latestMessage}</div>
                </div>
            </li>);
            
        }
        return list
    }

    //点击所有联系人分组事件
    async handleClickGroup(num: number) {
        if (num === null) return;
        if (!this.isPhone) {
            let AllMessageDetail = this.state.AllMessageDetail;
            let row = new DataRow();
            row.setValue('type', num).setValue('MaxRecord_', 100);
            let dataOut = await PageApi.searchBook(row);
            AllMessageDetail[num].data = dataOut;
            this.setState({
                currentUserId: null,
                searchTypeIndex: num,
                AllMessageDetail
            })
            this.initMessageScroll();
        } else {
            location.href = `./FrmMyContact.AllDetails?searchType=${this.state.searchTypeIndex}`
        }
    }

    // 点击最近联系人触发的事件
    async handleClick(date: string, id: string, name: string) {
        this.setState({
            currentUserId: id,
            searchTypeIndex: null
        })
        let messageData = this.getMessageDataByCode(id);
        if (!this.isPhone) {
            location.href = `./FrmMyMessage?toUser=${id}&date=${date}&name=${name}`
        } else {
            location.href = `./FrmMyMessage.details?fromUser=${messageData.fromUser}&toUser=${messageData.fromUser}&date=${date}&name=${messageData.name}`
        }

    }

    // 通过联系人ID获取下标
    getMessageDataByCode(id: string) {
        let messageData = null;
        for (let i = 0; i < this.state.messageDataList.length; i++) {
            if (this.state.messageDataList[i].fromUser == id) {
                messageData = this.state.messageDataList[i];
                break;
            }
        }
        if (messageData == null)
            messageData = this.state.messageDataList[0];
        return messageData
    }

    //获取右边分组联系人列表
    getRightBox() {
        if (!this.isPhone && this.state.searchTypeIndex != null) {
            let ds = new DataSet();
            ds = this.state.AllMessageDetail[this.state.searchTypeIndex].data;
            let list = [];
            ds.first();
            while (ds.fetch()) {
                let name = ds.getString('name_');
                let userCode = ds.getString('user_code_');
                if(userCode == '') continue;
                let text = ds.getString('corp_name_');
                list.push(<li key={userCode}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                        </div>
                        <div>{text}</div>
                    </div>
                    <div className={styles.rightBtnContent}>
                        <button className={styles.rightBoxSendBtn} onClick={this.handleClick.bind(this, ds.getString('update_time_'), userCode, name)}>发送消息</button>
                    </div>
                </li>);
            }
            return <ul className={styles.AllContactList} onScroll={(e) => {
                this.scrollEventFun(e);
            }}>
                {list}
            </ul>
        }
    }

    handleClickToAdd(){
        location.href = `./FrmMyContact.append`
    }

    // 设置右边区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.AllContactList)[0] as HTMLDivElement;
        let AllMessageDetail = this.state.AllMessageDetail[this.state.searchTypeIndex];
        el.scrollTop = AllMessageDetail.fromBottom;
    }

    // 右边区域滚动事件
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        let AllMessageDetail = this.state.AllMessageDetail[this.state.searchTypeIndex];
        AllMessageDetail.fromBottom = el.scrollTop;
        this.setState(this.state);
    }
}
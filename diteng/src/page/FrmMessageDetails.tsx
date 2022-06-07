import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";

type FrmMessageDetailsTypeProps = {
    fromUser: string,
    date: string,
    name: string
}

type FrmMessageDetailsTypeState = {
    messageData: DataSet,
    messageText: string
}

export default class FrmMessageDetails extends WebControl<FrmMessageDetailsTypeProps, FrmMessageDetailsTypeState> {
    constructor(props: FrmMessageDetailsTypeProps) {
        super(props);
        this.state = {
            messageData: new DataSet(),
            messageText: ''
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
        })
    }

    render(): React.ReactNode {
        return <div className={styles.details}>
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

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            list.push(<li key={ds.recNo} className={styles.messageLeft}>
                <DefaultMessage row={ds.current} code='Content_' name={this.props.name} hideName={true}></DefaultMessage>
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
        row.setValue('ToUser_', this.props.fromUser).setValue('Content_', this.state.messageText);
        let dataOut = await PageApi.replyMessage(row);
        console.log(dataOut)
    }
}
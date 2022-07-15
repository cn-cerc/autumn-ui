import { DataRow, DataSet } from "autumn-ui";
import DialogApi from "../dialog/DialogApi";

export default class PageApi {
    /** 获取联系人列表 */
    static getContactList() {
        return DialogApi.getServiceByCenter('SvrMessages.messageSessions');
    }

    /** 获取消息详情 */
    static getMessageDetails(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrMessages.messageDetail', params);
    }

    /** 回复消息 */
    static replyMessage(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrMessages.sendTo', params);
    }

    /** 回复图片消息 */
    static replyImageMessage(params: FormData) {
        return fetch(`FrmMyMessage.sendImg?sid=${DialogApi.getToken()}`, {
            method: 'POST', body: params,
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            let dataOut = new DataSet();
            dataOut.setJson(JSON.stringify(json));
            return dataOut.getPromise();
        })
    }

    /** 获取用户备注 */
    static getUserRemark(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrUserRemark.userRemark', params);
    }

    /** 设置用户备注 */
    static setUserRemark(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrUserRemark.setUserRemark', params);
    }

    /** 获取快速回复列表 */
    static getQuickReplyList(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrQuickReply.list', params);
    }

    /** 设置快速回复 */
    static setQuickReplyItem(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrQuickReply.setReplyContent', params);
    }

    /** 删除快速回复 */
    static delQuickReplyItem(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrQuickReply.delReplyContent', params);
    }

    /** 获取客户详细信息 */
    static fromDetail(params: DataRow) {
        return DialogApi.getDataOutByCenter('ApiUserInfo.fromDetail', params);
    }

    /** 获取通讯录所有联系人分组列表的人员 */
    static searchBook(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrAddressBook.search', params);
    }

    /** 接收类消息操作接口 */
    static acknowledge(serviceCode: string, params: DataRow) {
        return DialogApi.getDataOut(serviceCode, params);
    }

    /** 消息举报 */
    static messageReport(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrMessageReport.reportMessage', params);
    }

    /** 清除某人未读消息 */
    static cleanUnread(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrMessages.cleanUnread', params)
    }

    /** 创建群聊 */
    static createGroup(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrMessages.createGroup', params);
    }

}
import { DataRow } from "autumn-ui";
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

}
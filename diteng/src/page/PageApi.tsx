import { DataRow } from "autumn-ui";
import DialogApi from "../dialog/DialogApi";

export default class PageApi {
    /** 获取联系人列表 */
    static getContactList() {
        return DialogApi.getService('SvrMessages.messageSessions');
    }

    /** 获取消息详情 */
    static getMessageDetails(params: DataRow) {
        return DialogApi.getDataOut('SvrMessages.messageDetail', params);
    }

    /** 回复消息 */
    static replyMessage(params: DataRow) {
        return DialogApi.getDataOut('SvrMessages.sendTo', params);
    }

    /** 获取用户备注 */
    static getUserRemark(params: DataRow) {
        return DialogApi.getDataOut('SvrUserRemark.userRemark', params);
    }

    /** 设置用户备注 */
    static setUserRemark(params: DataRow) {
        return DialogApi.getDataOut('SvrUserRemark.setUserRemark', params);
    }
}
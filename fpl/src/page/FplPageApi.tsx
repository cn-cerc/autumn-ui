import { DataRow } from "autumn-ui";
import FplDialogApi from "../dialog/FplDialogApi";

export default class FplPageApi {
    /** 获取司机接单列表 */
    static getDriverAllOrder() {
        return FplDialogApi.getService('SvrDriverArrangeCar.search');
    }

    /** 获取派车单详情 */
    static getDriverArrangeCarDetail(params: DataRow) {
        return FplDialogApi.getDataOut('SvrDriverArrangeCar.download', params);
    }

    /** 获取未接货单详情 */
    static getCargoOrderDetail(params: DataRow) {
        return FplDialogApi.getDataOut('SvrCargoOrder.downloadPhone', params);
    }
}
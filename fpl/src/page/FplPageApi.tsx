import { DataRow } from "autumn-ui";
import FplDialogApi from "../dialog/FplDialogApi";

export default class FplPageApi {
    /** 获取司机接单列表 */
    static getDriverAllOrder() {
        return FplDialogApi.getService('SvrDriverArrangeCar.search');
    }
}
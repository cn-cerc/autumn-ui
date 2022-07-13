import { DataRow } from "autumn-ui";
import FplDialogApi from "../dialog/FplDialogApi";

const SvrMaintainPartInfo = 'SvrMaintainPartInfo';
const SvrMaintainCusInfo = 'SvrMaintainCusInfo';
const SvrMaintainMA = 'SvrMaintainMA';

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

    /** 品牌数量（前五名） */
    static getPartByBrandReport() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartByBrandReport');
    }

    /** 零配件使用数量（前五） */
    static getPartToUse() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartToUse');
    }

    /** 零配件分类数量最多（前五） */
    static getPartByClass1Report() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartByClass1Report');
    }

    /** 当前存在的零配件的数量 */
    static getPartReport() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartReport');
    }

    /** 客户总数量、月结客户、现金结算（按月） */
    static getStatisticsByMonth() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getStatisticsByMonth');
    }

    /** 本月维修金额最多客户（前五） */
    static getCusByAmountReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getCusByAmountReport');
    }

    /** 本月维修车辆数量最多客户（前五） */
    static getCusByCodeToCountReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getCusByCodeToCountReport');
    }

    /** 超过一个月未来维修客户（前五） */
    static getMoreThanOneMonthReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getMoreThanOneMonthReport');
    }

    /** 待接收、已请款、付款中、已付款 */
    static getAccountReport() {
        return FplDialogApi.getService('SvrAccountsMS.getAccountReport');
    }

    /** 已生成月结款数量、未生成（按月） */
    static getMaintainByMonth() {
        return FplDialogApi.getService(SvrMaintainMA + '.getMaintainByMonth');
    }

    /** 维修单统计（12个月，每个月的维修单） */
    static getMaintainByMonthsReport() {
        return FplDialogApi.getService(SvrMaintainMA + '.getMaintainByMonthsReport');
    }

    /** 在途中车辆、空车、待发货 */
    static getMoreThanOneWeekReport() {
        return FplDialogApi.getService('SvrPCarRegistration.getMoreThanOneWeekReport');
    }

    /** 合同管理=> 获取审核充值记录统计 */
    static voucherStats() {
        return FplDialogApi.getService('SvrVoucher.voucherStats');
    }
    /** 合同管理=> 获取待接收合同数量统计 */
    static contractApplyStats() {
        return FplDialogApi.getService('SvrContract.contractApplyStats');
    }
     /** 合同管理=> 获取合同数量统计 */
     static contractStats() {
        return FplDialogApi.getService('SvrContract.contractStats');
    }

    /** 货运管理=> 货单统计 */
    static queryCargoReport() {
        return FplDialogApi.getService('SvrCargoOrder.queryCargoReport');
    }


}
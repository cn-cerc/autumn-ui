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
        return FplDialogApi.getDataOut('SvrDriverArrangeCar.downloadForPhone', params);
    }

    /** 确认接单 */
    static ConfirmOrder(params: DataRow) {
        return FplDialogApi.getDataOut('SvrDriverArrangeCar.downloadForPhone', params);
    }

    /** 零配件管理=> 品牌数量（前五名） */
    static getPartByBrandReport() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartByBrandReport');
    }
    /** 零配件管理=> 零配件使用数量（前五） */
    static getPartToUse() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartToUse');
    }
    /** 零配件管理=> 零配件分类数量最多（前五） */
    static getPartByClass1Report() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartByClass1Report');
    }
    /** 零配件管理=> 当前存在的零配件的数量 */
    static getPartReport() {
        return FplDialogApi.getService(SvrMaintainPartInfo + '.getPartReport');
    }

    /** 客户/维修 档案管理=> 客户总数量、月结客户、现金结算（按月） */
    static getCusByMonthReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getCusByMonthReport');
    }
    /** 客户/维修 档案管理=> 本月维修金额最多客户（前五） */
    static getCusByAmountReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getCusByAmountReport');
    }
    /** 客户/维修 档案管理=> 本月维修车辆数量最多客户（前五） */
    static getCusByCodeToCountReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getCusByCodeToCountReport');
    }
    /** 客户/维修 档案管理=> 超过一个月未来维修客户（前五） */
    static getMoreThanOneMonthReport() {
        return FplDialogApi.getService(SvrMaintainCusInfo + '.getMoreThanOneMonthReport');
    }

    /** 月结收款管理=> 待接收、已请款、付款中、已付款 */
    static getAccountReport() {
        return FplDialogApi.getService('SvrAccountsMS.getAccountReport');
    }
    /** 月结收款管理=> 已生成月结款数量、未生成（按月） */
    static getMaintainByMonth() {
        return FplDialogApi.getService(SvrMaintainMA + '.getMaintainByMonth');
    }
    /** 月结收款管理=> 维修单统计（12个月，每个月的维修单） */
    static getMaintainByMonthsReport() {
        return FplDialogApi.getService(SvrMaintainMA + '.getMaintainByMonthsReport');
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

    /**  车队与车辆管理=> 车辆状态统计 */
    static getFleetDrivrCarPayeeReport() {
        return FplDialogApi.getService('SvrPCarRegistration.getFleetDrivrCarPayeeReport');
    }
    /** 车队与车辆管理=> 车队与车辆类型 */
    static getFleetCarCountReport() {
        return FplDialogApi.getService('SvrPCarRegistration.getFleetCarCountReport');
    }
    /** 车队与车辆管理/货运管理=> 在途中车辆、空车、待发货 */
    static getMoreThanOneWeekReport() {
        return FplDialogApi.getService('SvrPCarRegistration.getMoreThanOneWeekReport');
    }
    /** 货运管理=> 货单统计 */
    static queryCargoReport() {
        return FplDialogApi.getService('SvrCargoOrder.queryCargoReport');
    }
    /** 货运管理=> 运单数据统计  */
    static getWaybillDtatistics() {
        return FplDialogApi.getService('SvrArrangeCar.queryDataStat');
    }

    /** 认证中心=> 司机认证数量前五的客户(企业) */
    static queryCorpStatistics() {
        return FplDialogApi.getService('SvrDriverDetalis.queryCorpStatistics');
    }
    /** 认证中心=> 司机人数统计（未审核、已审核） */
    static queryDriverStatistics() {
        return FplDialogApi.getService('SvrDriverDetalis.queryDriverStatistics');
    }
    /** 认证中心=> 收款人数据统计 */
    static queryDataStat() {
        return FplDialogApi.getService('SvrPayeeRegister.queryDataStat');
    }

    /** 修改派车单 */
    static DriverArrangeCarModify(params: DataRow) {
        return FplDialogApi.getDataOut('SvrDriverArrangeCar.modify', params);
    }

    /** 查询当前状态是否已上传附件 */
    static queryAttachmentList(params: DataRow) {
        return FplDialogApi.getDataOut('SvrEnclosure.count', params);
    }

    /** 保存磅单码表数据 */
    static updateCodeMeter(params: DataRow) {
        return FplDialogApi.getDataOut('SvrDriverArrangeCar.updateCodeMeter', params);
    }

    /** 发票管理=> 发票申请数据统计 */
    static statisticalInvoice() {
        return FplDialogApi.getService('SvrPInvoiceApply.statistical');
    }
    /** 发票管理=> 发票管理数据统计 */
    static reviewStatusInvoice() {
        return FplDialogApi.getService('SvrPInvoiceRecord.statistical');
    }
    /** 发票管理=> 每周申请发票次数数据统计 */
    static thisWeekDataInvoice() {
        return FplDialogApi.getService('SvrPInvoiceApply.thisWeekData');
    }
}
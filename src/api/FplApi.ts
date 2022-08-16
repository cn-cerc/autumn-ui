import { DataRow } from "autumn-ui";
import ControlApi from "./ControlApi";

export default class FplApi {
    /** 获取司机接单列表 */
    static getDriverAllOrder() {
        return ControlApi.getService('SvrDriverArrangeCar.search');
    }

    /** 获取派车单详情 */
    static getDriverArrangeCarDetail(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverArrangeCar.download', params);
    }

    /** 获取未接货单详情 */
    static getCargoOrderDetail(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverArrangeCar.downloadForPhone', params);
    }

    /** 确认接单 */
    static ConfirmOrder(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverArrangeCar.downloadForPhone', params);
    }

    /** 零配件管理=> 品牌数量（前五名） */
    static getPartByBrandReport() {
        return ControlApi.getService('SvrMaintainPartInfo.getPartByBrandReport');
    }

    /** 零配件管理=> 零配件使用数量（前五） */
    static getPartToUse() {
        return ControlApi.getService('SvrMaintainPartInfo.getPartToUse');
    }

    /** 零配件管理=> 零配件分类数量最多（前五） */
    static getPartByClass1Report() {
        return ControlApi.getService('SvrMaintainPartInfo.getPartByClass1Report');
    }

    /** 零配件管理=> 当前存在的零配件的数量 */
    static getPartReport() {
        return ControlApi.getService('SvrMaintainPartInfo.getPartReport');
    }

    /** 客户/维修 档案管理=> 客户总数量、月结客户、现金结算（按月） */
    static getCusByMonthReport() {
        return ControlApi.getService('SvrMaintainCusInfo.getCusByMonthReport');
    }

    /** 客户/维修 档案管理=> 本月维修金额最多客户（前五） */
    static getCusByAmountReport() {
        return ControlApi.getService('SvrMaintainCusInfo.getCusByAmountReport');
    }

    /** 客户/维修 档案管理=> 本月维修车辆数量最多客户（前五） */
    static getCusByCodeToCountReport() {
        return ControlApi.getService('SvrMaintainCusInfo.getCusByCodeToCountReport');
    }

    /** 客户/维修 档案管理=> 超过一个月未来维修客户（前五） */
    static getMoreThanOneMonthReport() {
        return ControlApi.getService('SvrMaintainCusInfo.getMoreThanOneMonthReport');
    }

    /** 月结收款管理=> 待接收、已请款、付款中、已付款 */
    static getAccountReport() {
        return ControlApi.getService('SvrAccountsMS.getAccountReport');
    }

    /** 月结收款管理=> 已生成月结款数量、未生成（按月） */
    static getMaintainByMonth() {
        return ControlApi.getService('SvrMaintainMA.getMaintainByMonth');
    }

    /** 月结收款管理=> 维修单统计（12个月，每个月的维修单） */
    static getMaintainByMonthsReport() {
        return ControlApi.getService('SvrMaintainMA.getMaintainByMonthsReport');
    }

    /** 合同管理=> 获取合同类别数据统计 */
    static getContractTypeStats() {
        return ControlApi.getService('SvrContractType.contractTypeStats');
    }

    /** 合同管理=> 获取待接收合同数量统计 */
    static contractApplyStats() {
        return ControlApi.getService('SvrContract.contractApplyStats');
    }

    /** 合同管理=> 获取合同数量统计 */
    static contractStats() {
        return ControlApi.getService('SvrContract.contractStats');
    }

    /**  车队与车辆管理=> 车辆状态统计 */
    static getFleetDrivrCarPayeeReport() {
        return ControlApi.getService('SvrPCarRegistration.getFleetDrivrCarPayeeReport');
    }

    /** 车队与车辆管理=> 车队与车辆类型 */
    static getFleetCarCountReport() {
        return ControlApi.getService('SvrPCarRegistration.getFleetCarCountReport');
    }

    /** 车队与车辆管理/货运管理=> 在途中车辆、空车、待发货 */
    static getMoreThanOneWeekReport() {
        return ControlApi.getService('SvrPCarRegistration.getMoreThanOneWeekReport');
    }

    /** 货运管理=> 货单统计 */
    static queryCargoReport() {
        return ControlApi.getService('SvrCargoOrder.queryCargoReport');
    }

    /** 货运管理=> 运单数据统计  */
    static getWaybillDtatistics() {
        return ControlApi.getService('SvrArrangeCar.queryDataStat');
    }

    /** 认证中心=> 司机认证数量前五的客户(企业) */
    static queryCorpStatistics() {
        return ControlApi.getService('SvrDriverDetalis.queryCorpStatistics');
    }

    /** 认证中心=> 司机人数统计（未审核、已审核） */
    static queryDriverStatistics() {
        return ControlApi.getService('SvrDriverDetalis.queryDriverStatistics');
    }

    /** 认证中心=> 收款人数据统计 */
    static queryDataStat() {
        return ControlApi.getService('SvrPayeeRegister.queryDataStat');
    }

    /** 修改派车单 */
    static DriverArrangeCarModify(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverArrangeCar.modify', params);
    }

    /** 查询当前状态是否已上传附件 */
    static queryAttachmentList(params: DataRow) {
        return ControlApi.getDataOut('SvrEnclosure.count', params);
    }

    /** 保存磅单码表数据 */
    static updateCodeMeter(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverArrangeCar.updateCodeMeter', params);
    }

    /** 发票管理=> 发票申请数据统计 */
    static statisticalInvoice() {
        return ControlApi.getService('SvrPInvoiceApply.statistical');
    }

    /** 发票管理=> 发票管理数据统计 */
    static reviewStatusInvoice() {
        return ControlApi.getService('SvrPInvoiceRecord.statistical');
    }

    /** 发票管理=> 每周申请发票次数数据统计 */
    static thisWeekDataInvoice() {
        return ControlApi.getService('SvrPInvoiceApply.thisWeekData');
    }

    /** 查询类别列表 */
    static getCategorys(params: DataRow) {
        return ControlApi.getDataOut('SvrCategory.search', params);
    }

    /** 获取车队列表 */
    static getFleets(params: DataRow) {
        if (params.getString('corp_no_')) {
            return ControlApi.getDataOut('TAppDept.getFleets', params);
        } else {
            return ControlApi.getDataOut('SvrDept.download', params);
        }
    }

    /** 查询司机列表 */
    static getDriverInfos(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverDetalis.getDriverInfosByCode', params);
    }

    /** 根据车辆编号查询所有司机 */
    static getDriverBindingRecords(params: DataRow) {
        return ControlApi.getDataOut('SvrPDriverBindingRecord.getDriverByCarNo', params);
    }

    /** 查询司机 --用于派车使用 */
    static getSendCarDriver(params: DataRow) {
        return ControlApi.getDataOut('SvrDriverDetalis.getSendCarDriver', params);
    }

    /** 查询车辆挂车厢  */
    static getCarBody(params: DataRow) {
        return ControlApi.getDataOut('SvrPCarRegistration.getCarBody', params);
    }

    /** 根据车队查询车辆列表 */
    static getCarsByDeptCode(params: DataRow) {
        return ControlApi.getDataOut('SvrPCarRegistration.getCarsByDeptCode', params);
    }

    /** 查询收款人列表 **/
    static getPayeeCode(params: DataRow) {
        return ControlApi.getDataOut('SvrPayeeRegister.getPayeeCode', params);
    }

    /** 查询客户绑定的收款人 **/
    static getCusBindPayee(params: DataRow) {
        return ControlApi.getDataOut('SvrPayeeRegister.getCusBindPayee', params);
    }

    /** 查询合同列表 */
    static getContractList(params: DataRow) {
        return ControlApi.getDataOut('SvrContract.searchStatus', params);
    }

    /** 获取维修厂所有车辆列表 */
    static getMaintainVehicles(params: DataRow) {
        return ControlApi.getDataOut('SvrPVehicle.search', params);
    }

    /** 获取货单料品使用记录 */
    static getCargoCodeRecord(params: DataRow) {
        return ControlApi.getDataOut('SvrCodeRecord.queryCodeRecord', params);
    }

    /** 获取货单运输类型 */
    static getCargoCodeTypeRecord(params: DataRow) {
        return ControlApi.getDataOut('SvrCodeRecord.queryCodeTypeList', params);
    }

    /** 获取客户所有地址 */
    static getCustomerAddress(params: DataRow) {
        return ControlApi.getDataOut('SvrCargoOrder.queryCustomerAddress', params);
    }

    /** 获取网络货运类厂商 */
    static getSupNetCorp(params: DataRow) {
        return ControlApi.getDataOut('SvrSupInfoStandard.search', params);
    }

    /** 获取厂商+客户 */
    static getSupAndCus(params: DataRow) {
        return ControlApi.getDataOut('SvrSupInfoStandard.searchSupAndCus', params);
    }

    /** 获取地址 */
    static getAddress(params: DataRow) {
        return ControlApi.getDataOut('SvrAddress.search', params);
    }
    /** 货运管理急速版 => 司机接单Top5 */
    static getDriverOrderTop5() {
        return ControlApi.getService('SvrTaurusQuicknessMCStatis.getDriverOrderTop5');
    }

    /** 货运管理急速版 => 运单已开票或未开票统计  */
    static getTicketedArrTotal() {
        return ControlApi.getService('SvrTaurusQuicknessMCStatis.getTicketedArrTotal');
    }

    /** 车联网看板=》 获取车联网看板的车辆数、司机数、满载率、货损率 */
    static getAllCarNetPanel() {
        return ControlApi.getService('SvrCarNetMonitorPanel.getAllCarNetPanel');
    }
    /** 车联网看板=》 分组统计一周的物流运单数量 */
    static getWeeklyArrCarStatis() {
        return ControlApi.getService('SvrCarNetMonitorPanel.getWeeklyArrCarStatis');
    }
    /** 车联网看板=》 统计运往省份前五的记录 */
    static getCountProvince() {
        return ControlApi.getService('SvrCarNetMonitorPanel.countProvince');
    }
    /** 车联网看板=》 中央车辆位置信息 */
    static getQueryCarsLocation() {
        return ControlApi.getService('SvrCarNetMonitorPanel.queryCarsLocation');
    }
    /** 车联网看板=》 查询今日里程数 */
    static getQueryMileageD() {
        return ControlApi.getService('SvrCarNetMonitorPanel.queryMileageD');
    }


    /** 数据监控中心=》 中央车辆位置信息 */
    static getQueryCarsLocation3() {
        return ControlApi.getService('SvrDataMonitorPanel.queryCarsLocation');
    }
    /** 数据监控中心=》 获取交易状态--已成交数、未成交数 */
    static getDealStatus() {
        return ControlApi.getService('SvrDataMonitorPanel.getDealStatus');
    }
    /** 数据监控中心=》 获取数据监控中心的数据(总交易金额、总物流运单数)  */
    static getAllDataPanelData() {
        return ControlApi.getService('SvrDataMonitorPanel.getAllDataPanelData');
    }
    /** 数据监控中心=》 获取货物重量前三名  */
    static getCargoWeightTop3() {
        return ControlApi.getService('SvrDataMonitorPanel.getCargoWeightTop3');
    }
    /** 数据监控中心=》 司机接单Top5   */
    static getQueryDriverOrderTop5() {
        return ControlApi.getService('SvrDataMonitorPanel.getDriverOrderTop5');
    }
    /** 数据监控中心=》 查询总里程数   */
    static queryMileageTotal() {
        return ControlApi.getService('SvrDataMonitorPanel.queryMileageTotal');
    }
    /** 数据监控中心=》 获取一周交易金额   */
    static getWeeklyOrderAmount() {
        return ControlApi.getService('SvrDataMonitorPanel.getWeeklyOrderAmount');
    }
    /** 数据监控中心=》 获取一周交易笔数   */
    static getWeeklyOrderCount() {
        return ControlApi.getService('SvrDataMonitorPanel.getWeeklyOrderCount');
    }
    /** 数据监控中心=》 获取一周运单重量   */
    static getWeeklyArrangeWeight() {
        return ControlApi.getService('SvrDataMonitorPanel.getWeeklyArrangeWeight');
    }


    /** 货运管理急速版 => 按月分组统计的物流运单数量  */
    static getMonthlyArrCarStatis() {
        return ControlApi.getService('SvrTaurusQuicknessMCStatis.getMonthlyArrCarStatis');
    }
    /** 根据支行缩写查询支行名称 */
    static getBankCorrection(params: DataRow) {
        return ControlApi.getDataOut('SvrBankCorrection.query', params);
    }

    /** 获取当前账套下面车辆信息 */
    static queryCarsCurrentLocation() {
        return ControlApi.getService('SvrCarTrajectories.queryCarsCurrentLocation');
    }

    /** 极速版我要发货 */
    static appendAndTakeEffect(params: DataRow) {
        return ControlApi.getDataOut('SvrShipping.appendAndTakeEffect', params);
    }

    /** 极速版再来一单根据单号查询已填写数据 */
    static copyShipping(params: DataRow) {
        return ControlApi.getDataOut('SvrShipping.copyShipping', params);
    }

    /** 查询所有客户最新线路数值  */
    static getQuoteCusList(params: DataRow) {
        return ControlApi.getDataOut('SvrTransportQuote.queryCusLine', params);
    }

    /** 风险预警=》 预警详情(半年) */
    static getEarlyWarningDetails() {
        return ControlApi.getService('SvrRiskWarningMonitorPanel.getEarlyWarningDetails');
    }
    /** 风险预警=》数据汇总 (半年-高风险) */
    static getEarlyWarningStatistics() {
        return ControlApi.getService('SvrRiskWarningMonitorPanel.getEarlyWarningStatistics');
    }
    /** 风险预警=》 分析研判(自然月) */
    static getEarlyWarningMonthStatistics() {
        return ControlApi.getService('SvrRiskWarningMonitorPanel.getEarlyWarningMonthStatistics');
    }

}
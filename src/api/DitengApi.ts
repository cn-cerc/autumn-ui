import { DataRow, DataSet } from "autumn-ui";
import { showMsg } from "../tool/Summer";
import ControlApi from "./ControlApi";

export default class DitengApi {
    static replaceChar(str: string) {
        if (!str) return str
        let res = str.indexOf('&') > -1 ? encodeURI(str).replace(/&/g, '%26') : str;
        return res;
    }

    /** 获取当前用户信息 */
    static async getUserInfo() {
        return ControlApi.getServiceByCenter('TAppUserInfo.getUserDetail');
    }

    /** 获取客户基本资料 */
    static async getCusList(params: DataRow) {
        return ControlApi.getDataOutByCenter('TAppUserInfo.userList', params);
    }

    /** 获取用户列表信息 */
    static async getUserList() {
        return ControlApi.getServiceByCenter('TAppUserInfo.GetUserList');
    }

    /** 获取商品大类 */
    static getClass1() {
        return ControlApi.getServiceByCenter('TAppPartClass.GetNameList');
    }

    /** 获取客户类别 */
    static getCusType() {
        return ControlApi.getService('TAppCusInfo.getCusTypeList');
    }

    /** 获取商品中类 */
    static async getClass2(params: { Brand_: string, Class1_: string }) {
        let ds = await ControlApi.getService('TAppPartClass.GetClass2List', params);
        while (ds.fetch()) {
            if (ds.getString('Class2_') == '') ds.delete()
        }
        return ds;
    }

    /** 获取商品系列 */
    static async getClass3(params: { Brand_: string, Class1_: string, Class2_: string }) {
        let ds = await ControlApi.getService('TAppPartClass.GetClass3List', params);
        while (ds.fetch()) {
            if (ds.getString('Class3_') == '') ds.delete()
        }
        return ds;
    }

    /** 获取商品品牌 */
    static getBrandList() {
        return ControlApi.getService('TAppSCMBrand.GetBrandList')
    }

    /** */
    static getSearchBrand(params: DataRow) {
        return ControlApi.getDataOut('TAppSCMBrand.Search_Brand', params);
    }

    /** 获取商品明细 */
    static getProducts(params: DataRow) {
        return ControlApi.getDataOut('TAppPartStock.SelectProduct', params);
    }

    /** 获取商品子项列表 */
    static getSubItem(params: { Marque_: string }) {
        return ControlApi.getService('SvrMarque.getSubItem', params);
    }

    /** 获取商品型号子项列表 */
    static async getMarqueList(params: { Marque_: string, param: string, searchText: string }) {
        let dataIn: DataRow = new DataRow();
        dataIn.setJson(params.param || '');
        dataIn.setValue('Marque_', params.Marque_);
        dataIn.setValue('Classify_', 2);
        dataIn.setValue('SearchText_', params.searchText);
        let ds: DataSet = await ControlApi.getDataOut(dataIn.getString("serviceCode"), dataIn);

        let res = await fetch('TWebShopping.getShoppingStatus', {
            method: 'POST',
            body: 'TB=OM',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then(function (response) {
            return response.json();
        }).catch((result) => {
            return result;
        })
        if (res.result) {
            ds.head.setValue('shopStatus', res.shopStatus);
        } else {
            showMsg(res.message)
        }
        return ds;
    }

    /** 查询当前用户的所有下属 */
    static getSubordinate(params: DataRow) {
        return ControlApi.getDataOut('TAppDept.searchSubordinate', params);
    }

    /** 获取资产规格 */
    static async getWareBasic(params: DataRow) {
        let ds = await ControlApi.getDataOut('SvrWareBasic.search', params);
        let bool = true;
        let text = params.getString("SearchText_");
        while (ds.fetch()) {
            if (ds.getString("WareSpec_").indexOf(text) > -1) {
                bool = false;
                break;
            }
        }
        if (bool)
            ds.append().setValue("WareSpec_", text);
        return ds;
    }

    /** 获取物流公司列表 */
    static getLogistics(params: DataRow) {
        return ControlApi.getDataOut('TAppLogistics.SearchDialogLogistics', params);
    }

    /** 获取存储仓别位置列表 */
    static getDfPartCWList(params: { RepairedCW_?: string, SearchText_?: string }) {
        return ControlApi.getService('TAppPartStock.GetDfPartCWList', params);
    }

    /** 商品总库存与分仓别的调整显示 */
    static getDisplay(params: { SearchText_?: string, PartCode_: string }) {
        return ControlApi.getService('TAppStockCW.Display', params);
    }

    /** 获取会员客户的基本资料 */
    static getVipCardInfo(params: DataRow) {
        return ControlApi.getDataOut('TAppVipCard.Search', params);
    }

    /** 获取银行列表 */
    static getBankInfos(params: DataRow) {
        return ControlApi.getDataOut('TAppBankInfo.Download', params);
    }

    /** 获取收费记录卡 */
    static getOurInfo(params: DataRow) {
        return ControlApi.getDataOut('TAppOurInfo.search', params);
    }

    /** 获取商品型号信息 */
    static getPartModel(params: DataRow) {
        return ControlApi.getDataOut('TAppPartModel.download', params);
    }

    /** 查询客户基本资料 */
    static getFastCorp(params: DataRow) {
        return ControlApi.getDataOut('TAppUserInfo.Search_FastCorp', params);
    }

    /** 查找制程基本单据(模糊查询、载入数查询) */
    static getSearchBOMProcess() {
        let dataIn = new DataRow();
        dataIn.setValue('Disable_', false);
        return ControlApi.getDataOut('TAppBOM.SearchBOMProcess', dataIn);
    }

    /** 获取客户区域列表 */
    static getAreaList(params: DataRow) {
        return ControlApi.getDataOut('TAppCusInfo.GetAreaList', params);
    }

    /** 查询所有员工数 */
    static getWorkers(params: DataRow) {
        return ControlApi.getDataOut('SvrStaffMan.search', params);
    }

    /** 部门和人事表关联，获得部门代码以及人事表中的名称 */
    static getDeptAndHRList() {
        return ControlApi.getService('TAppDept.getDeptAndHRList');
    }

    /** 获取客户区域 */
    static getCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DitengApi.replaceChar(params.getValue(item.code)))
        })
        return ControlApi.getDataOut('TAppCusArea.Download_Area', params);
    }

    /** 获取客户区域 */
    static getSearchCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DitengApi.replaceChar(params.getValue(item.code)))
        })
        return ControlApi.getDataOut('TAppCusArea.searchArea', params);
    }

    /** 获取制程选择下拉列表 */
    static getProcessList() {
        return ControlApi.getService('SvrWorkStep.getProcess');
    }

    /** 获取制程列表 */
    static getProcSteps(params: DataRow) {
        return ControlApi.getDataOut('SvrWorkStep.search', params);
    }

    static async getSaleCurrentNum(params: DataRow) {
        let ds = await ControlApi.getDataOut('TAppSaleForecast.searchSale', params);
        while (ds.fetch()) {
            ds.setValue("RemainCurrentNum", ds.getDouble("CurForecastNum") - ds.getDouble("OutNum_"));
        }
        return ds.getPromise();
    }

    /** 获取厂商账户 */
    static getSupBanks(params: { SupCode_: string }) {
        return ControlApi.getService('SvrSupBank.download', params);
    }

    /** 获取优惠原因 */
    static getTempPrefererntial() {
        return ControlApi.getService('TAppCoupon.download');
    }

    /** 增加优惠原因 */
    static appendTempPrefererntial(params: DataRow) {
        return ControlApi.getDataOut('TAppCoupon.append', params);
    }

    /** 删除优惠原因 */
    static removeTempPrefererntial(params: { UID_: string }) {
        return ControlApi.getService('TAppCoupon.delete', params);
    }

    /** 获取部门列表 */
    static getDepartments(params: DataRow) {
        return ControlApi.getDataOut('TAppDept.Download', params);
    }

    /** 显示会计科目余额 */
    static getAccountEdit(params: DataRow) {
        return ControlApi.getDataOut('TAppAccType2.Download', params);
    }

    /** 获取商品规格 */
    static getPartSpec(params: DataRow) {
        return ControlApi.getDataOut('SvrPartSpec.search', params);
    }

    /** 获取采购信息 */
    static getSupInfo(params: DataRow) {
        return ControlApi.getDataOut('TAppSupInfo.Download', params);
    }

    /** 获取薪资等级 */
    static getSalaryLevel(params: DataRow) {
        return ControlApi.getDataOut('SvrSalaryLevel.search', params);
    }

    /** 获取费用类别 */
    static getExpense(params: DataRow) {
        return ControlApi.getDataOut('SvrExpenseReimbursed.searchExpenseType', params);
    }

    /** 显示客户专卖区域 */
    static async getCusInfos(params: DataRow) {
        return ControlApi.getDataOut('TAppCusInfo.Download', params);
    }

    /** 用户登录 */
    static UserLogin(params: DataRow) {
        return ControlApi.getDataOut('SvrUserLogin.getToken', params);
    }
    /** 复制报表 */
    static postCopyReport(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrSendPrint.copyReport', params);
    }

    /** 商品快速录入接口 */
    static getGatherProducts(params: DataRow) {
        return ControlApi.getDataOut('TAppGatherProducts.download', params);
    }

    /** 商品快乐获取品牌列表 */
    static getGatherProductClass(params: string[]) {
        return ControlApi.getService('TWebSelectDialog.quickProductClass', params);
    }

    /** 查看库存商品基本资料 */
    static getPartStock(params: DataRow) {
        return ControlApi.getDataOut('TAppPartStock.view', params);
    }

    /** 选择批号 */
    static getAvailabelLotNo(params: DataRow) {
        return ControlApi.getDataOut('SvrLotNo.getSelectLotNo', params);
    }

    /** 保存批号 */
    static saveLotNo(params: DataSet) {
        return ControlApi.serviceDataSet('SvrLotNo.saveLotNo', params);
    }

    /** 获取编码原则大类 */
    static getCodeClass() {
        return ControlApi.getService('SvrCodeClass.search');
    }

    static getPartPrincipleSearch(params: DataRow) {
        return ControlApi.getDataOut('SvrPartPrinciple.search', params);
    }

    static getPartPrincipleDownload(params: DataRow) {
        return ControlApi.getDataOut('SvrPartPrinciple.download', params);
    }

    static getPartSpecDownload(params: DataRow) {
        return ControlApi.getDataOut('SvrPartSpec.download', params);
    }

    static postPartStock(params: DataRow) {
        return ControlApi.getDataOut('TAppPartStock.Append', params, 30);
    }

    static updatePartPrinciple(params: DataRow) {
        return ControlApi.getDataOut('SvrPartPrinciple.updateLastNo', params, 20);
    }

    /** 根据商品的品牌、品名、规格判断商品是否存在 */
    static existsPartInfo(params: DataRow) {
        return ControlApi.getDataOut('TAppPartInfo.existsPartInfo', params);
    }

    static getPartSpecModify(params: DataSet) {
        return ControlApi.serviceDataSet('SvrPartSpec.modify', params);
    }

    /** 获取商品资料信息 */
    static getPartStockDownload(params: DataRow) {
        return ControlApi.getDataOut('TAppPartStock.download', params);
    }

    /** 获取配置信息  */
    static getModelConfigSearch(params: DataRow) {
        return ControlApi.getDataOut('SvrModelConfig.search', params);
    }

    /** 获取配置详细信息 */
    static getModelConfigDownload(params: DataRow) {
        return ControlApi.getDataOut('SvrModelConfig.download', params);
    }

    /** 获取商品基本资料 */
    static getPartDownload(params: DataRow) {
        return ControlApi.getDataOut('TAppPartInfo.download_PartInfo', params);
    }

    /** 根据选择的配置，生成对应的商品资料 */
    static postConfigCode(params: DataSet) {
        return ControlApi.serviceDataSet('SvrConfigCode.configCodeCreatePartInfo', params);
    }

    /** 获取配置表的信息 */
    static getConfigCodeList(params: DataRow) {
        return ControlApi.getDataOut('SvrConfigCode.getConfigCodeList', params);
    }

    /** 修改配置信息 */
    static updateConfigCode(params: DataSet) {
        return ControlApi.serviceDataSet('SvrConfigCode.modifyConfigCode', params);
    }

    static createSubitemBOM(params: DataSet) {
        return ControlApi.serviceDataSet('SvrSubitemBOM.createSubitemBOM', params);
    }

    /** 获取广告内容列表 */
    static getAdvertContentList(params: DataRow) {
        return ControlApi.getDataOut('SvrAdvertContent.getAdvertContentList', params);
    }/** 获取联系人列表 */

    static getContactList() {
        return ControlApi.getServiceByCenter('SvrMessages.messageSessions');
    }

    /** 获取消息详情 */
    static getMessageDetails(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrMessages.messageDetail', params);
    }

    /** 回复消息 */
    static replyMessage(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrMessages.sendTo', params);
    }

    /** 回复图片消息 */
    static replyImageMessage(params: FormData) {
        return fetch(`FrmMyMessage.sendImg?sid=${ControlApi.getToken()}`, {
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
        return ControlApi.getDataOutByCenter('SvrUserRemark.userRemark', params);
    }

    /** 设置用户备注 */
    static setUserRemark(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrUserRemark.setUserRemark', params);
    }

    /** 获取快速回复列表 */
    static getQuickReplyList(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrQuickReply.list', params);
    }

    /** 设置快速回复 */
    static setQuickReplyItem(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrQuickReply.setReplyContent', params);
    }

    /** 删除快速回复 */
    static delQuickReplyItem(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrQuickReply.delReplyContent', params);
    }

    /** 获取客户详细信息 */
    static fromDetail(params: DataRow) {
        return ControlApi.getDataOutByCenter('ApiUserInfo.fromDetail', params);
    }

    /** 获取通讯录所有联系人分组列表的人员 */
    static searchBook(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrAddressBook.search', params);
    }

    /** 接收类消息操作接口 */
    static acknowledge(serviceCode: string, params: DataRow) {
        return ControlApi.getDataOut(serviceCode, params);
    }

    /** 消息举报 */
    static messageReport(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrMessageReport.reportMessage', params);
    }

    /** 清除某人未读消息 */
    static cleanUnread(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrMessages.cleanUnread', params)
    }

    /** 创建群聊 */
    static createGroup(params: DataRow) {
        return ControlApi.getDataOutByCenter('SvrMessages.createGroup', params);
    }
}
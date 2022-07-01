import { DataSet, QueryService, DataRow } from "autumn-ui";
import { showMsg } from "../tool/Summer";

// 页面初始化时获取的sid
const initSid = window.localStorage.getItem('ErpKey_sid');

export default class DialogApi {
    static replaceChar(str: string) {
        if (!str) return str
        let res = str.indexOf('&') > -1 ? encodeURI(str).replace(/&/g, '%26') : str;
        return res;
    }
    static getToken(): string {
        // 发起请求时获取的最新sid
        let newSid = window.localStorage.getItem('ErpKey_sid');
        if (!newSid) {
            if (location.search.length) {
                let paramsArr = location.search.split('?')[1].split('&');
                let sid = paramsArr.find(i => i.split('=')[0] == 'sid').split("=")[1]
                window.localStorage.setItem('ErpKey_sid', sid);
                return sid;
            } else {
                showMsg('当前用户登录状态丢失，请刷新页面重新登录。')
                return '';
            }
        }
        if (newSid == initSid)
            return initSid;
        else {
            location.reload();
        }
    }

    static async getUserCenter() {
        let hasOrigalSess = false;
        if (sessionStorage.getItem('ORIGINALHOST'))
            hasOrigalSess = true;
        let origalData = new DataSet();
        if (!hasOrigalSess) {
            origalData = await DialogApi.getOriginalHost();
            sessionStorage.setItem('ORIGINALHOST', origalData.json);
        } else
            origalData.setJson(sessionStorage.getItem('ORIGINALHOST'));
        let userCenter = '';
        origalData.first();
        while (origalData.fetch()) {
            if (origalData.getString('Original_') == 'UserCenter')
                userCenter = origalData.getString('Host_');
        }
        return userCenter;
    }

    static async getService(url: string, params?: any): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        service.setService(url);
        let keyArr = params ? Object.keys(params) : [];
        if (keyArr.length > 0) {
            keyArr.forEach((param) => {
                service.dataIn.head.setValue(param, params[param])
            })
        }
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async getServiceByCenter(url: string, params?: any, byService: boolean = true): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await DialogApi.getUserCenter();
        service.setService(url);
        service.setHost(`${userCenter}/${byService ? 'services/' : ''}`);
        let keyArr = params ? Object.keys(params) : [];
        if (keyArr.length > 0) {
            keyArr.forEach((param) => {
                service.dataIn.head.setValue(param, params[param])
            })
        }
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async getDataOut(url: string, params: DataRow, timeout: number = 15): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        service.setService(url);
        service.dataIn.head.copyValues(params.current);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open(timeout).catch(e => e);
        return ds;
    }

    static async getDataOutByCenter(url: string, params: DataRow, timeout: number = 15, byService: boolean = true): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await DialogApi.getUserCenter();
        service.setHost(`${userCenter}/${byService ? 'services/' : ''}`);
        service.setService(url);
        service.dataIn.head.copyValues(params.current);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open(timeout).catch(e => e);
        return ds;
    }

    static async serviceDataSet(url: string, params: DataSet): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        service.setService(url);
        service.dataIn.appendDataSet(params);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async serviceDataSetByCenter(url: string, params: DataSet): Promise<DataSet> {
        let sid = DialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await DialogApi.getUserCenter();
        service.setHost(`${userCenter}/services/`);
        service.setService(url);
        service.dataIn.appendDataSet(params);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async getOriginalHost() {
        return DialogApi.getService('SvrOriginalHost.loadAll');
    }

    /** 获取当前用户信息 */
    static async getUserInfo() {
        return DialogApi.getServiceByCenter('TAppUserInfo.getUserDetail');
    }

    /** 获取客户基本资料 */
    static async getCusList(params: DataRow) {
        return DialogApi.getDataOutByCenter('TAppUserInfo.userList', params);
    }

    /** 获取用户列表信息 */
    static async getUserList() {
        return DialogApi.getServiceByCenter('TAppUserInfo.GetUserList');
    }

    /** 获取商品大类 */
    static getClass1() {
        return DialogApi.getService('TAppPartClass.GetNameList');
    }

    /** 获取客户类别 */
    static getCusType() {
        return DialogApi.getService('TAppCusInfo.getCusTypeList');
    }

    /** 获取商品中类 */
    static async getClass2(params: { Brand_: string, Class1_: string }) {
        let ds = await DialogApi.getService('TAppPartClass.GetClass2List', params);
        while (ds.fetch()) {
            if (ds.getString('Class2_') == '') ds.delete()
        }
        return ds;
    }

    /** 获取商品系列 */
    static async getClass3(params: { Brand_: string, Class1_: string, Class2_: string }) {
        let ds = await DialogApi.getService('TAppPartClass.GetClass3List', params);
        while (ds.fetch()) {
            if (ds.getString('Class3_') == '') ds.delete()
        }
        return ds;
    }

    /** 获取商品品牌 */
    static getBrandList() {
        return DialogApi.getService('TAppSCMBrand.GetBrandList')
    }

    /** */
    static getSearchBrand(params: DataRow) {
        return DialogApi.getDataOut('TAppSCMBrand.Search_Brand', params);
    }

    /** 获取商品明细 */
    static getProducts(params: DataRow) {
        return DialogApi.getDataOut('TAppPartStock.SelectProduct', params);
    }

    /** 获取商品子项列表 */
    static getSubItem(params: { Marque_: string }) {
        return DialogApi.getService('SvrMarque.getSubItem', params);
    }

    /** 获取商品型号子项列表 */
    static async getMarqueList(params: { Marque_: string, param: string, searchText: string }) {
        let dataIn: DataRow = new DataRow();
        dataIn.setJson(params.param || '');
        dataIn.setValue('Marque_', params.Marque_);
        dataIn.setValue('Classify_', 2);
        dataIn.setValue('SearchText_', params.searchText);
        let ds: DataSet = await DialogApi.getDataOut(dataIn.getString("serviceCode"), dataIn);

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
        return DialogApi.getDataOut('TAppDept.searchSubordinate', params);
    }

    /** 获取资产规格 */
    static async getWareBasic(params: DataRow) {
        let ds = await DialogApi.getDataOut('SvrWareBasic.search', params);
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
        return DialogApi.getDataOut('TAppLogistics.SearchDialogLogistics', params);
    }

    /** 获取存储仓别位置列表 */
    static getDfPartCWList(params: { RepairedCW_?: string, SearchText_?: string }) {
        return DialogApi.getService('TAppPartStock.GetDfPartCWList', params);
    }

    /** 商品总库存与分仓别的调整显示 */
    static getDisplay(params: { SearchText_?: string, PartCode_: string }) {
        return DialogApi.getService('TAppStockCW.Display', params);
    }

    /** 获取会员客户的基本资料 */
    static getVipCardInfo(params: DataRow) {
        return DialogApi.getDataOut('TAppVipCard.Search', params);
    }

    /** 获取银行列表 */
    static getBankInfos(params: DataRow) {
        return DialogApi.getDataOut('TAppBankInfo.Download', params);
    }

    /** 获取收费记录卡 */
    static getOurInfo(params: DataRow) {
        return DialogApi.getDataOut('TAppOurInfo.search', params);
    }

    /** 获取商品型号信息 */
    static getPartModel(params: DataRow) {
        return DialogApi.getDataOut('TAppPartModel.download', params);
    }

    /** 查询客户基本资料 */
    static getFastCorp(params: DataRow) {
        return DialogApi.getDataOut('TAppUserInfo.Search_FastCorp', params);
    }

    /** 查找制程基本单据(模糊查询、载入数查询) */
    static getSearchBOMProcess() {
        let dataIn = new DataRow();
        dataIn.setValue('Disable_', false);
        return DialogApi.getDataOut('TAppBOM.SearchBOMProcess', dataIn);
    }

    /** 获取客户区域列表 */
    static getAreaList(params: DataRow) {
        return DialogApi.getDataOut('TAppCusInfo.GetAreaList', params);
    }

    /** 查询所有员工数 */
    static getWorkers(params: DataRow) {
        return DialogApi.getDataOut('SvrStaffMan.search', params);
    }

    /** 部门和人事表关联，获得部门代码以及人事表中的名称 */
    static getDeptAndHRList() {
        return DialogApi.getService('TAppDept.getDeptAndHRList');
    }

    /** 获取客户区域 */
    static getCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DialogApi.replaceChar(params.getValue(item.code)))
        })
        return DialogApi.getDataOut('TAppCusArea.Download_Area', params);
    }

    /** 获取客户区域 */
    static getSearchCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DialogApi.replaceChar(params.getValue(item.code)))
        })
        return DialogApi.getDataOut('TAppCusArea.searchArea', params);
    }

    /** 获取制程选择下拉列表 */
    static getProcessList() {
        return DialogApi.getService('SvrWorkStep.getProcess');
    }

    /** 获取制程列表 */
    static getProcSteps(params: DataRow) {
        return DialogApi.getDataOut('SvrWorkStep.search', params);
    }

    static async getSaleCurrentNum(params: DataRow) {
        let ds = await DialogApi.getDataOut('TAppSaleForecast.searchSale', params);
        while (ds.fetch()) {
            ds.setValue("RemainCurrentNum", ds.getDouble("CurForecastNum") - ds.getDouble("OutNum_"));
        }
        return ds.getPromise();
    }

    /** 获取厂商账户 */
    static getSupBanks(params: { SupCode_: string }) {
        return DialogApi.getService('SvrSupBank.download', params);
    }

    /** 获取优惠原因 */
    static getTempPrefererntial() {
        return DialogApi.getService('TAppCoupon.download');
    }

    /** 增加优惠原因 */
    static appendTempPrefererntial(params: DataRow) {
        return DialogApi.getDataOut('TAppCoupon.append', params);
    }

    /** 删除优惠原因 */
    static removeTempPrefererntial(params: { UID_: string }) {
        return DialogApi.getService('TAppCoupon.delete', params);
    }

    /** 获取部门列表 */
    static getDepartments(params: DataRow) {
        return DialogApi.getDataOut('TAppDept.Download', params);
    }

    /** 显示会计科目余额 */
    static getAccountEdit(params: DataRow) {
        return DialogApi.getDataOut('TAppAccType2.Download', params);
    }

    /** 获取商品规格 */
    static getPartSpec(params: DataRow) {
        return DialogApi.getDataOut('SvrPartSpec.search', params);
    }

    /** 获取采购信息 */
    static getSupInfo(params: DataRow) {
        return DialogApi.getDataOut('TAppSupInfo.Download', params);
    }

    /** 显示客户专卖区域 */
    static async getCusInfos(params: DataRow) {
        return DialogApi.getDataOut('TAppCusInfo.Download', params);
    }

    /** 用户登录 */
    static UserLogin(params: DataRow) {
        return DialogApi.getDataOut('SvrUserLogin.getToken', params);
    }
    /** 复制报表 */
    static postCopyReport(params: DataRow) {
        return DialogApi.getDataOutByCenter('SvrSendPrint.copyReport', params);
    }

    /** 商品快速录入接口 */
    static getGatherProducts(params: DataRow) {
        return DialogApi.getDataOut('TAppGatherProducts.download', params);
    }

    /** 商品快乐获取品牌列表 */
    static getGatherProductClass(params: string[]) {
        return DialogApi.getService('TWebSelectDialog.quickProductClass', params);
    }

    /** 查看库存商品基本资料 */
    static getPartStock(params: DataRow) {
        return DialogApi.getDataOut('TAppPartStock.view', params);
    }

    /** 选择批号 */
    static getAvailabelLotNo(params: DataRow) {
        return DialogApi.getDataOut('SvrLotNo.getSelectLotNo', params);
    }

    /** 保存批号 */
    static saveLotNo(params: DataSet) {
        return DialogApi.serviceDataSet('SvrLotNo.saveLotNo', params);
    }

    /** 获取编码原则大类 */
    static getCodeClass() {
        return DialogApi.getService('SvrCodeClass.search');
    }

    static getPartPrincipleSearch(params: DataRow) {
        return DialogApi.getDataOut('SvrPartPrinciple.search', params);
    }

    static getPartPrincipleDownload(params: DataRow) {
        return DialogApi.getDataOut('SvrPartPrinciple.download', params);
    }

    static getPartSpecDownload(params: DataRow) {
        return DialogApi.getDataOut('SvrPartSpec.download', params);
    }

    static postPartStock(params: DataRow) {
        return DialogApi.getDataOut('TAppPartStock.Append', params, 30);
    }

    static updatePartPrinciple(params: DataRow) {
        return DialogApi.getDataOut('SvrPartPrinciple.updateLastNo', params, 20);
    }

    /** 根据商品的品牌、品名、规格判断商品是否存在 */
    static existsPartInfo(params: DataRow) {
        return DialogApi.getDataOut('TAppPartInfo.existsPartInfo', params);
    }

    static getPartSpecModify(params: DataSet) {
        return DialogApi.serviceDataSet('SvrPartSpec.modify', params);
    }

    /** 获取商品资料信息 */
    static getPartStockDownload(params: DataRow) {
        return DialogApi.getDataOut('TAppPartStock.download', params);
    }

    /** 获取配置信息  */
    static getModelConfigSearch(params: DataRow) {
        return DialogApi.getDataOut('SvrModelConfig.search', params);
    }

    /** 获取配置详细信息 */
    static getModelConfigDownload(params: DataRow) {
        return DialogApi.getDataOut('SvrModelConfig.download', params);
    }

    /** 获取商品基本资料 */
    static getPartDownload(params: DataRow) {
        return DialogApi.getDataOut('TAppPartInfo.download_PartInfo', params);
    }

    /** 根据选择的配置，生成对应的商品资料 */
    static postConfigCode(params: DataSet) {
        return DialogApi.serviceDataSet('SvrConfigCode.configCodeCreatePartInfo', params);
    }

    /** 获取配置表的信息 */
    static getConfigCodeList(params: DataRow) {
        return DialogApi.getDataOut('SvrConfigCode.getConfigCodeList', params);
    }

    /** 修改配置信息 */
    static updateConfigCode(params: DataSet) {
        return DialogApi.serviceDataSet('SvrConfigCode.modifyConfigCode', params);
    }

    static createSubitemBOM(params: DataSet) {
        return DialogApi.serviceDataSet('SvrSubitemBOM.createSubitemBOM', params);
    }

    /** 获取广告内容列表 */
    static getAdvertContentList(params: DataRow) {
        return DialogApi.getDataOut('SvrAdvertContent.getAdvertContentList', params);
    }
}
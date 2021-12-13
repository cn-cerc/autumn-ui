import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import { showMsg } from "./Summer";

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
            showMsg('当前用户登录状态丢失，请刷新页面重新登录。')
            return '';
        }
        if (newSid == initSid)
            return initSid;
        else {
            showMsg('当前用户信息错误，请刷新页面。');
            return '';
        }
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

    static async getDataOut(url: string, params: DataRow): Promise<DataSet> {
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
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    /** 获取商品大类 */
    static getClass1() {
        return DialogApi.getService('TAppPartClass.GetNameList');
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

    /** 获取商品明细 */
    static async getProducts(params: DataRow) {
        return await DialogApi.getDataOut('TAppPartStock.SelectProduct', params);
    }

    /** 获取商品子项列表 */
    static async getSubItem(params: { Marque_: string }) {
        return await DialogApi.getService('SvrMarque.getSubItem', params);
    }

    /** 查询当前用户的所有下属 */
    static async getSubordinate(params: DataRow) {
        return await DialogApi.getDataOut('TAppDept.searchSubordinate', params);
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
    static async getLogistics(params: DataRow) {
        return await DialogApi.getDataOut('TAppLogistics.SearchDialogLogistics', params);
    }

    /** 获取存储仓别位置列表 */
    static async getDfPartCWList(params: { RepairedCW_?: string, SearchText_?: string }) {
        return await DialogApi.getService('TAppPartStock.GetDfPartCWList', params);
    }

    /** 商品总库存与分仓别的调整显示 */
    static async getDisplay(params: { SearchText_?: string, PartCode_: string }) {
        return await DialogApi.getService('TAppStockCW.Display', params);
    }

    /** 获取会员客户的基本资料 */
    static async getVipCardInfo(params: DataRow) {
        return await DialogApi.getDataOut('TAppVipCard.Search', params);
    }

    /** 获取银行列表 */
    static async getBankInfos(params: DataRow) {
        return await DialogApi.getDataOut('TAppBankInfo.Download', params);
    }

    /** 获取收费记录卡 */
    static async getOurInfo(params: DataRow) {
        return await DialogApi.getDataOut('TAppOurInfo.Download', params);
    }

    /** 获取商品型号信息 */
    static async getPartModel(params: DataRow) {
        return await DialogApi.getDataOut('TAppPartModel.download', params);
    }

    /** 查询客户基本资料 */
    static async getFastCorp(params: DataRow) {
        return await DialogApi.getDataOut('TAppUserInfo.Search_FastCorp', params);
    }

    /** 查找制程基本单据(模糊查询、载入数查询) */
    static async getSearchBOMProcess() {
        let dataIn = new DataRow();
        dataIn.setValue('Disable_', false);
        return await DialogApi.getDataOut('TAppBOM.SearchBOMProcess', dataIn);
    }

    /** 获取客户区域列表 */
    static async getAreaList(params: DataRow) {
        return await DialogApi.getDataOut('TAppCusInfo.GetAreaList', params);
    }

    /** 查询所有员工数 */
    static async getWorkers(params: DataRow) {
        return await DialogApi.getDataOut('SvrStaffMan.search', params);
    }

    /** 部门和人事表关联，获得部门代码以及人事表中的名称 */
    static async getDeptAndHRList() {
        return await DialogApi.getService('TAppDept.getDeptAndHRList');
    }

    /** 获取客户区域 */
    static async getCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DialogApi.replaceChar(params.getValue(item.code)))
        })
        return await DialogApi.getDataOut('TAppCusArea.Download_Area', params);
    }

    /** 获取客户区域 */
    static async getSearchCusArea(params: DataRow) {
        params.fields.forEach((item) => {
            params.setValue(item.code, DialogApi.replaceChar(params.getValue(item.code)))
        })
        return await DialogApi.getDataOut('TAppCusArea.searchArea', params);
    }
}
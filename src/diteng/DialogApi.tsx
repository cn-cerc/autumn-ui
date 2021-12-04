import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import { showMsg } from "./Summer";

// 页面初始化时获取的sid
const initSid = window.localStorage.getItem('ErpKey_sid');

export default class DialogApi {
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

    static getService(url: string, params?: any): Promise<DataSet> {
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
        return service.open();
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
        return ds.getPromise();
    }

    /** 获取商品系列 */
    static async getClass3(params: { Brand_: string, Class1_: string, Class2_: string }) {
        let ds = await DialogApi.getService('TAppPartClass.GetClass3List', params);
        while (ds.fetch()) {
            if (ds.getString('Class3_') == '') ds.delete()
        }
        return ds.getPromise();
    }
}
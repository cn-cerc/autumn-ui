import { DataSet, QueryService, DataRow } from "autumn-ui";
import { showMsg } from "../tool/Summer";

// 页面初始化时获取的sid
const initSid = window.localStorage.getItem('ErpKey_sid');

export default class FplDialogApi {
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

    static async getUserCenter() {
        let hasOrigalSess = false;
        if (sessionStorage.getItem('ORIGINALHOST'))
            hasOrigalSess = true;
        let origalData = new DataSet();
        if (!hasOrigalSess) {
            origalData = await FplDialogApi.getOriginalHost();
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
        let sid = FplDialogApi.getToken();
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

    static async getServiceByCenter(url: string, params?: any): Promise<DataSet> {
        let sid = FplDialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await FplDialogApi.getUserCenter();
        service.setService(url);
        service.setHost(`${userCenter}/services/`);
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
        let sid = FplDialogApi.getToken();
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

    static async getDataOutByCenter(url: string, params: DataRow, timeout: number = 15): Promise<DataSet> {
        let sid = FplDialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await FplDialogApi.getUserCenter();
        service.setHost(`${userCenter}/services/`);
        service.setService(url);
        service.dataIn.head.copyValues(params.current);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open(timeout).catch(e => e);
        return ds;
    }

    static async serviceDataSet(url: string, params: DataSet): Promise<DataSet> {
        let sid = FplDialogApi.getToken();
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
        let sid = FplDialogApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await FplDialogApi.getUserCenter();
        service.setHost(`${userCenter}/services/`);
        service.setService(url);
        service.dataIn.appendDataSet(params);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async getOriginalHost() {
        return FplDialogApi.getService('SvrOriginalHost.loadAll');
    }
    
    /** 查询类别列表 */
    static getCategorys(params: DataRow) {
        return FplDialogApi.getDataOut('SvrCategory.search', params);
    }

    /** 获取车队列表 */
    static getFleets(params: DataRow) {
        return FplDialogApi.getDataOut('TAppDept.Download', params);
    }

    /** 查询司机列表 */
    static getDriverInfos(params: DataRow) {
        return FplDialogApi.getDataOut('SvrDriverDetalis.getDriverInfosByCode', params);
    }
}
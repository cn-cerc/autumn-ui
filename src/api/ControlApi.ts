import { DataSet, QueryService, DataRow } from "autumn-ui";
import { showMsg } from "../tool/Summer";

// 页面初始化时获取的sid
const initSid = window.localStorage.getItem('ErpKey_sid');

export default class ControlApi {
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
            origalData = await ControlApi.getOriginalHost();
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
        let sid = ControlApi.getToken();
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
        let sid = ControlApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await ControlApi.getUserCenter();
        service.setService(url);
        service.setHost(userCenter);
        service.setPath('/services');
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
        let sid = ControlApi.getToken();
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
        let sid = ControlApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await ControlApi.getUserCenter();
        service.setHost(userCenter);
        service.setPath('/services');
        service.setService(url);
        service.dataIn.head.copyValues(params.current);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open(timeout).catch(e => e);
        return ds;
    }

    static async serviceDataSet(url: string, params: DataSet): Promise<DataSet> {
        let sid = ControlApi.getToken();
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
        let sid = ControlApi.getToken();
        if (!sid) {
            let error = new DataSet();
            error.setMessage('当前用户信息错误');
            error.setState(-1);
            return error.getPromise();
        }
        let service = new QueryService({ sid });
        let userCenter = await ControlApi.getUserCenter();
        service.setHost(userCenter);
        service.setService(url);
        service.setPath('/services');
        service.dataIn.appendDataSet(params);
        // e为请求失败时抛出的异常，类型为DataSet
        let ds: DataSet = await service.open().catch(e => e);
        return ds;
    }

    static async getOriginalHost() {
        return ControlApi.getService('SvrOriginalHost.loadAll');
    }
}
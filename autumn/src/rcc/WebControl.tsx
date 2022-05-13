import React from "react";
import ClientDevice from "./ClientDevice";

export default class WebControl<T = {}, S = {}> extends React.Component<T, S> implements ClientDevice {
    private _isPhone: boolean = this.initIsPhone();

    get isPhone(): boolean { return this._isPhone }
    setIsPhone(value: boolean): WebControl<T, S> {
        this._isPhone = value;
        return this;
    }

    initIsPhone() {
        // 部分手机浏览器访问时device可能为pc，所以改成用设备尺寸判断
        let bool = document.body.offsetWidth <= 767;
        //@ts-ignore
        if(window.Application && !bool) {
            //@ts-ignore
            let device = Application.device;
            bool = device == "phone" || device == "weixin" || device == "android"
            || device == "iphone";
        }
        return bool;
    }

}
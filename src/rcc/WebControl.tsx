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
        let bool = window.outerWidth <= 767;
        //@ts-ignore
        if(window.Application) {
            //@ts-ignore
            let device = Application.device;
            bool = device == "phone" || device == "weixin" || device == "android"
            || device == "iphone";
        }
        return bool;
    }

}
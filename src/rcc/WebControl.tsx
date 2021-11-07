import React from "react";
import ClientDevice from "./ClientDevice";

export default class WebControl<T = {}, S = {}> extends React.Component<T, S> implements ClientDevice {
    private _isPhone: boolean = false;

    get isPhone(): boolean { return this._isPhone }
    setIsPhone(value: boolean): WebControl<T, S> {
        this._isPhone = value;
        return this;
    }

}
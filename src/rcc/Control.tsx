import React from "react";
import ClientDevice from "./ClientDevice";

export default class TControl<T = {}, S = {}> extends React.Component<T, S> implements ClientDevice {
    private _isPhone: boolean = true;

    get isPhone(): boolean { return this._isPhone }
    setIsPhone(value: boolean): TControl<T, S> {
        this._isPhone = value;
        return this;
    }

}
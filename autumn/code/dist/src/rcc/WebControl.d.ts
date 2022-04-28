import React from "react";
import ClientDevice from "./ClientDevice";
export default class WebControl<T = {}, S = {}> extends React.Component<T, S> implements ClientDevice {
    private _isPhone;
    get isPhone(): boolean;
    setIsPhone(value: boolean): WebControl<T, S>;
    initIsPhone(): boolean;
}

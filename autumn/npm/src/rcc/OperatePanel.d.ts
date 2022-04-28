import React, { ReactNode } from "react";
import WebControl from "./WebControl";
declare type propsType = {
    children?: ReactNode | undefined;
};
export default class OperatePanel extends WebControl {
    constructor(props: propsType);
    render(): React.ReactNode;
}
export {};

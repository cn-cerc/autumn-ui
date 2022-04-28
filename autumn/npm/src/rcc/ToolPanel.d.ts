import { ReactNode } from "react";
import WebControl from "./WebControl";
declare type propsType = {
    children?: ReactNode | undefined;
};
export default class ToolPanel extends WebControl<propsType> {
    constructor(props: propsType);
    render(): JSX.Element;
}
declare type itemPropsType = {
    title: string;
    children?: ReactNode | undefined;
};
export declare class ToolItem extends WebControl<itemPropsType> {
    render(): JSX.Element;
}
export {};

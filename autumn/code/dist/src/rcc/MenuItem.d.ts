import { ReactNode } from "react";
import WebControl from "./WebControl";
declare type propsType = {
    code: string;
    name: string;
    last?: boolean;
    children?: ReactNode | undefined;
};
export default class MenuItem extends WebControl<propsType> {
    render(): JSX.Element;
}
export {};

/// <reference types="react" />
import WebControl from "./WebControl";
export declare type BaseFormPropsType = {
    title: string;
};
export default class BaseForm<T extends BaseFormPropsType = {
    title: null;
}, S = {}> extends WebControl<T, S> {
    render(): JSX.Element;
}

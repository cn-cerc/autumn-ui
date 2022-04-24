import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "react";
export declare type OnPageChanged = (beginPoint: number, endPoint: number) => void;
export declare const DefaultPageSize = 100;
export declare const USER_PAGE_SIZE_KEY = "user:pageSize";
declare type propsType = {
    onPageChanged: OnPageChanged;
    total: number;
};
declare type stateType = {
    pageSize: number;
    pageNo: number;
    inputValue: string;
};
export default class MutiPage extends React.Component<propsType, stateType> {
    constructor(props: propsType);
    render(): JSX.Element;
    onPageSizeChange: ChangeEventHandler<HTMLSelectElement>;
    onPageNoChange: ChangeEventHandler<HTMLInputElement>;
    onPageNoKeyPress: KeyboardEventHandler<HTMLInputElement>;
    onPageNoBlur: FocusEventHandler<HTMLInputElement>;
    updatePageNo(pageNo: number): void;
    onNavigatorClick: (el: any) => void;
    pageChanged(pageSize: number, pageNo: number): void;
    reload(): void;
}
export {};

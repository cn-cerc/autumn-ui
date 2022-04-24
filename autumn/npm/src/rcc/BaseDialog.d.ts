import React, { MouseEventHandler } from "react";
import { OnSelectDataRowEvent } from "./DialogComponent";
import WebControl from "./WebControl";
export declare type BaseDialogPropsType = {
    inputId?: string;
    width?: string;
    height?: string;
    isChild?: boolean;
    onSelect?: OnSelectDataRowEvent;
    dataField?: string;
};
declare type MoveData = {
    moving: boolean;
    startX: number;
    startY: number;
    moveX: number;
    moveY: number;
    x: number;
    y: number;
};
export declare type BaseDialogStateType = {
    dialogData?: MoveData;
    width?: string;
    height?: string;
};
export default abstract class BaseDialog<T extends BaseDialogPropsType = BaseDialogPropsType, S extends BaseDialogStateType = BaseDialogStateType> extends WebControl<T, S> {
    state: S;
    private _title;
    private _dialogRole;
    private _load;
    private _loadMessage;
    private _showAsChild;
    private _searchTimeOut;
    get title(): string;
    setTitle(value: string): BaseDialog<T, S>;
    get load(): boolean;
    setLoad(value: boolean): BaseDialog<T, S>;
    customLoad(message: string): this;
    setStorage(key: string, value: any): void;
    getStorage(key: string): string;
    delStorage(key: string): void;
    getStorageKey(key: string): string;
    get searchTimeOut(): number;
    /** 弹窗主体内容 */
    abstract content(): JSX.Element;
    render(): JSX.Element;
    componentDidMount(): void;
    allowDrag(): boolean;
    handleMouseDown: MouseEventHandler<HTMLDivElement>;
    handleMouseMove: any;
    handleMouseUp: any;
    initSite(): void;
    getStyle(): any;
    handleClose(): void;
    handleSelect(): void;
    getDialog(): JSX.Element;
    getOperate(): JSX.Element;
    getLoad(): JSX.Element;
    getAdornment(): React.ReactNode;
    showAsChild(): void;
}
export {};

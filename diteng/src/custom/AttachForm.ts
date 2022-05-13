import React from "react";
import { AbstractPlugins } from "./AbstractPlugins";

export abstract class AttachForm extends AbstractPlugins {
    private _owner: any;
    public get owner(): any { return this._owner; }
    public setOwner(value: any) { this._owner = value; }

    /** 操作说明 */
    abstract  attachHelp(): React.ReactNode;

    /** 相关操作 */
    abstract attachMenu(): React.ReactNode;

    /** 导出Excel */
    abstract attachExport(): React.ReactNode;

    /** 打印 */
    abstract attachPrint(): React.ReactNode;

    /** 底部按钮 */
    abstract attachFooter(): React.ReactNode;

    /** 汇总区域 */
    abstract attachDataTotal(): React.ReactNode;
}
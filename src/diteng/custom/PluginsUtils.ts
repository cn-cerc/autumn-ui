import { AttachForm } from "./AttachForm";

export class PluginsUtils {
    private static pluginsList: Map<string, AttachForm> = new Map();
    private static get(zlass: any, corpNo: string): any {
        let obj = PluginsUtils.pluginsList.get(zlass.constructor.name + '_' + corpNo) as AttachForm;
        if (obj) obj.setOwner(zlass);
        return obj;
    }

    static register(zlass: any) {
        this.pluginsList.set(zlass.constructor.name, zlass);
    }

    /** 操作说明 */
    static attachHelp(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachHelp();
    }

    /** 相关操作 */
    static attachMenu(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachMenu();
    }

    /** 导出Excel */
    static attachExport(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachExport();
    }

    /** 打印 */
    static attachPrint(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachPrint();
    }

    /** 底部按钮 */
    static attachFooter(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachFooter();
    }

    /** 汇总区域 */
    static attachDataTotal(zlass: any, corpNo: string): React.ReactNode {
        let obj = this.get(zlass, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachDataTotal();
    }
}
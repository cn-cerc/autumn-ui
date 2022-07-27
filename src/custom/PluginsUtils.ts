import { AttachForm } from "./AttachForm";

export class PluginsUtils {
    private static pluginsList: Map<string, AttachForm> = new Map();
    private static get(clazz: any, corpNo: string): any {
        let obj = PluginsUtils.pluginsList.get(clazz.constructor.name + '_' + corpNo) as AttachForm;
        if (obj) obj.setOwner(clazz);
        return obj;
    }

    static register(clazz: any) {
        this.pluginsList.set(clazz.constructor.name, clazz);
    }

    /** 操作说明 */
    static attachHelp(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachHelp();
    }

    /** 相关操作 */
    static attachMenu(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachMenu();
    }

    /** 导出Excel */
    static attachExport(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachExport();
    }

    /** 打印 */
    static attachPrint(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachPrint();
    }

    /** 底部按钮 */
    static attachFooter(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachFooter();
    }

    /** 汇总区域 */
    static attachDataTotal(clazz: any, corpNo: string): React.ReactNode {
        let obj = this.get(clazz, corpNo);
        if (!obj) return '';
        let plugins = obj as unknown as AttachForm;
        return plugins.attachDataTotal();
    }
}
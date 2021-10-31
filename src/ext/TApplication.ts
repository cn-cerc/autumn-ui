import DataBind from "../db/DataBind";
import DataControl from "../db/DataControl";
import TComponent from "../ui/TComponent";
import TDiv from "../ui/TDiv";
import TPage from "./TPage";

export default class TApplication extends TDiv implements DataBind {
    private _pageNo: number = 0;
    //提供数据绑定服务
    private _bindControls: Set<DataControl> = new Set<DataControl>();
    private _bindEnabled: boolean = true;

    constructor() {
        super(null);
        this.id = 'app';
        this.container = 'app';
    }

    set title(value: string) { document.title = value }

    get title() { return document.title }

    addComponent(child: TComponent): TApplication {
        super.addComponent(child);
        if (child instanceof TPage) {
            child.setCssStyle('height:100vh;display:flex;flex-direction: column;');
            child.id = "page" + this.getComponentCount();
            if (this._pageNo != this.getPages().length - 1)
                child.visible = false;
        }
        return this;
    }

    run() {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        this.repaint();
    }

    set pageNo(value: number) {
        if (this._pageNo != value) {
            if (this._pageNo > -1)
                this.getPages()[this._pageNo].visible = false;
            this._pageNo = value;
            if (this._pageNo > -1)
                this.getPages()[this._pageNo].visible = true;
            this.repaint();
        }
    }
    get pageNo(): number { return this._pageNo }

    getPages(): TPage[] {
        let items: TPage[] = [];
        for (let child of this.getComponents()) {
            if (child instanceof TPage)
                items.push(child as TPage);
        }
        return items;
    }

    getActivePage(): TPage {
        let it = 0;
        for (let child of this.getComponents()) {
            if (child instanceof TPage) {
                if (this._pageNo == it) {
                    return child as TPage;
                }
                it++;
            }
        }
        return null;
    }

    registerBind(client: DataControl, register: boolean): void {
        if (register)
            this._bindControls.add(client);
        else
            this._bindControls.delete(client);
    }
    refreshBind(content: any = undefined): void {
        if (this._bindEnabled) {
            this._bindControls.forEach(child => {
                child.doChange(content);
            });
        }
    }
    get bindEnabled(): boolean { return this._bindEnabled };
    set bindEnabled(value: boolean) { this._bindEnabled = value }

}

export var app = new TApplication()

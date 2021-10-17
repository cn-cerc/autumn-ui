import DataBind from "../db/DataBind";
import DataControl from "../db/DataControl";
import TComponent from "../ui/TComponent";
import TDiv from "../ui/TDiv";
import TPage from "./TPage";

export default class TApplication extends TDiv implements DataBind {
    private pageNo: number = 0;
    //提供数据绑定服务
    private bindControls: Set<DataControl> = new Set<DataControl>();
    private bindEnabled: boolean = true;

    constructor() {
        super(null);
        this.setId('app');
        this.setContainer('app');
    }

    setTitle(value: string) {
        document.title = value;
        return this;
    }

    getTitle() {
        return document.title;
    }

    addComponent(child: TComponent): TApplication {
        super.addComponent(child);
        if (child instanceof TPage) {
            child.setCssStyle('height:100vh;display:flex;flex-direction: column;');
            child.setId("page" + this.getComponentCount());
            if (this.pageNo != this.getPages().length - 1)
                child.setVisible(false);
        }
        return this;
    }

    run() {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        this.render();
    }

    setPageNo(value: number): TApplication {
        if (this.pageNo != value) {
            if (this.pageNo > -1)
                this.getPages()[this.pageNo].setVisible(false);
            this.pageNo = value;
            if (this.pageNo > -1)
                this.getPages()[this.pageNo].setVisible(true);
            this.render();
        }
        return this;
    }
    getPageNo(): number {
        return this.pageNo;
    }

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
                if (this.pageNo == it) {
                    return child as TPage;
                }
                it++;
            }
        }
        return null;
    }

    registerBind(client: DataControl, register: boolean): void {
        if (register)
            this.bindControls.add(client);
        else
            this.bindControls.delete(client);
    }
    refreshBind(content: any = undefined): void {
        if (this.bindEnabled) {
            this.bindControls.forEach(child => {
                child.doChange(content);
            });
        }
    }
    setBindEnabled(value: boolean): TApplication {
        this.bindEnabled = value;
        return this;
    }
    getBindEnabled(): boolean {
        return this.bindEnabled;
    }
}

export var app = new TApplication()

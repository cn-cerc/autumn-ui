import { assertEquals } from "../JUnit";
import HtmlWriter from "./HtmlWriter";

export default class TComponent {
    private owner: TComponent;
    private origin: any;
    private rootLabel: string;
    private container: string;
    private components: Set<TComponent> = new Set<TComponent>();
    private propertys: Map<string, string> = new Map<string, string>();
    private events: Map<string, any> = new Map<string, any>();
    private _style: Map<string, string> = new Map<string, string>();
    private _props: any;

    constructor(owner: TComponent, props: object = null) {
        this.owner = owner;
        this.setOwner(owner);
        this._props = props;
        if (props != null) {
            //@ts-ignore
            if (props.id != undefined) {
                //@ts-ignore
                this.setId(props.id);
            }
        }
    }

    getOwner(): TComponent {
        return this.owner;
    }
    setOwner(owner: TComponent): TComponent {
        if (this.owner) {
            this.owner.removeComponent(this);
        }
        if (owner) {
            owner.addComponent(this);
        }
        this.owner = owner;
        return this;
    }

    addComponent(component: TComponent): TComponent {
        if (component != null && !this.components.has(component)) {
            component.owner = this;
            if (component.origin == null)
                component.origin = this.origin != null ? this.origin : this;
            this.components.add(component);
        }
        return this;
    }

    removeComponent(component: TComponent): TComponent {
        if (component != null) {
            if (component.origin == component.owner)
                component.origin = null;
            component.owner = null;
            this.components.delete(component);
        }
        return this;
    }

    getComponents(): TComponent[] {
        return Array.from(this.components.values());
    }

    getComponentCount(): number {
        return this.components.size;
    }

    setRootLabel(value: string): TComponent {
        this.rootLabel = value;
        return this;
    }

    getRootLabel(): string {
        return this.rootLabel;
    }

    beginOutput(html: HtmlWriter): void {
        if (this._style.size > 0) {
            let css: string = "";
            this._style.forEach((value, key) => {
                if (value)
                    css = css + `${key}:${value};`;
                else
                    css = css + `${key};`;
            })
            this.writeProperty('style', css);
        } else {
            this.propertys.delete('style');
        }

        if (this.rootLabel) {
            html.print("<" + this.rootLabel);
            this.propertys.forEach((v, k) => {
                html.print(' ' + k + '="' + v + '"')
            });
            html.print(">");
        }
    }

    output(html: HtmlWriter): void {
        this.beginOutput(html);
        for (let item of this.getComponents())
            item.output(html);
        this.endOutput(html);
    }

    endOutput(html: HtmlWriter): void {
        if (this.rootLabel) {
            html.print("</" + this.rootLabel + ">");
        }
    }

    toString(): string {
        let html = new HtmlWriter();
        this.output(html);
        return html.getText();
    }

    readProperty(key: string): string {
        return this.propertys.get(key);
    }

    writeProperty(key: string, value: string): TComponent {
        if (value)
            this.propertys.set(key, value);
        else
            this.propertys.delete(key);
        return this;
    }

    getId(): string {
        return this.readProperty('id');
    }

    setId(id: string): TComponent {
        this.writeProperty('id', id);
        return this;
    }

    getCssClass(): string {
        return this.readProperty('class');
    }
    setCssClass(cssClass: string): TComponent {
        this.writeProperty("class", cssClass);
        return this;
    }

    get style(): Map<string, string> {
        return this._style;
    }

    setCssStyle(text: string): TComponent {
        if (text == null) {
            this._style.clear();
            return this;
        }

        for (let item of text.split(';')) {
            if (item.trim().length == 0)
                continue;
            let values = item.split(':');
            if (values.length == 2)
                this._style.set(values[0].trim(), values[1].trim());
            else
                this._style.set(item.trim(), null);
        }
        return this;
    }

    render(container: string = null) {
        if (container != null)
            this.setContainer(container);

        if (typeof document == "undefined" || document == null) {
            console.log(this.toString());
            return;
        }

        let contentId = this.container ? this.container : this.getId();
        if (!contentId)
            throw new Error("render error: container is null")

        let el = document.getElementById(contentId);
        if (!el)
            throw new Error(`not find element: ${contentId}`);

        el.outerHTML = this.toString();

        this.registerEvents(this);
    }

    private registerEvents(root: TComponent) {
        if (root.getId()) {
            root.events.forEach((fn, event) => {
                let el = document.getElementById(root.getId());
                if (el)
                    el.addEventListener(event, fn);
                else
                    throw new Error(`not find element: ${root.getId()}`);
            })
        }
        for (let child of root.getComponents())
            this.registerEvents(child);
    }

    addEventListener(event: string, fn: any) {
        let htmlId = this.getId();
        if (htmlId)
            this.events.set(event, fn);
        else
            throw new Error('this id is null');
    }

    getName() {
        return this.readProperty('name');
    }

    setName(value: string) {
        this.writeProperty('name', value);
        return this;
    }

    getContainer() {
        return this.container;
    }

    setContainer(container: string) {
        this.container = container;
        return this;
    }

    get props(): any { return this._props }
}

// let item = new TComponent();
// item.setRootLabel('div');
// item.setId('aaaa');
// item.render();


// let child = new TComponent();
// child.setRootLabel('child');
// child.setOwner(item);
// item.render();

// item.setName('abcd');
// assertEquals('abcd', item.getName());

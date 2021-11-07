export default class TComponent {
    private _owner: TComponent;
    private _origin: any;
    private _rootLabel: string;
    private _container: string;
    private _components: Set<TComponent> = new Set<TComponent>();
    private _propertys: Map<string, string> = new Map<string, string>();
    private _events: Map<string, any> = new Map<string, any>();
    private _style: Map<string, string> = new Map<string, string>();
    private _visible: boolean = true;
    private _props: any = {};
    private _cssHead: string[] = [];

    constructor(owner: TComponent, props: any = null) {
        this.setOwner(owner);
        this._props = props;
        if (props != null) {
            const { id, style } = props;
            if (id)
                this.setId("auto" == props.id ? this.getUid() : props.id);
            if (style)
                this.setCssStyle(style);
        }
    }

    get owner(): TComponent { return this._owner }
    setOwner(owner: TComponent): TComponent {
        if (this._owner)
            this._owner.removeComponent(this);
        this._owner = owner;
        if (this._owner)
            this._owner.addComponent(this);
        return this;
    }

    get origin(): any { return this._origin }
    setOrigin(value: any): TComponent { this._origin = value; return this; }

    addComponent(component: TComponent): TComponent {
        if (component != null && !this._components.has(component)) {
            component._owner = this;
            if (component._origin == null)
                component._origin = this._origin != null ? this._origin : this;
            this._components.add(component);
        }
        return this;
    }

    removeComponent(component: TComponent): TComponent {
        if (component != null) {
            if (component._origin == component._owner)
                component._origin = null;
            component._owner = null;
            this._components.delete(component);
        }
        return this;
    }

    getComponents(): TComponent[] {
        return Array.from(this._components.values());
    }

    getComponentCount(): number {
        return this._components.size;
    }

    get rootLabel(): string { return this._rootLabel }
    setRootLabel(value: string): TComponent { this._rootLabel = value; return this; }

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
            this._propertys.delete('style');
        }

        if (this._rootLabel) {
            html.print("<" + this._rootLabel);
            this._propertys.forEach((v, k) => {
                html.print(' ' + k + '="' + v + '"')
            });
            html.print(">");
        }
    }

    output(html: HtmlWriter): void {
        if (this._visible) {
            this.beginOutput(html);
            for (let item of this.getComponents())
                item.output(html);
            this.endOutput(html);
        }
    }

    endOutput(html: HtmlWriter): void {
        if (this._rootLabel)
            html.print(`</${this._rootLabel}>`);
        this.cssOutput();
    }

    //输出到 head.style
    cssOutput() {
        if (this.cssHead.length == 0)
            return;
        let css = '';
        for (let line of this._cssHead) {
            if (css) css += '\n';
            css += line.trim();
        }
        let style_id = this.getUid() + "_style";
        let style = document.getElementById(style_id);
        if (style == undefined) {
            style = document.createElement('style');
            style.id = style_id;
            let node = document.createTextNode(css);
            style.appendChild(node);
            document.head.appendChild(style);
        } else {
            style.innerHTML = css;
        }
    }

    toString(): string {
        let html = new HtmlWriter();
        this.output(html);
        return html.getText();
    }

    readProperty(key: string): string {
        return this._propertys.get(key);
    }

    writeProperty(key: string, value: string): TComponent {
        if (value)
            this._propertys.set(key, value);
        else
            this._propertys.delete(key);
        return this;
    }


    get id(): string { return this.readProperty('id') }
    setId(id: string): TComponent { this.writeProperty('id', id); return this; }

    getUid(): string {
        let uid = this.id;
        if (uid == undefined) {
            if (this._owner) {
                let num = this._owner.getComponentCount();
                uid = this._owner.getUid() + "_" + num;
            } else {
                uid = "origin";
            }
            this.setId(uid);
        }
        return uid;
    }

    get cssHead(): string[] { return this._cssHead };

    get cssClass(): string { return this.readProperty('class') }
    setCssClass(cssClass: string): TComponent { this.writeProperty("class", cssClass); return this; }

    get style(): Map<string, string> { return this._style }
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

    repaint(container: string = null) {
        if (container != null)
            this.setContainer(container);

        if (typeof document == "undefined" || document == null) {
            console.log(this.toString());
            return;
        }

        let contentId = this._container ? this._container : this.id;
        if (!contentId) {
            if (this._owner)
                this._owner.repaint();
            else
                console.log(`${this.id}.repaint error: container is null`);
            return;
        }

        let el = document.getElementById(contentId);
        if (!el) {
            console.log(`not find element: ${contentId}`);
            return;
        }

        el.outerHTML = this.toString();

        this.registerEvents(this);
    }

    private registerEvents(root: TComponent) {
        if (!root.visible)
            return;
        if (root.id) {
            root._events.forEach((fn, event) => {
                let eventId = root.id;
                let eventCode = event;
                let events = event.split('.');
                if (events.length == 2) {
                    eventId = eventId + "_" + events[0];
                    eventCode = events[1];
                }
                let el = document.getElementById(eventId);
                if (el)
                    el.addEventListener(eventCode, fn);
                else
                    throw new Error(`not find element: ${eventId}`);
            })
        }
        for (let child of root.getComponents())
            this.registerEvents(child);
    }

    addEventListener(event: string, fn: any) {
        let uid = this.getUid();
        if (uid)
            this._events.set(event, fn);
        else {
            console.log(this);
            throw new Error('this uid is null');
        }
    }


    get container() { return this._container }
    setContainer(container: string): TComponent { this._container = container; return this; }

    get visible(): boolean { return this._visible }
    setVisible(value: boolean): TComponent { this._visible = value; return this; }

    getComponent(id: string, root: TComponent = null): TComponent {
        let current = root;
        if (current == null)
            current = this;
        //先查找当前是否存在
        for (let child of current.getComponents()) {
            if (child.id == id) {
                return child;
            }
        }
        //再查找子阶是否存在
        for (let child of current.getComponents()) {
            let item = child.getComponent(id, child);
            if (item != null)
                return item;
        }
        return null;
    }

    get props(): any { return this._props }
}

export class HtmlWriter {
    private _lines: string[] = [];

    print(text: string): HtmlWriter {
        this._lines.push(text);
        return this;
    }

    println(text: string): HtmlWriter {
        this._lines.push(text + "\n");
        return this;
    }

    getText(): string {
        let text = "";
        this._lines.forEach((line) => {
            text = text + line;
        })
        return text;
    }

}

export class TDiv extends TComponent {
    constructor(owner: TComponent, props: any = null) {
        super(owner, props);
        this.setRootLabel('div');
    }
}

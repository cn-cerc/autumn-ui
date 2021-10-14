import HtmlWriter from "./HtmlWriter";

export default class TComponent {
    owner: TComponent;
    origin: object;
    rootLabel: string;
    container: string;
    components: Set<TComponent> = new Set<TComponent>();
    propertys: Map<string, string> = new Map<string, string>();

    constructor(owner: TComponent) {
        this.owner = owner;
        this.setOwner(owner);
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

    getComponents(): Set<TComponent> {
        return this.components;
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
        this.getComponents().forEach((item) => {
            item.output(html);
        })
        this.endOutput(html);
    }

    endOutput(html: HtmlWriter): void {
        if (this.rootLabel) {
            html.print("</" + this.rootLabel + ">");
        }
    }

    readProperty(key: string): string {
        return this.propertys.get(key);
    }

    writerProperty(key: string, value: string): TComponent {
        this.propertys.set(key, value);
        return this;
    }

    getId(): string {
        return this.readProperty('id');
    }

    setId(id: string): TComponent {
        this.writerProperty('id', id);
        return this;
    }

    setCssClass(cssClass: string) : TComponent {
        this.writerProperty("class", cssClass);
        return this;
    }

    registerEvents() {

    }

    render(container: string = null) {
        if (container != null) {
            this.setContainer(container);
        }

        let html = new HtmlWriter();
        this.output(html);
        if (typeof document == "undefined" || document == null) {
            console.log(html.getText());
            return;
        }

        let contentId = this.container ? this.container : this.getId();
        if (contentId) {
            document.getElementById(contentId).innerHTML = html.getText();
            this.registerEvents();
        } else
            console.log("render error: container is null")
    }

    addEventListener(htmlId, event, func) {
        document.getElementById(htmlId).addEventListener(event, func);
    }

    getName() {
        return this.readProperty('name');
    }

    setName(value) {
        this.writerProperty('name', value);
        return this;
    }

    getContainer() {
        return this.container;
    }

    setContainer(container) {
        this.container = container;
        return this;
    }
}

// let item = new TComponent();
// item.setRootLabel('div');
// item.setId('aaaa');
// item.paint();


// let child = new TComponent();
// child.setRootLabel('child');
// child.setOwner(item);
// item.paint();

// item.name = 'abcd';
// console.log(item.name);

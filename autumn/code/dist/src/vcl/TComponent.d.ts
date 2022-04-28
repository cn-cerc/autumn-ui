export default class TComponent {
    private _owner;
    private _origin;
    private _rootLabel;
    private _container;
    private _components;
    private _propertys;
    private _events;
    private _style;
    private _visible;
    private _props;
    private _cssHead;
    constructor(owner: TComponent, props?: any);
    get owner(): TComponent;
    setOwner(owner: TComponent): TComponent;
    get origin(): any;
    setOrigin(value: any): TComponent;
    addComponent(component: TComponent): TComponent;
    removeComponent(component: TComponent): TComponent;
    getComponents(): TComponent[];
    getComponentCount(): number;
    get rootLabel(): string;
    setRootLabel(value: string): TComponent;
    beginOutput(html: HtmlWriter): void;
    output(html: HtmlWriter): void;
    endOutput(html: HtmlWriter): void;
    cssOutput(): void;
    toString(): string;
    readProperty(key: string): string;
    writeProperty(key: string, value: string): TComponent;
    get id(): string;
    setId(id: string): TComponent;
    getUid(): string;
    get cssHead(): string[];
    get cssClass(): string;
    setCssClass(cssClass: string): TComponent;
    get style(): Map<string, string>;
    setCssStyle(text: string): TComponent;
    repaint(container?: string): void;
    private registerEvents;
    addEventListener(event: string, fn: any): void;
    get container(): string;
    setContainer(container: string): TComponent;
    get visible(): boolean;
    setVisible(value: boolean): TComponent;
    getComponent(id: string, root?: TComponent): TComponent;
    get props(): any;
}
export declare class HtmlWriter {
    private _lines;
    print(text: string): HtmlWriter;
    println(text: string): HtmlWriter;
    getText(): string;
}
export declare class TDiv extends TComponent {
    constructor(owner: TComponent, props?: any);
}

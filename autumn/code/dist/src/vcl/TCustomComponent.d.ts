import TComponent, { HtmlWriter } from "./TComponent";
export default class TCustomComponent extends TComponent {
    private _content;
    private _history;
    constructor(owner: TComponent, props?: any);
    beginOutput(html: HtmlWriter): void;
    html(): string;
    css(): string;
}

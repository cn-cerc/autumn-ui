import TComponent, { HtmlWriter } from "./TComponent";
export default class TText extends TComponent {
    private _text;
    constructor(owner: TComponent, props?: any);
    get text(): string;
    setText(text: string): TText;
    output(html: HtmlWriter): void;
}

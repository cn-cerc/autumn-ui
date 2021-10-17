import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TCustomComponent extends TComponent {

    public output(html: HtmlWriter) {
        html.print(this.html().trim());
        //设置全局css样式
        let css = this.css().trim();
        if (css.length > 0) {
            let style = document.createElement('style');
            let node = document.createTextNode(css);
            style.appendChild(node);
            document.head.appendChild(style);
        }
    }

    html(): string {
        return (
            `<div>not create</div>`
        )
    }

    css(): string {
        return ('')
    }
}


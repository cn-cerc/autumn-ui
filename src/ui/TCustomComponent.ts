import HtmlWriter from "./HtmlWriter";
import TComponent from "./TComponent";

export default class TCustomComponent extends TComponent {

    public output(html: HtmlWriter) {
        html.print(this.html().trim());
        //设置全局css样式
        let css = this.css().trim();
        if (css.length > 0) {
            let style_id = "style_" + this.getUid();
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


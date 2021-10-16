import { HtmlWriter, TComponent } from "../src/SummerCI";

export default class Footer extends TComponent {

    public output(html: HtmlWriter) {
        html.print(
            `<div>
开源管理：${this.props.corp} copyright @${this.props.year}
</div>`);
    }

}

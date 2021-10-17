import TCustomComponent from "../src/ui/TCustomComponent";

export default class Footer extends TCustomComponent {

    html() {
        return (`
<div role="footer">
    开源管理：${this.props.corp} copyright @${this.props.year}
</div>
            `);
    }

    css() {
        return (`
div[role=footer] {color:blue}
        `)
    }
}

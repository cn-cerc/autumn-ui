import TCustomComponent from "../src/ui/TCustomComponent";

export default class Footer extends TCustomComponent {

    html() {
        return (
            `<div>
开源管理：${this.props.corp} copyright @${this.props.year}
</div>`);
    }

}

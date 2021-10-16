import TComponent from "../ui/TComponent";
import TPage from "./TPage";

export default class TApplication extends TComponent {

    constructor() {
        super(null);
        this.setContainer('app');
    }

    setTitle(value: string) {
        document.title = value;
        return this;
    }

    getTitle() {
        return document.title;
    }

    addComponent(child: TPage): TApplication {
        super.addComponent(child);
        child.setId("page" + this.getComponentCount());
        return this;
    }

    run() {
        this.render();
    }
}
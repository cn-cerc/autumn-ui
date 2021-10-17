import { TDiv } from "../SummerCI";
import TComponent from "../ui/TComponent";

export default class TPage extends TDiv {
    private title: string;

    constructor(owner: TComponent, props: any = null) {
        super(owner);
        if (!owner)
            this.setContainer('page');
        if (!this.getId())
            this.setId('page');
        if (props && props.title) {
            //@ts-ignore
            this.setTitle(props.title);
        }
    }

    setTitle(value: string): TPage {
        this.title = value;
        return this;
    }
    getTitle(): string {
        return this.title;
    }

}
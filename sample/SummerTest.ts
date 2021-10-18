import { app } from "../src/ext/TApplication";
import TTabControl from "../src/ui/TTabControl";
import FrmIndex from "./FrmIndex";
import FrmWelcome from "./FrmWelcome";

app.title = "summer-ci 应用示例";

new TTabControl(app);
new FrmWelcome(app);
new FrmIndex(app);

app.run();

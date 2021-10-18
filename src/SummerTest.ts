import FrmIndex from "../FrmIndex";
import FrmWelcome from "../FrmWelcome";
import { app } from "./ext/TApplication";
import TTabControl from "./ui/TTabControl";

app.title = "summer-ci 应用示例";

new TTabControl(app);
new FrmWelcome(app);
new FrmIndex(app);

app.run();

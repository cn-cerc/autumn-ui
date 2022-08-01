//引入autumn-ui样式文件
import "autumn-ui/assets/autumn-ui.css";

import dialog from "./dialog";
import stock from "./stock";
import tool from "./tool";

export default {
    ...dialog,
    ...tool,
    ...stock
}
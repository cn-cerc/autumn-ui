import * as sci from './SummerCI.js';
import TestButton from './test/TestButton.js';
window.sci = sci


// 在主页面增加内容
let div = new sci.TDiv();
div.setContainer('app');

new TestButton().render(div);

div.render();

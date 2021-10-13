import * as sci from './SummerCI.js';
window.sci = sci

// 在主页面增加内容
let div = new sci.TDiv();
div.setContainer('app');

let button = new sci.TButton(div);
button.setText('提示按钮');
button.writerProperty('onclick', 'alert(\'你好，我是button\')');

div.render();

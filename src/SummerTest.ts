import * as sci from './SummerCI.js';
window.sci = sci


let mainform = new sci.TWinForm();
mainform.setTitle("hello world")

// 在主页面增加内容
let div = new sci.TDiv(mainform);

let button = new sci.TButton(div);
button.setText('提示yy按钮');
button.writerProperty('onclick', 'alert(\'你好，我是button\')');

mainform.render();

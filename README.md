iKeyboardScroll4 v0.0.1
===========


[解决什么问题]
----------------------
iScroll4下，当表单元素聚焦且键盘出现时，可能会出现iScroll区域滚动异常问题。而且当前聚焦的表单元素可能不出现在可视区域内，影响用户体验。

[注意]
----------------------
本方案基于Zepto.js及Sea.js构建，使用时需注意
http://www.zawaliang.com/2013/10/443.html

[使用]
----------------------
```
var Keyboard = require('iKeyboardScroll4');

// 为元素添加监控，适用于新增的元素
1) Keyboard.watch(selector);

// 键盘显隐时
2) Keyboard.onchange(display, activeElement);

// 传入iScroll实例，自动处理refresh以及聚焦元素的位置问题
3) Keyboard.fixIScroll4Onchange(iScrollInstance, offset);

```

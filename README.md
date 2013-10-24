iKeyboardScroll4 beta
===========


[解决什么问题]
----------------------
iScroll4下，当表单元素聚焦且键盘出现时，可能会出现iScroll区域滚动异常问题。而且当前聚焦的表单元素可能不出现在可视区域内，影响用户体验。

[注意]
本方案基于Zepto.js及Sea.js构建，使用需请注意；
http://www.zawaliang.com/2013/10/443.html

[使用]
```
var Keyboard = require('iKeyboardScroll4');
// 键盘显隐时
1) Keyboard.onchange(display, activeElement);

// 传入iScroll实例，自动处理refresh以及聚焦元素的位置问题
2) Keyboard.fixIScroll4Onchange(iScrollInstance, offset);

```
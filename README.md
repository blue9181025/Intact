# VdWidget

## 简介

一个基于`virtual-dom`编写数据单向绑定web组件的js库，能够实现组件之间的组合、继承。

## 动机

我需要一个库/框架，能够实现以下两点：
1. 数据绑定，单向或双向无所谓，只要能够实现数据更新后UI能够自动更新
2. UI更新可控，我可以更新数据但阻止UI自动更新，另外我能知道什么时候UI更新完成，我可以在更新完成后，直接操作dom。

如果你是一个`jQuery`深度开发者，不想去了解各种复杂的框架的使用方法，但又想写出高可维护的代码，`VdWidget`是你的一种选择。

感谢`React.js`及`virtual-dom`技术的实现，让一切变得可能。

那为什么不直接使用`React.js`呢？原因很简单：我是一个`jQuery`深度开发着。

这个项目基于之前的一个项目`vdt.js`，那是一个纯前端模板工具，需要自己控制UI更新。这个工具对其进行了一层封装，使其可以简单地编写web组件。

## 安装

```
bower install vdwidget --save
```

## 依赖

1. underscore
2. jquery

再引入`vdWidget.js`之前，先加载这两个文件，或者通过`amd`加载

## 示例

```js
var Widget = VdWidget.extend({
    defaults: {
        name: 'Javey'
    },

    template: '<div ev-click={_.bind(this.change, this)}>{this.get("name")}</div>',

    change: function() {
        this.set('name', 'Hello Javey!');
    }
});

VdWidget.mount(Widget, $('body')[0]);
```

## 教程

### 第一个Widget

创建一个widget分为以下几步

1. 通过VdWidget.extend创建widget
```js
var Widget = VdWidget.extend();
```
2. 给widget提供默认数据，通过指定defaults字段
```js
var Widget = VdWidget.extend({
    defaults: {
        name: 'Javey'
    }
});
```
3. 指定模板，模板可以是字符串，也可以是已经编译好的模板函数，参见`vdt.js`。模板函数，可以前端编译，也可以后端编译通过amd加载。模板语法为`JSX`，最后一个元素必须用html标签包起来。
```js
var Widget = VdWidget.extend({
    defaults: {
        name: 'Javey'
    },

    template: '<div ev-click={_.bind(this.change, this)}>{this.get("name")}</div>'
});
4. appendChild到指定的dom中，只有`root widget`才需要这么做
```js
...

VdWidget.mount(Widget, $('body')[0]);
```

### 模板

模板写法参考`vdt.js`。在模板中`this`指向该widget实例，所以可以直接获取该widget的数据和调用相应的方法。

#### 获取数据

##### this.get([key])

* @param `key` {String} 要获取数据的名称，不指定则获取所有数据
* @return {*} 返回指定的key的值

#### 绑定事件

通过`ev-event`的方式指定需要绑定的事件和相应方法。如果需要调用widget的方法，这需要通过bind绑定this

```jsx
<div ev-click={_.bind(this.change, this)}></div>
// es5可以这么做
<div ev-click={this.change.bind(this)}></div>
// 还可以这么做
var self = this;
<div ev-click={function() {self.change()}}></div>
```

如果需要传入数据
```jsx
// 'Hi'将作为参数传入change方法
ev-click={_.bind(this.change, this, 'Hi')}
// 其他方式同理
```

### 组件生命周期

#### _init

组件初始化，这个时候dom还没渲染，不能在该方法中进行dom操作，一般在此阶段准备数据。如果是异步准备数据，例如：ajax方式，则需要返回一个promise。

```js
var Widget = VdWidget.extend({
    ...

    _init: function() {
        var self = this;
        // 异步获取数据，返回promise
        return api.getData().then(function(data) {
            self.set('data', data);
        });
    }
});
```

#### _create

组件初始化，这个时候dom已经渲染完成，可以直接操作dom，如：初始化date-picker等第三方组件，绑定第三方非标准事件等。

```js
var Widget = VdWidget.extend({
    ...

    _create: function() {
        var $element = $(this.element),
            self = this;
        $element.find('select.query-name').on('change', function(e) {
            self.set('queryName', $(e.target).find('option:selected').text());
        });
        $element.find('.date-picker').datetimepicker({
            format: 'YYYY-MM-DD',
            locale: 'zh-cn'
        });
    }
});
```





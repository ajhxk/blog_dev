---
title: JavaScript原型
date: 2016-09-26 17:20:04
tags: JavaScript原型
---
当在JavaScript世界中走过不少旅程之后。再次萌发起研究这部分知识的欲望，翻阅了不少书籍和资料，才搞懂\__porto\__和prototype的概念。

# 一切皆为对象 

> 殊不知，JavaScript世界的对象，追根溯源来自于一个null。

> 万物初生时，一个null对象，凭空而生，接着Object、Function学着null的模样塑造了自己，并且它们彼此之间喜结连理，提供了prototype和constructor，一个给子孙提供了基因，一个则制造万千子孙。

> 在JS中，null也是作为一个对象存在，基于它基础的子子孙孙，当属对象。乍一看，null像是上帝，而Object和Function犹如JavaScript世界中的亚当与夏娃。

# 原型指针\__proto\__

在JavaScript中，每个对象都拥有一个原型对象，而指向该原型对象的内部则是\__proto\__,通过它可以从中继承原型对象的属性，原型是JavsScript中的基因链接，有了这个，才能知道这个对象的祖祖辈辈。从对象中的\__porto\__可以访问到他所继承的原型对象。
<!-- more --> 
``` javascript 
var a = new Array();
a.__proto__ === Array.prototype //true
```
上面代码中，创建了一个Array的实列a,该实例的原型指向了Array.prototype。
Array.prototype本身也是一个对象，也有继承的原型：
``` javascript
var a = new Array();
a.__proto__.__proto__ === Object.prototype  // true
// 等同于 Array.prototype.__proto__ === Object.prototype
```
这就说明了，Array本身也是继承自Object的，那么Object的原型指向的是谁呢？
``` javascript
var a = new Array();
a.__proto__.__proto__.__proto__ === null  // true
// 等同于 Object.prototype.__proto__ === null
```
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/__proto__.png)

所以说，Javascript中的对象，追根溯源都是来自于一个null对象。佛曰：万物皆空，善哉善哉。

除了使用.\__porto\__方式访问对象的原型，还可以通过Object.getPrototypeOf方法来获取对象的原型，以及通过Object.setPrototypeOf方法来重写对象的原型。

> 值得注意的是，按照语言标准，\__porto\__属性只有浏览器才需要部署，其他环境可以没有这个属性，而且前后的两个下划线，表示其本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用**Object.getPrototypeOf**和**Object.setPrototypeOf**,进行原型对象的读写操作。这里\__porto\__属性来描述对象中的原型，是因为这样来得更加形象，而且容易理解。

# 原型对象 prototype

函数作为JavaScript中的一等公民，它既是函数又是对象，函数的原型指向的是Function.prototype
``` javascript  函数实例的原型
var Foo = function() {}
Foo.__proto__ === Function.prototype // true
```

函数实例除了拥有\__porto\__属性之外，还拥有prototype属性。通过该函数构造的新的实例对象，其原型指针\__porto\__会指向该函数的prototype属性。
``` javascript 函数实例的prototype属性
var Foo = function() {}
var a = new Foo();
a.__proto__ === Foo.prototype; // true
```

而函数的prototype属性，本身是一个由Object构造的实列对象。
``` javascript 函数实例的prototype属性指向的对象
var Foo = function() {}
Foo.prototype.__proto__ === Object.prototype; // true
```

prototype属性很特殊，它还有一个隐式的constructor,指向了构造函数本身。
``` javascript 函数实例的prototype属性指向的对象的constructor属性
var Foo = function() {}
var a = new Foo();
Foo.prototype.constructor === Foo; // true
a.constructor === Foo; // true
a.constructor === Foo.prototype.constructor; // true
```
![prototype](http://odu8dcfmn.bkt.clouddn.com/prototype.png)

> PS:**a.construcror**属性并不属于a（a.hasOwnProperty("constructor") === false），而是读取的a.\__proto\__.constructor，所以上图用虚线表示a.constructor，方便理解。

# 原型链
**概念：**
原型链作为实现继承的主要方法，其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。
每个构造函数都有一个原型对象(prototype),原型对象都包含一个指向构造函数的指针(constructor),而实例都包含一个指向原型对象的内部指针(\__proto\__)。

那么，假如我们让原型对象等于另一个类型的实列，此时的原型对象将包含一个指向另一个原型的指针，相应的，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立。如此层层递进，就构造了实例与原型的链条，这就是原型链的基本概念。

**意义：**
“原型链”的作用在于，当读取对象的某个属性时，JavaScript引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。以此类推，如果直到最顶层的Object.prototype还是找不到，则返回undefine。

**亲子鉴定**
在JavaScript中，也存在鉴定亲子之间DNA关系的方法：
1. **instanceof** 运算符返回一个布尔值，表示一个对象是否由某个构造函数创建。
2. **Object.isPrototypeOf()** 只要某个对象处在原型链上，isProtypeOf都返回true
``` javascript 
var Bar = function(){},
    b = new Bar();
    b instanceof Bar // true
    Bar.prototype.isPrototypeOf(b) // true
    Object.prototype.isPrototypeOf(Bar) // true
```
要注意，实例b的原型是Bar.prototype而不是Bar

# 一张历史悠久的图
![一张历史悠久的图](http://odu8dcfmn.bkt.clouddn.com/%E4%B8%80%E5%BC%A0%E5%8E%86%E5%8F%B2%E6%82%A0%E4%B9%85%E7%9A%84%E5%9B%BE.png)

这是一张描述了Object、Function以及一个函数实例Foo于他们原型之间的联系。如果理解了上面的概念。这张图是不难读懂。

从上图中，能看到一个有趣的地方。
1. Function.prototype.\_proto\__指向了Object.prototype，这说明Function.prototype是一个Object实例，那么应当是先有的Object再有Function。
2. 但是Object.prototype.constructor.\__proto\__又指向了Function.prototype。这样看来，没有Function，Object也不能创建实例。

这就产生了一种类「先有鸡还是先有蛋」的经典问题，到底是先有的Object还是先有的Function呢？
这么哲学向的问题，留给你思考了。

我只是感慨：越往JavaScript的深处探索，越觉得这一门语言很哲学。
---
title: JavaScript继承
date: 2016-10-09 11:30:32
tags: JavaScript继承
---
继承是 OO 语言中的一个最为人津津乐道的概念。许多 OO 语言都支持两种继承方式：接口继承和实现继承。接口继承只继承方法签名，而实现继承则继承实际的方法。如前所述，由于函数没有签名，在 ECMAScript 中无法实现接口继承。 ECMAScript 只支持实现继承，而且其实现继承主要是依靠原型链来实现的。

# （一）原型链继承
这里将父类的实列赋值给子类原型对象实现继承。
``` javascript
var BigA = function () {
    this._biga = 'biga';
    this.name = ['a', 'b']
};

BigA.prototype.say = function () {
    console.log('biga');
};

BigA.prototype.Big = 'aaa';

var A = function () {};

A.prototype = new BigA();
A.prototype.constructor = BigA;

var newa = new A(),
    newb = new A();

newa.name.push('newa');
console.log(newa);
console.log(newa.name);
console.log(newb.name);
```
<!-- more -->   
打印结果如下图：
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/bb.png)
但如上图图所示该继承存在问题：
> 当原型中存在引用类型值时，**其包含引用类型值的原型属性会被所有实列共享**。在通过原型来实现继承时，原型实际上会变成另一个类型的实列。于是，原先的实列属性也就顺理成章地变成了现在的原型属性了。

# （二）借用构造函数继承
在子类型构造函数的内部调用超类型构造函数，通过apply来调整this指向实现继承。
``` javascript 
var BigA = function(){
    this._biga = '_biga';
    this.name = ['a','b'];
};    
BigA.prototype.say = function(){
    console.log('bigA');
};
BigA.prototype.Big = 'aaa';

var C = function(){
    BigA.apply(this,arguments);
};
```
打印结果如下图：
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/c.png)
此种继承方法所存在的问题：
> 可以从上图中看出子类**只继承了在构造函数内定义的属性和方法**，超类型原型对象上的属性和方法没有被继承。

# （三）组合继承
组合继承指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。
其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实列属性的继承。这样既通过在原型上定义方法实现了函数复用，又能保证每个实例都有它自己的属性。
``` javascript
var BigA = function(){
    this._biga = '_biga',
    this.name = ['a','b']
};    
BigA.prototype.say = function(){
    console.log('bigA');
};
BigA.prototype.Big = 'aaa';

var D = function(){
    BigA.apply(this,arguments);         //第二次调用了构造方法
};
D.prototype = new BigA();               //第一次调用了构造方法
D.prototype.constructor = D;
```
打印结果如下图：
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/_d.png)
此种继承方法所存在的问题：
> 可以从上图中看出子类中继承了超类型中构造函数中定义的属性和方法（name _biga）与原型对象中的属性和方法。**但是**在其由超类型原型对象继承来的方法和属性里面出现了(name _biga)属性，这里出现了重复。组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数的内部。子类型最终会包含超类型实例对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。

# （四）原型式继承
道格拉斯·克罗克福德在 2006 年写了一篇文章，题为 Prototypal Inheritance in JavaScript （JavaScript中的原型式继承）。在这篇文章中，他介绍了一种实现继承的方法，这种方法并没有使用严格意义上的构造函数。他的想法是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。为了达到这个目的，他给出了如下函数。
``` javascript
var BigA = function(){
    this._biga = '_biga',
    this.name = ['a','b']
};    
BigA.prototype.say = function(){
    console.log('bigA');
};
BigA.prototype.Big = 'aaa';

function object(o){
    function _F(){};
    _F.prototype = o;
    return new _F();
}

var _biga4 = new BigA(),E,_E;

E = object(_biga4);
E.name.push('here is E push');
E._biga = 'EEE';

_E = object(_biga4)
_E.name.push('here is _E push');
_E._biga = '_E_E'

console.log(E);
console.log(_E);
console.log(_biga4)
```
打印结果如下图：
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/e.png)
> 在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

# （五）寄生组合式继承
前面说过，组合继承是 JavaScript 最常用的继承模式；不过，它也有自己的不足。组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。

``` javascript
var BigA = function(){
    this._biga = '_biga',
    this.name = ['a','b']
},F;
BigA.prototype.say = function(){
    console.log('bigA');
};
BigA.prototype.Big = 'aaa';

function inheritPrototype(subType, superType){
    var prototype = object(superType.prototype);        //创建对象
    prototype.constructor = subType;                    //增强对象
    subType.prototype = prototype;                      //指定对象
}

F = function(){
    BigA.apply(this,arguments);
}
inheritPrototype(F,BigA);

var _f = new F();
_f.name.push('here is _f push');
console.log(_f);
console.log(new F())
```
打印结果如下图：(左：_f， 右：new F())
![\__porto\__](http://odu8dcfmn.bkt.clouddn.com/f.png)
> 所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。
---
title: JavaScript设计模式与开发实践--记录
date: 2016-09-22 17:10:16
tags: JavaScript
---
# 第一章 面向对象的JavaScript

## 动态类型与静态类型语言和鸭子类型
+  **静态类型语言**
      特点： 在编译时，便已确定变量的类型
      优点：首先是在编译时就能发现类型不匹配的错误，编译器可以帮助提前避免程序在运行期间有可能发生的错误。 其次，如果程序中明确地规定了数据类型，编译器还可以针对这些信息进行一些优化处理，提升程序执行速度。
      缺点：首先迫使程序员依照强契约来编写程序。增加额外的代码（类型声明）
<!-- more -->   

+ **动态类型语言**      
     特点：变量类型要到程序运行时，待变量被赋值之后，才会具有某种类型
     优点：代码量少，看起来简洁
     缺点：无法保证变量的类型 
          
+ **鸭子类型**
     通俗的说法是“如果走起来像鸭子，叫起来像鸭子，那么它就是一只鸭子”
     动态类型语言对变量类型的宽裕给实际编码带来了很大的灵活性，由于无需进行类型检测，我们可以尝试调用任意对象的任意方法，而无需考虑它原本是否被设计为拥有该方法。
``` javascript 鸭子类型js模拟 
    var duck = {
        duckSinging: function(){
            console.log('嘎嘎嘎');
        }
    };

    var chicken = {
        duckSinging: function(){
            console.log('嘎嘎嘎');
        }
    };

    var choir = [];

    var joinChoir = function(animal){
        if(animal && typeof animal.duckSinging === 'function'){
            choir.push(animal);
            console.log('恭喜加入合唱团');
            console.log('合唱团已有承你成员数量: '+choir.length);
        }
    };

    joinChoir(duck);
    joinChoir(chicken);
```

## 多态
+  **释意**
   “多态”一词源于希腊文ploymorphism,拆开来看是ploy(复数)+morph(形态)+ism从字面上我们可以理解为复数形态。
   多态的实际含义是：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。换句话说，给不同的对象发送同一个消息的时候，这些对象会根据这个消息分别给出不同的反馈。

### 一段“多态”的js代码
``` javascript 一段“多态”的js代码
(function(){
    var makeSound = function(animal){
        if(animal instanceof Duck){
            console.log('嘎嘎嘎');
        }else if(animal instanceof Chicken){
            console.log('咯咯咯');
        }
    };

    var Duck = function(){};
    var Chicken = function(){};

    makeSound(new Duck());
    makeSound(new Chicken());

    $testnEnd();
})();
```

### “多态”的js代码 优化
``` javascript 代码改进  把不变的部分隔离出来
(function(){
    var makeSound = function(animal){
        if(animal.sound instanceof Function) {
            animal.sound();
        }
    };

    var Duck = function(){};
    Duck.prototype.sound = function(){
        console.log('嘎嘎嘎');
    };

    var Chicken = function(){};
    Chicken.prototype.sound = function(){
        console.log('咯咯咯');
    };

    makeSound(new Duck());
    makeSound(new Chicken());

    $testnEnd();
})();
```
+  **注释**
这段代码确实体现了“多态性”，当我们分别向鸭和鸡发出“叫唤”的消息时，它们根据此消息作出了各自不同的反应。但这样的“多态性”是无法令人满意的，如果后来又增加了一只动物，比如狗，显然狗的叫声是“汪汪汪”，此时我们必须得改动makeSound函数，才能让狗也发出叫声。修改代码总是危险的，修改的地方越多，程序出错的可能性就越大，而且当动物的种类越来越多时，makeSound有可能变成一个巨大的函数
多态背后的思想是将“做什么”和“谁去做以及怎么去做”分离开来，也就是将“不变的事物”与“可能改变的事物”分离开来。在这个故事中，动物会叫，这是不变的，但是不同类型的动物具体怎么叫是可变的。把不变的部分分隔离出来，把可变的部分封装起来，这给予我们扩展程序的能力，程序看起来是可生长的，也是符合开发-封闭原则的，相对于修改代码来说，仅仅增加代码就能完成同样的功能，这显然优雅和安全很多。 



# 第二章 this、call和apply
 
## this
JS中this总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。

**this的指向**
除去不常用的with和eval情况，this的指向大致可以分为以下4种
* 作为对象发方法调用
* 作为普通函数调用
* 构造器调用
* Function.prototype.call或Function.prototype.apply调用

### 作为对象发方法调用
``` javascript 作为对象的方法调用  
//当函数作为对象的方法被调用时，this指向该对象：
(function(){
    var makeSound = function(animal){
        if(animal.sound instanceof Function) {
            animal.sound();
        }
    };

    var Duck = function(){};
    Duck.prototype.sound = function(){
        console.log('嘎嘎嘎');
    };

    var Chicken = function(){};
    Chicken.prototype.sound = function(){
        console.log('咯咯咯');
    };

    makeSound(new Duck());
    makeSound(new Chicken());

})();
```

### 作为普通函数调用
``` javascript 作为普通函数调用  
//当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的this总是指向全局对象。
window.name = 'globalName';

(function(){
    var getName = function(){
        return this.name;
    }

    console.log(getName());  //输出：gloalName

})();

(function(){
    var myObject = {
        name : 'seven',
        getName: function(){
            return this.name;
        }
    };

    var getName = myObject.getName;
    console.log(getName()); //globalName
    var getName2 = myObject.getName();
    console.log(getName2);  //seven

})();


window.id = 'window';
(function(){

    document.getElementById('div1').onclick = function(){
        console.log(this.id);   //输出:'div1'
        var callback = function(){
            console.log(this.id);   //输出:'window'
        };
        callback();
    };
})();

(function(){
    document.getElementById('div2').onclick = function(){
        var that = this;    //  保存div引用
        var callback = function(){
            console.log(that.id);   //输出div2
        };
        callback();
    };
})();
```

### 构造器调用
``` javascript 构造器调用
//构造器里this指返回的这个对象
(function(){
        var MyClass = function(){
            this.name = 'seven';
        };

        var obj = new MyClass();
        console.log(obj.name);  //输出：seven
})();
        
//注意1：
//如果构造器显示的返回了一个object类型的对象，那么此处运算结果最终会返回这个对象，而不是this
(function(){

    var MyClass = function(){
        this.name1 = 'seven';
        return {
            name1: 'anne'
        }
    };

    var obj = new MyClass();
    console.log(obj.name1);

    var returnObj = MyClass();
    console.log(returnObj.name1);
})();


//注意2:
//如果构造器不显示的返回任何数据，或者返回一个非对象类型的数据，就不会造成上述问题
(function(){
    var MyClass = function(){
        this.name2 = 'seven';
        return 'anne';  //返回string类型
    };

    var obj = new MyClass();
    console.log(obj.name2);  //输出：seven
    var returnString = MyClass();
    console.log(returnString);  //输出anne
})();
```

### 丢失的this
这是经常遇到的问题，我们先看下面代码：
``` javascript 丢失的this
(function(){
    var obj = {
        myName: 'seven',
        getName: function(){
            return this.myName;
        }
    };

    console.log(obj.getName());     //输出：seven

    var getName2 = obj.getName;
    console.log(getName2());        //输出： undefined
})();       
```
当调用obj.getName时，getName方法是作为obj对象的属性被调用的，此时this指向obj对象。
当用另外一个变量getName2来引用obj.getName,并且调用getName2时，此时是作为普通方法调用的this指向全局的window。

``` javascript document.getElementById代替函数 
//错误示列
(function(){
    var getId = document.getElementById;
    getId('div');     //此时会报错
})();
        
 // 改进01
(function(){
    var getId = function(id){
        return document.getElementById(id);
    };
    var a = getId('div1');
})();     
           
 //改进02
 (function(){
     document.getElementById = (function(func){
         return function(){
             return func.apply(document, arguments);
         }
     })(document.getElementById);

     var getId = document.getElementById;
     console.log(getId('div1'));
     console.log(document.getElementById('div1'));
 })();          
```
改进02:
原本getElementById是作为document对象里的属性被调用的，但是上面的代码将getElementById中的this指向了document,所以上面代码第一个return返回的是一个this指document的getElementById函数;此时该函数可以不用作为属性被调用，也能执行
**此处**将传进去的func函数指向了**document**

## call和apply
ECMAScript3给Function的原型定义了两个方法，它们是Function.prototype.call和Function.prototype.apply。

### call和apply的区别
Function.prototype.call和Function.prototype.apply都是非常常用的方法。它们的作用一模一样，区别仅在于传入的参数形式的不同。

**apply**接受两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数：
``` javascript apply
var func = function(a,b,c){
    alert([a,b,c]);   
}

func.apply(null,[1,2,3]);   //输出[1,2,3]

```
在这段代码中，参数1，2，3被放在数组中一起传入func函数，它们分别对应func参数列表中的a,b,c。

**call**传入的参数数量不固定，跟apply相同的是，第一个参数也是代表函数体内this指向。从第二个参数开始往后，每个参数被依次传入函数：
``` javascript apply
var func = function(a,b,c){
    alert([a,b,c]);   
}

func.call(null,1,2,3);   //输出[1,2,3]

```

> 当调用一个函数时，JavaScript的解释器并不会计较形参和实参在数量、类型以及顺序上的区别，JavaScript的参数在内部就是用一个数组来表示的。从这个意义上说，apply比call的使用率更高，我们不必关心具体有多少参数被传入函数，只要用apply一股脑的推过去就可以了。

> 当使用call或者apply的时候，如果我们传入的第一个参数为null，函数体内的this会指向默认的宿主对象，在浏览器中则是window。（严格模式下任然为null）

``` javascript 
var func = function(a,b,c){
    alert( this === window );
}

func.apply(null,[1,2,3]);   //出入true
```

### call和apply的用途
* 改变this指向
    ``` javascript
    var obj1 = {
        name: 'sven'
    };
    var obj2 = {
        name: 'anne'
    };
    window.name = 'window';
    
    var getName = function(){
        alert(this.name);
    };
    getName();                  //输出：window
    getName.call(obj1);         //输出：sven
    getName.call(obj2);         //输出：anne    
    ```

* Function.prototype.bind
    ``` javascript bind实现
    Function.prototype.bind = function(context){
        var self = this;                //保存原函数
        return  function(){             //返回一个新的函数
            return self.apply(context, arguments);   //放执行新的函数的时候，会把之前传入的context
                                                    //当作新函数体内的this
        }
    };
    var obj = {
        name: 'sven'
    };
    var func = function(){
        alert(this.name);   
    };
    window.name = 'window';
    func();                 //输出：window
    func.bind(obj)();       //输出：sven
    ```
    我们通过Function.prototype.bind来“包装”func函数。并且传入一个对象context当作参数，这个context对象就是我们想修正的this指向。
    在Function.prototype.bind的内部实现中，我们先把func函数的引用保存起来，然后返回一个新的函数。当我们在将来执行func函数时，实际上先执行的是这个刚刚返回的新函数。
    在新函数内部，self.apply(context,arguments)这句代码才是执行原来的func函数，并且指定context对象为func函数体内的this。
    
    ``` javascript bind方法优化
    
    Function.prototype.bind = function(){
        var self = this,                        //保存原函数
            context = [].shift.call(arguments), //需要绑定的this上下文
            args = [].slice.call(arguments);    //剩余的参数转成数组
            
        return function(){                      //返回一个新的函数
            var _args = [].concat.call(args, [].slice.call(arguments));
            return self.apply(context, _args);
        }
    }
    
    var obj = {
        name: 'sven'
    };
    
    window.name = 'window';
    
    var func = function(a,b,c,d){
        console.log(this.name);      
        console.log( [a,b,c,d] );
    };
    
    func(1,2,3,4);                      //window
                                        //[1,2,3,4]
                            
    func.bind(obj,'x','y')('a','b');    //sven
                                        //['x','y','a','b']
    ```
    优化后的bind方法允许可以往func函数中预先填入一些参数

* 借用其他对象的方法
    第一种场景是“借用构造函数”，通过这种技术，可以实现一些类似继承的效果：
    ``` javascript 借用构造函数
    var  A = function(name){
        this.name = name;
    };
    var B = function(){
        A.apply(this,arguments);
    };
    B.prototype.getName = function(){
        return this.name;
    };
    var b = new B('sven');
    console.log(b.getName());       //输出： 'sven'
    ```
    第二种运用场景 借用方法
    ``` javascript Array.prototype.push:
    (function(){
        Array.prototype.push.call(arguments,3);
        console.log(arguments);     //输出[1,2,3]
    })(1,2);    
    ```
    在操作arguments的时候，我们经常非常频繁地找Array.prototype对象借用方法。
    想把arguments转成真正的数组的时候，可以借用Array.prototype.slice方法；
    想截去argumrnts列表中的头一个元素时，又可以借用Array.prototype.shift方法。
    
    > 注意：Array.prototype.push方法的借用需要满足以下两个条件：
     * 对象本身要可以存取属性；
     * 对象的length属性可读写。
     
    ``` javascript 
        var a = 1;
        Array.prototype.push.call(a, 'first');
        console.log(a.length);      //输出: undefined
        console.log(a[0]);          //输出：undefined    
    ```      
#  第三章 闭包和高阶函数  
   
## 闭包

对于JavaScript程序员来说，闭包是一个必须征服的概念。闭包的形参与变量的作用域以及变量的生存周期密切相关。

### 变量的作用域
变量的作用域，就是指变量的有效范围，我们最常谈到的是在函数中声明的变量作用域。
当在函数中声明一个变量的时候，如果该变量前面没有带上关键字var，这个变量就会成为全局变量，这当然是一种命名冲突的做法。

另外一种情况就是用var关键字在函数中声明变量，这时候的变量即是局部变量，只有改函数内部才能访问到这个变量，在函数外面是访问不到的。代码如下：
``` javascript 
    var func = function(){
        var a = 1;
        console.log(a);        
    };
    func();  //输出：1
    console.log(a);     //输出： Uncaught ReferenceError : a is not defined
```  
<!-- more -->   
在JavaScript中，函数可以用来创造函数作用域。此时的函数像一层半透明的玻璃，在函数里面可以看到外面的变量，而在函数外面则无法看到函数里面的变量。这是因为当在函数中搜索一个变量的时候，如果该函数内并没有声明这个变量，那么此次搜索的过程会随着代码执行环境创建的作用域链往外层逐层搜索，一直搜索到全局对象为止。变量的搜索是从内到外而非从外到内的。

下面这段包含了嵌套函数的代码，也许能帮助我们加深对变量搜索过程的理解：

``` javascript 
var a = 1;

var func1 = function(){
    var b = 2;
    var func2 = function(){
        var c = 3;
        console.log(b);     //输出：2
        console.log(a);     //输出：1
    }
    func2();
    console.log(c);         //Uncaught ReferenceError: c is not defined
}

func1();
``` 

### 变量的生存周期
除了变量的作用域之外，另外一个根闭包有关的概念是变量的生存周期。
对于全局变量来说，全局变量的生存周期当然是永久的，除非我们主动销毁这个全局变量。

而对于在函数内用var关键字声明的局部变量来说，当退出函数时，这些局部变量即失去了它们的价值，它们都会随着函数调用的结束而被销毁：

``` javascript 
var func = function(){
    var a = 1;  //退出函数后局部变量a将被销毁
    console.log(a);
}

func();
``` 
接下来看下一段代码
``` javascript 
var func = function(){
    var a = 1;  
    return function(){
        a++;
        console.log(a);
    }
}

var f = func();
f();    //输出：2
f();    //输出：3
f();    //输出：4
```   
> 跟我们之前的推论相反，当退出函数后，局部变量a并没有消失，而是似乎一直在某个地方存活着。这是因为当执行var f = func();时，f返回了一个匿名函数的引用，它可以访问到func()被调用时产生的环境，而局部变量a一直处在这个环境里。既然局部变量所在的环境还能被外界访问，这个局部变量就有了不被销毁的理由。
> 在这里产生了一个闭包结构，局部变量的生命看起来被延续了。
 

``` html  
<!-- 闭包的经典应用 -->
<html>
    <body>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <script>
            var nodes = document.getElementsByTagName('div');
            
            for( var i = 0;len = nodes.length;i<len;i++){
                nodes[i].onclick = function(){
                    console.log(i);
                }
            };
        </script>
    </body>
</html>    
``` 

测试这段代码就会发现，无论点击哪个div最后打印的结果都是5。
这是因为div节点的onclick事件是异步触发的，当事件被触发的时候，for循环早已结束，此时变量i的值已经是5，所以在div的onclick事件函数中顺着作用域链从内到外查找变量i时，查到的值都是5.

``` javascript 
/* 解决办法 */
for(var i=0,len=nodes.length; i<len; i++){
    (function(i){
        nodes[i].onclick = function(){
            console.log(i);
        }
    })(i)
}
``` 
在闭包的帮助下，把每次循环的i值都封闭起来。当在事件函数中顺着作用域链中从内到外查找变量i时，会先找到被封闭在闭包环境中的i，如果有5个div，这里的i就分别是0，1，2，3，4。         
     
### 闭包的更多作用
1. 封装变量
闭包可以帮助把一些不需要暴露在全局的变量**封装成“私有变量”**。假设有一个计算乘积的简单函数：
``` javascript 
var mult = function(){
    var a = 1;
    for(var i=0,l = arguments.length; i<l; i++){
        a = a*arguments[i];
    }
    return a;
};
``` 
mult函数接受一些number类型的参数，并返回这些参数的乘积。现在我们觉得对于相同的参数来说，可以加入**缓存机制**来提高这个函数的性能：
``` javascript 
    var cache = {};
    var mult = function(){
        var args = Array.prototype.join.call(arguments, ',');
        if(cache[args]){
            console.log('cache');
            return cache[args];
        }
        var  a = 1;
        for(var i=0,l=arguments.length; i<l; i++){
            a = a * arguments[i];
        }
        return cache[args] = a;
    };
``` 
我们看到cache这个变量仅仅在mult函数中被使用，与其让cache变量跟mult函数一起平行地暴露在全局作用域下，不如把它**封装在mult函数内部**，这样可以减少页面中的全局变量，以避免这个变量在其他地方被不小心修改：
``` javascript 
        var mult = (function(){
            var cache = {};

            return function (){
                var args = Array.prototype.join.call(arguments, ',');
                if( args in cache){
                    return cache[args];
                }
                var a = 1;
                for(var i=0,l=arguments.length; i<l; i++){
                    a = a * arguments[i];
                }
                return cache[args] = a;
            }

        })();
``` 
**提炼函数**是代码重构中一种常见的技巧。如果在一个大函数中有一些代码块能够独立出来，我们常常把这些代码块封装在独立的小函数里面。独立出来的小函数有助于代码复用，如果这些小函数有一个良好的命名，它们本身也起到了注释的作用。如果这些小函数不需要在程序的其他地方使用最好是把他们用闭包封闭起来。代码如下：
``` javascript 
        var mult = (function(){
            var cache = {},
                calculate = function(){     //封闭calculate函数
                    var a = 1;
                    for(var i=0,len=arguments.length; i<len; i++){
                        a = a * arguments[i];
                    }
                    return a;
                };

            return function (){
                var args = Array.prototype.join.call(arguments, ',');
                if( args in cache){
                    console.log('cache')
                    return cache[args];
                }
                return cache[args] = calculate.apply(null,arguments);
            }

        })();
``` 
2. 延续局部变量的寿命
img对象经常用于进行数据上报，如下图所示：
``` javascript 
var report = function(src){
    var img = new Image();
    img.src = src;
};
report('http://xxx.com/getUserInfo');
``` 
但是通过查询后台记录我们得知，因为一些低版本浏览器的实现存在bug，report函数并不是每一次都成功发起http请求。丢失数据的原因是img是report函数中的局部变量，当report函数的调用结束后，img局部变量即被销毁，而此时或许还没来得及发出http请求，所以此次请求就会丢失。
现在我们把img变量用闭包封闭起来。便能解决请求丢失问题：
``` javascript 
var report = (function(){
    var imgs = [];
    return function(src){
        var img = new Image();
        imgs.push(img);
        img.src = src;
    }
)();
``` 

### 闭包和面向对象设计
以下是通过闭包实现面向对象
``` javascript 
    var extent = (function(){
        var a = 1;

        return {
            add: function(){
                a++;
                console.log(a);
            }
        }
    })();
    extent.add();   //输出2
    extent.add();   //输出3
    extent.add();   //输出4
``` 
换成面向对象的写法，就是：
``` javascript 
    var extent= {
        value:0,
        add:function(){
            this.value++;
            console.log(this.value);
        }
    }；
   
    /* 或者 */
    var Extent = function(){
        this.value = 0;
    };
    Extent.prototype.call = function(){
        this.value++;
        console.log(this.value);
    };
    var extent = new Extenet();
    extent.add();
    extent.add();
    extent.add();
``` 

## 高阶函数
高阶函数是指至少满足下列条件之一的函数。
* 函数可以作为参数被传递；
* 函数可以作为返回值输出。

JavaScript语言中的函数显然满足高阶函数的条件，在实际开发中，无论是将函数当做参数传递，还是让函数的执行结果返回另外一个函数。这两种情形都有很多应用场景。下面就列举一些高阶函数的应用场景。
### 函数作为参数传递
把函数当作参数传递，这代表我们可以抽离出一部分容易变化的业务逻辑，把这部分业务逻辑放在函数参数中，这样一来可以分离业务代码中变化与不变的部分。其中一个重要的场景就是回调函数。

1. 回调函数
``` javascript 
var appendDiv = function(callback){
    for(var i = 0;i<100;i++){
        var div = document.createElement('div');
        div.innerHTML = i;
        document.body.appendChild(div);
        if(typeof callback === 'function' ){
            callback(div);
        {
    }
};
appendDiv(function(node){
    node.style.display = 'none';
})
``` 
可以看到，隐藏节点的请求实际上是由客户发起的，但是客户并不知道节点什么时候会创建好，于是把隐藏节点的逻辑放在了回调函数中。“委托”给appendDiv方法，appendDiv方法当然知道节点什么时候创建好，所以在节点创建好的时候，appendDiv会执行之前客户传入的回调函数。

2. Array.prototype.sort
Array.prototype.sort接受一个函数当作参数，这个函数里面封装了数组元素的排序规则。从Array.prototype.sort的使用可以看到，我们的目的是对数组进行排序，这是不变的部分；而使用什么规则去排序，则是可变的部分。把可变的部分封装在函数参数里，动态传入Array.prototype.sort,使Array.prototype.sort方法成为了一个非常灵活的方法，代码如下

    ``` javascript 
    // 从小到大排列
    [1,4,3].sort(function(a,b){
        return a - b;
    });     //输出[1,3,4]
    
    //从大到小排列
    [1,4,3].sort(function(){
        return b - a;
    });     //输出[4,3,1]
    ``` 
 
---
title: closure
date: 2018-10-23 23:19:31
tags:
---

以下是自己查阅资料总结归纳关于闭包的相关点：

## 定义:

 <b>《JavaScript高级程序设计》</b>
 闭包是指有权限访问另一个函数作用域中的变量的函数;
 
 <b>《JavaScript权威指南》</b>
 从技术角度讲,所有的JavaScript函数都是闭包:他们都是对象,他们都关联到作用域链；
 
 <b>《你不知道的JavaScript》</b>
 当函数可以记住并访问所在的词法作用域时,就产生了闭包,即使函数是在当前词法作用域之外执行；
 
 <b>MDN</b>
 闭包是函数和声明该函数的词法环境的组合。
 
 <!-- more --> 
ECMAScript中，闭包指的是：

1、从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
2、从实践角度：以下函数才算是闭包：
    1、即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
    2、在代码中引用了自由变量

## 分析:
先来看个列子
``` javascript 
var scope = 'global_scope';
function checkscope(){
    var scope = 'local_scope';
    function f(){
        return scope;
    }
    return f;
}
var foo = checkscope();
foo();
```

首先分析一下这段代码中执行上下文栈和执行上下文的变化情况。
这里给出简要的执行过程:

1、进入全局代码,创建全局执行上下文,全局执行上下文压入执行上下文栈；
2、全局执行上下文初始化；
3、执行checkscope函数,创建checkscope函数执行上下文,checkscope执行上下文被压入执行上下文栈；
4、checkscope执行上下文初始化，创建变量对象、作用域链、this等；
5、checkscope函数执行完毕，checkscope执行上下文从执行上下文栈中弹出；
6、执行f函数，创建f函数执行上下文，f执行上下文被压入执行上下文栈；
7、f执行上下文初始化，创建变量对象、作用域链、this等；
8、f函数执行完毕，f函数上下文从执行上下文栈中弹出；

思考：当f函数执行的时候，checkscope函数上下文已经被销毁了，为什么还能读取到checkscope作用域下的scope值呢？

原来f执行上下文维护了一个作用域链(如下)
``` text
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO]
}
```
f函数依然可以读到checkscopeContext.AO的值，说明当f函数引用了checkscopeContext.AO中的值的时候，即使checkscopeContext被销毁了，但是JavaScript依然会让checkscopeContext.AO保存在内存中,f函数依然可以通过f函数的作用域链找到它,正是因为JavaScript做到了这一点,从而实现了闭包的这个概念。

## 总结:
<b>某个函数在定义时的词法作用域之外的地方被调用,闭包可以使该函数访问定义时的词法作用域。
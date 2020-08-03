// console.log('zzl');
// let str = require('./a.js');
// console.log(str);

// require('./index.css');
require('./a.css');

// require('./index.less');

// // function * gen(params) {
// //     yield 1;
// // }

// // console.log(gen.then().next())

// let fn = () => {
//     console.log('log')
// }

// fn()

// @log
// class A { // es7
//     a = 1;
// }

// let a = new A();
// console.log(a.a)


// function log(target) {
//     console.log(target, '25')
// }

// import $ from 'jquery' // 内联loader
// import $ from 'expose-loader?$!jquery'
// require("expose-loader?$!jquery");
// console.log($)
// console.log(window.$)


// a、在js中创建图片引入；b、在css中引入 background(url)；c、<img src=""  alt=""/>
import logo from './asset/img/bg.jpg'
let image = new Image();
image.src = logo
document.body.appendChild(image)
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Logo=t():e.Logo=t()}(self,(function(){return(()=>{"use strict";var e={484:(e,t,n)=>{function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}n.d(t,{default:()=>ye});var u=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0;a(this,e);var r=this.make(t,n);this.x=r.x,this.y=r.y}return i(e,[{key:"make",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1?arguments[1]:void 0;return"object"==r(e)&&(t=e.y,e=e.x),void 0===t&&(t=e),{x:e,y:t}}}]),i(e,[{key:"add",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0,r=this.make(t,n);return new e(this.x+r.x,this.y+r.y)}},{key:"sub",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0,r=this.make(t,n);return new e(this.x-r.x,this.y-r.y)}},{key:"mul",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0,r=this.make(t,n);return new e(this.x*r.x,this.y*r.y)}},{key:"div",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0,r=this.make(t,n);return new e(this.x/r.x,this.y/r.y)}},{key:"clamp",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1?arguments[1]:void 0,r=this.make(t,n);return new e(t=Math.max(r.x,Math.min(this.x,r.x)),n=Math.max(r.y,Math.min(this.y,r.y)))}},{key:"length",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:"normalize",value:function(){var t=this.length();return 0==t?new e(0,0):this.div(t)}},{key:"neg",value:function(){return new e(-this.x,-this.y)}},{key:"toAngle",value:function(){return(360+180*Math.atan2(this.y,this.x)/Math.PI)%360}},{key:"rotate",value:function(e){var t=this.toAngle(),n=this.length();return s(t+e).mul(n)}},{key:"lerp",value:function(t,n){return new e((1-n)*this.x+n*t.x,(1-n)*this.y+n*t.y)}},{key:"clone",value:function(){return new e(this.x,this.y)}}]),e}();function s(e){var t=e*Math.PI/180;return new u(Math.cos(t),Math.sin(t))}u.fromAngle=s;const c=u;var l={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},f={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},d=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],h={CSS:{},springs:{}};function p(e,t,n){return Math.min(Math.max(e,t),n)}function v(e,t){return e.indexOf(t)>-1}function y(e,t){return e.apply(null,t)}var g={arr:function(e){return Array.isArray(e)},obj:function(e){return v(Object.prototype.toString.call(e),"Object")},pth:function(e){return g.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||g.svg(e)},str:function(e){return"string"==typeof e},fnc:function(e){return"function"==typeof e},und:function(e){return void 0===e},nil:function(e){return g.und(e)||null===e},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return g.hex(e)||g.rgb(e)||g.hsl(e)},key:function(e){return!l.hasOwnProperty(e)&&!f.hasOwnProperty(e)&&"targets"!==e&&"keyframes"!==e}};function m(e){var t=/\(([^)]+)\)/.exec(e);return t?t[1].split(",").map((function(e){return parseFloat(e)})):[]}function x(e,t){var n=m(e),r=p(g.und(n[0])?1:n[0],.1,100),a=p(g.und(n[1])?100:n[1],.1,100),o=p(g.und(n[2])?10:n[2],.1,100),i=p(g.und(n[3])?0:n[3],.1,100),u=Math.sqrt(a/r),s=o/(2*Math.sqrt(a*r)),c=s<1?u*Math.sqrt(1-s*s):0,l=s<1?(s*u-i)/c:-i+u;function f(e){var n=t?t*e/1e3:e;return n=s<1?Math.exp(-n*s*u)*(1*Math.cos(c*n)+l*Math.sin(c*n)):(1+l*n)*Math.exp(-n*u),0===e||1===e?e:1-n}return t?f:function(){var t=h.springs[e];if(t)return t;for(var n=1/6,r=0,a=0;;)if(1===f(r+=n)){if(++a>=16)break}else a=0;var o=r*n*1e3;return h.springs[e]=o,o}}function b(e){return void 0===e&&(e=10),function(t){return Math.ceil(p(t,1e-6,1)*e)*(1/e)}}var w,k,M=function(){var e=.1;function t(e,t){return 1-3*t+3*e}function n(e,t){return 3*t-6*e}function r(e){return 3*e}function a(e,a,o){return((t(a,o)*e+n(a,o))*e+r(a))*e}function o(e,a,o){return 3*t(a,o)*e*e+2*n(a,o)*e+r(a)}return function(t,n,r,i){if(0<=t&&t<=1&&0<=r&&r<=1){var u=new Float32Array(11);if(t!==n||r!==i)for(var s=0;s<11;++s)u[s]=a(s*e,t,r);return function(s){return t===n&&r===i||0===s||1===s?s:a(function(n){for(var i=0,s=1;10!==s&&u[s]<=n;++s)i+=e;--s;var c=i+(n-u[s])/(u[s+1]-u[s])*e,l=o(c,t,r);return l>=.001?function(e,t,n,r){for(var i=0;i<4;++i){var u=o(t,n,r);if(0===u)return t;t-=(a(t,n,r)-e)/u}return t}(n,c,t,r):0===l?c:function(e,t,n,r,o){var i,u,s=0;do{(i=a(u=t+(n-t)/2,r,o)-e)>0?n=u:t=u}while(Math.abs(i)>1e-7&&++s<10);return u}(n,i,i+e,t,r)}(s),n,i)}}}}(),O=(w={linear:function(){return function(e){return e}}},k={Sine:function(){return function(e){return 1-Math.cos(e*Math.PI/2)}},Circ:function(){return function(e){return 1-Math.sqrt(1-e*e)}},Back:function(){return function(e){return e*e*(3*e-2)}},Bounce:function(){return function(e){for(var t,n=4;e<((t=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((3*t-2)/22-e,2)}},Elastic:function(e,t){void 0===e&&(e=1),void 0===t&&(t=.5);var n=p(e,1,10),r=p(t,.1,2);return function(e){return 0===e||1===e?e:-n*Math.pow(2,10*(e-1))*Math.sin((e-1-r/(2*Math.PI)*Math.asin(1/n))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach((function(e,t){k[e]=function(){return function(e){return Math.pow(e,t+2)}}})),Object.keys(k).forEach((function(e){var t=k[e];w["easeIn"+e]=t,w["easeOut"+e]=function(e,n){return function(r){return 1-t(e,n)(1-r)}},w["easeInOut"+e]=function(e,n){return function(r){return r<.5?t(e,n)(2*r)/2:1-t(e,n)(-2*r+2)/2}},w["easeOutIn"+e]=function(e,n){return function(r){return r<.5?(1-t(e,n)(1-2*r))/2:(t(e,n)(2*r-1)+1)/2}}})),w);function A(e,t){if(g.fnc(e))return e;var n=e.split("(")[0],r=O[n],a=m(e);switch(n){case"spring":return x(e,t);case"cubicBezier":return y(M,a);case"steps":return y(b,a);default:return y(r,a)}}function P(e){try{return document.querySelectorAll(e)}catch(e){return}}function S(e,t){for(var n=e.length,r=arguments.length>=2?arguments[1]:void 0,a=[],o=0;o<n;o++)if(o in e){var i=e[o];t.call(r,i,o,e)&&a.push(i)}return a}function j(e){return e.reduce((function(e,t){return e.concat(g.arr(t)?j(t):t)}),[])}function I(e){return g.arr(e)?e:(g.str(e)&&(e=P(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function C(e,t){return e.some((function(e){return e===t}))}function D(e){var t={};for(var n in e)t[n]=e[n];return t}function E(e,t){var n=D(e);for(var r in e)n[r]=t.hasOwnProperty(r)?t[r]:e[r];return n}function B(e,t){var n=D(e);for(var r in t)n[r]=g.und(e[r])?t[r]:e[r];return n}function T(e){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(t)return t[1]}function F(e,t){return g.fnc(e)?e(t.target,t.id,t.total):e}function N(e,t){return e.getAttribute(t)}function L(e,t,n){if(C([n,"deg","rad","turn"],T(t)))return t;var r=h.CSS[t+n];if(!g.und(r))return r;var a=document.createElement(e.tagName),o=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;o.appendChild(a),a.style.position="absolute",a.style.width=100+n;var i=100/a.offsetWidth;o.removeChild(a);var u=i*parseFloat(t);return h.CSS[t+n]=u,u}function z(e,t,n){if(t in e.style){var r=t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=e.style[t]||getComputedStyle(e).getPropertyValue(r)||"0";return n?L(e,a,n):a}}function q(e,t){return g.dom(e)&&!g.inp(e)&&(!g.nil(N(e,t))||g.svg(e)&&e[t])?"attribute":g.dom(e)&&C(d,t)?"transform":g.dom(e)&&"transform"!==t&&z(e,t)?"css":null!=e[t]?"object":void 0}function W(e){if(g.dom(e)){for(var t,n=e.style.transform||"",r=/(\w+)\(([^)]*)\)/g,a=new Map;t=r.exec(n);)a.set(t[1],t[2]);return a}}function H(e,t,n,r){switch(q(e,t)){case"transform":return function(e,t,n,r){var a=v(t,"scale")?1:0+function(e){return v(e,"translate")||"perspective"===e?"px":v(e,"rotate")||v(e,"skew")?"deg":void 0}(t),o=W(e).get(t)||a;return n&&(n.transforms.list.set(t,o),n.transforms.last=t),r?L(e,o,r):o}(e,t,r,n);case"css":return z(e,t,n);case"attribute":return N(e,t);default:return e[t]||0}}function V(e,t){var n=/^(\*=|\+=|-=)/.exec(e);if(!n)return e;var r=T(e)||0,a=parseFloat(t),o=parseFloat(e.replace(n[0],""));switch(n[0][0]){case"+":return a+o+r;case"-":return a-o+r;case"*":return a*o+r}}function $(e,t){if(g.col(e))return function(e){return g.rgb(e)?(n=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(t=e))?"rgba("+n[1]+",1)":t:g.hex(e)?function(e){var t=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(e,t,n,r){return t+t+n+n+r+r})),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+",1)"}(e):g.hsl(e)?function(e){var t,n,r,a=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),o=parseInt(a[1],10)/360,i=parseInt(a[2],10)/100,u=parseInt(a[3],10)/100,s=a[4]||1;function c(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}if(0==i)t=n=r=u;else{var l=u<.5?u*(1+i):u+i-u*i,f=2*u-l;t=c(f,l,o+1/3),n=c(f,l,o),r=c(f,l,o-1/3)}return"rgba("+255*t+","+255*n+","+255*r+","+s+")"}(e):void 0;var t,n}(e);if(/\s/g.test(e))return e;var n=T(e),r=n?e.substr(0,e.length-n.length):e;return t?r+t:r}function Q(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function Y(e){for(var t,n=e.points,r=0,a=0;a<n.numberOfItems;a++){var o=n.getItem(a);a>0&&(r+=Q(t,o)),t=o}return r}function X(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return function(e){return 2*Math.PI*N(e,"r")}(e);case"rect":return function(e){return 2*N(e,"width")+2*N(e,"height")}(e);case"line":return function(e){return Q({x:N(e,"x1"),y:N(e,"y1")},{x:N(e,"x2"),y:N(e,"y2")})}(e);case"polyline":return Y(e);case"polygon":return function(e){var t=e.points;return Y(e)+Q(t.getItem(t.numberOfItems-1),t.getItem(0))}(e)}}function Z(e,t){var n=t||{},r=n.el||function(e){for(var t=e.parentNode;g.svg(t)&&g.svg(t.parentNode);)t=t.parentNode;return t}(e),a=r.getBoundingClientRect(),o=N(r,"viewBox"),i=a.width,u=a.height,s=n.viewBox||(o?o.split(" "):[0,0,i,u]);return{el:r,viewBox:s,x:s[0]/1,y:s[1]/1,w:i,h:u,vW:s[2],vH:s[3]}}function G(e,t,n){function r(n){void 0===n&&(n=0);var r=t+n>=1?t+n:0;return e.el.getPointAtLength(r)}var a=Z(e.el,e.svg),o=r(),i=r(-1),u=r(1),s=n?1:a.w/a.vW,c=n?1:a.h/a.vH;switch(e.property){case"x":return(o.x-a.x)*s;case"y":return(o.y-a.y)*c;case"angle":return 180*Math.atan2(u.y-i.y,u.x-i.x)/Math.PI}}function R(e,t){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=$(g.pth(e)?e.totalLength:e,t)+"";return{original:r,numbers:r.match(n)?r.match(n).map(Number):[0],strings:g.str(e)||t?r.split(n):[]}}function _(e){return S(e?j(g.arr(e)?e.map(I):I(e)):[],(function(e,t,n){return n.indexOf(e)===t}))}function J(e){var t=_(e);return t.map((function(e,n){return{target:e,id:n,total:t.length,transforms:{list:W(e)}}}))}function K(e,t){var n=D(t);if(/^spring/.test(n.easing)&&(n.duration=x(n.easing)),g.arr(e)){var r=e.length;2!==r||g.obj(e[0])?g.fnc(t.duration)||(n.duration=t.duration/r):e={value:e}}var a=g.arr(e)?e:[e];return a.map((function(e,n){var r=g.obj(e)&&!g.pth(e)?e:{value:e};return g.und(r.delay)&&(r.delay=n?0:t.delay),g.und(r.endDelay)&&(r.endDelay=n===a.length-1?t.endDelay:0),r})).map((function(e){return B(e,n)}))}var U={css:function(e,t,n){return e.style[t]=n},attribute:function(e,t,n){return e.setAttribute(t,n)},object:function(e,t,n){return e[t]=n},transform:function(e,t,n,r,a){if(r.list.set(t,n),t===r.last||a){var o="";r.list.forEach((function(e,t){o+=t+"("+e+") "})),e.style.transform=o}}};function ee(e,t){J(e).forEach((function(e){for(var n in t){var r=F(t[n],e),a=e.target,o=T(r),i=H(a,n,o,e),u=V($(r,o||T(i)),i),s=q(a,n);U[s](a,n,u,e.transforms,!0)}}))}function te(e,t){return S(j(e.map((function(e){return t.map((function(t){return function(e,t){var n=q(e.target,t.name);if(n){var r=function(e,t){var n;return e.tweens.map((function(r){var a=function(e,t){var n={};for(var r in e){var a=F(e[r],t);g.arr(a)&&1===(a=a.map((function(e){return F(e,t)}))).length&&(a=a[0]),n[r]=a}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}(r,t),o=a.value,i=g.arr(o)?o[1]:o,u=T(i),s=H(t.target,e.name,u,t),c=n?n.to.original:s,l=g.arr(o)?o[0]:c,f=T(l)||T(s),d=u||f;return g.und(i)&&(i=c),a.from=R(l,d),a.to=R(V(i,l),d),a.start=n?n.end:0,a.end=a.start+a.delay+a.duration+a.endDelay,a.easing=A(a.easing,a.duration),a.isPath=g.pth(o),a.isPathTargetInsideSVG=a.isPath&&g.svg(t.target),a.isColor=g.col(a.from.original),a.isColor&&(a.round=1),n=a,a}))}(t,e),a=r[r.length-1];return{type:n,property:t.name,animatable:e,tweens:r,duration:a.end,delay:r[0].delay,endDelay:a.endDelay}}}(e,t)}))}))),(function(e){return!g.und(e)}))}function ne(e,t){var n=e.length,r=function(e){return e.timelineOffset?e.timelineOffset:0},a={};return a.duration=n?Math.max.apply(Math,e.map((function(e){return r(e)+e.duration}))):t.duration,a.delay=n?Math.min.apply(Math,e.map((function(e){return r(e)+e.delay}))):t.delay,a.endDelay=n?a.duration-Math.max.apply(Math,e.map((function(e){return r(e)+e.duration-e.endDelay}))):t.endDelay,a}var re=0,ae=[],oe=function(){var e;function t(n){for(var r=ae.length,a=0;a<r;){var o=ae[a];o.paused?(ae.splice(a,1),r--):(o.tick(n),a++)}e=a>0?requestAnimationFrame(t):void 0}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",(function(){ue.suspendWhenDocumentHidden&&(ie()?e=cancelAnimationFrame(e):(ae.forEach((function(e){return e._onDocumentVisibility()})),oe()))})),function(){e||ie()&&ue.suspendWhenDocumentHidden||!(ae.length>0)||(e=requestAnimationFrame(t))}}();function ie(){return!!document&&document.hidden}function ue(e){void 0===e&&(e={});var t,n=0,r=0,a=0,o=0,i=null;function u(e){var t=window.Promise&&new Promise((function(e){return i=e}));return e.finished=t,t}var s=function(e){var t=E(l,e),n=E(f,e),r=function(e,t){var n=[],r=t.keyframes;for(var a in r&&(t=B(function(e){for(var t=S(j(e.map((function(e){return Object.keys(e)}))),(function(e){return g.key(e)})).reduce((function(e,t){return e.indexOf(t)<0&&e.push(t),e}),[]),n={},r=function(r){var a=t[r];n[a]=e.map((function(e){var t={};for(var n in e)g.key(n)?n==a&&(t.value=e[n]):t[n]=e[n];return t}))},a=0;a<t.length;a++)r(a);return n}(r),t)),t)g.key(a)&&n.push({name:a,tweens:K(t[a],e)});return n}(n,e),a=J(e.targets),o=te(a,r),i=ne(o,n),u=re;return re++,B(t,{id:u,children:[],animatables:a,animations:o,duration:i.duration,delay:i.delay,endDelay:i.endDelay})}(e);function c(){var e=s.direction;"alternate"!==e&&(s.direction="normal"!==e?"normal":"reverse"),s.reversed=!s.reversed,t.forEach((function(e){return e.reversed=s.reversed}))}function d(e){return s.reversed?s.duration-e:e}function h(){n=0,r=d(s.currentTime)*(1/ue.speed)}function v(e,t){t&&t.seek(e-t.timelineOffset)}function y(e){for(var t=0,n=s.animations,r=n.length;t<r;){var a=n[t],o=a.animatable,i=a.tweens,u=i.length-1,c=i[u];u&&(c=S(i,(function(t){return e<t.end}))[0]||c);for(var l=p(e-c.start-c.delay,0,c.duration)/c.duration,f=isNaN(l)?1:c.easing(l),d=c.to.strings,h=c.round,v=[],y=c.to.numbers.length,g=void 0,m=0;m<y;m++){var x=void 0,b=c.to.numbers[m],w=c.from.numbers[m]||0;x=c.isPath?G(c.value,f*b,c.isPathTargetInsideSVG):w+f*(b-w),h&&(c.isColor&&m>2||(x=Math.round(x*h)/h)),v.push(x)}var k=d.length;if(k){g=d[0];for(var M=0;M<k;M++){d[M];var O=d[M+1],A=v[M];isNaN(A)||(g+=O?A+O:A+" ")}}else g=v[0];U[a.type](o.target,a.property,g,o.transforms),a.currentValue=g,t++}}function m(e){s[e]&&!s.passThrough&&s[e](s)}function x(e){var l=s.duration,f=s.delay,h=l-s.endDelay,g=d(e);s.progress=p(g/l*100,0,100),s.reversePlayback=g<s.currentTime,t&&function(e){if(s.reversePlayback)for(var n=o;n--;)v(e,t[n]);else for(var r=0;r<o;r++)v(e,t[r])}(g),!s.began&&s.currentTime>0&&(s.began=!0,m("begin")),!s.loopBegan&&s.currentTime>0&&(s.loopBegan=!0,m("loopBegin")),g<=f&&0!==s.currentTime&&y(0),(g>=h&&s.currentTime!==l||!l)&&y(l),g>f&&g<h?(s.changeBegan||(s.changeBegan=!0,s.changeCompleted=!1,m("changeBegin")),m("change"),y(g)):s.changeBegan&&(s.changeCompleted=!0,s.changeBegan=!1,m("changeComplete")),s.currentTime=p(g,0,l),s.began&&m("update"),e>=l&&(r=0,s.remaining&&!0!==s.remaining&&s.remaining--,s.remaining?(n=a,m("loopComplete"),s.loopBegan=!1,"alternate"===s.direction&&c()):(s.paused=!0,s.completed||(s.completed=!0,m("loopComplete"),m("complete"),!s.passThrough&&"Promise"in window&&(i(),u(s)))))}return u(s),s.reset=function(){var e=s.direction;s.passThrough=!1,s.currentTime=0,s.progress=0,s.paused=!0,s.began=!1,s.loopBegan=!1,s.changeBegan=!1,s.completed=!1,s.changeCompleted=!1,s.reversePlayback=!1,s.reversed="reverse"===e,s.remaining=s.loop,t=s.children;for(var n=o=t.length;n--;)s.children[n].reset();(s.reversed&&!0!==s.loop||"alternate"===e&&1===s.loop)&&s.remaining++,y(s.reversed?s.duration:0)},s._onDocumentVisibility=h,s.set=function(e,t){return ee(e,t),s},s.tick=function(e){a=e,n||(n=a),x((a+(r-n))*ue.speed)},s.seek=function(e){x(d(e))},s.pause=function(){s.paused=!0,h()},s.play=function(){s.paused&&(s.completed&&s.reset(),s.paused=!1,ae.push(s),h(),oe())},s.reverse=function(){c(),s.completed=!s.reversed,h()},s.restart=function(){s.reset(),s.play()},s.remove=function(e){ce(_(e),s)},s.reset(),s.autoplay&&s.play(),s}function se(e,t){for(var n=t.length;n--;)C(e,t[n].animatable.target)&&t.splice(n,1)}function ce(e,t){var n=t.animations,r=t.children;se(e,n);for(var a=r.length;a--;){var o=r[a],i=o.animations;se(e,i),i.length||o.children.length||r.splice(a,1)}n.length||r.length||t.pause()}ue.version="3.2.1",ue.speed=1,ue.suspendWhenDocumentHidden=!0,ue.running=ae,ue.remove=function(e){for(var t=_(e),n=ae.length;n--;)ce(t,ae[n])},ue.get=H,ue.set=ee,ue.convertPx=L,ue.path=function(e,t){var n=g.str(e)?P(e)[0]:e,r=t||100;return function(e){return{property:e,el:n,svg:Z(n),totalLength:X(n)*(r/100)}}},ue.setDashoffset=function(e){var t=X(e);return e.setAttribute("stroke-dasharray",t),t},ue.stagger=function(e,t){void 0===t&&(t={});var n=t.direction||"normal",r=t.easing?A(t.easing):null,a=t.grid,o=t.axis,i=t.from||0,u="first"===i,s="center"===i,c="last"===i,l=g.arr(e),f=l?parseFloat(e[0]):parseFloat(e),d=l?parseFloat(e[1]):0,h=T(l?e[1]:e)||0,p=t.start||0+(l?f:0),v=[],y=0;return function(e,t,g){if(u&&(i=0),s&&(i=(g-1)/2),c&&(i=g-1),!v.length){for(var m=0;m<g;m++){if(a){var x=s?(a[0]-1)/2:i%a[0],b=s?(a[1]-1)/2:Math.floor(i/a[0]),w=x-m%a[0],k=b-Math.floor(m/a[0]),M=Math.sqrt(w*w+k*k);"x"===o&&(M=-w),"y"===o&&(M=-k),v.push(M)}else v.push(Math.abs(i-m));y=Math.max.apply(Math,v)}r&&(v=v.map((function(e){return r(e/y)*y}))),"reverse"===n&&(v=v.map((function(e){return o?e<0?-1*e:-e:Math.abs(y-e)})))}return p+(l?(d-f)/y:f)*(Math.round(100*v[t])/100)+h}},ue.timeline=function(e){void 0===e&&(e={});var t=ue(e);return t.duration=0,t.add=function(n,r){var a=ae.indexOf(t),o=t.children;function i(e){e.passThrough=!0}a>-1&&ae.splice(a,1);for(var u=0;u<o.length;u++)i(o[u]);var s=B(n,E(f,e));s.targets=s.targets||e.targets;var c=t.duration;s.autoplay=!1,s.direction=t.direction,s.timelineOffset=g.und(r)?c:V(r,c),i(t),t.seek(s.timelineOffset);var l=ue(s);i(l),o.push(l);var d=ne(o,e);return t.delay=d.delay,t.endDelay=d.endDelay,t.duration=d.duration,t.seek(0),t.reset(),t.autoplay&&t.play(),t},t},ue.easing=A,ue.penner=O,ue.random=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};const le=ue;function fe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function de(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?fe(Object(n),!0).forEach((function(t){he(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):fe(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function he(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function pe(e,t,n,r){var a=t.lineWidth,o=le.timeline({loop:!!t.loop,direction:t.alternate?"alternate":"normal"}),i=function(t){return function(e,t,n){var r=n.elem;if("string"==typeof r&&(r=e.getElementById(r)),r){if(delete n.elem,n.stroke||n["stroke-reversed"]){n.attr="stroke-dashoffset",n.elemAttr=n.elemAttr||{};var a=1;if("line"==r.tagName){var o=parseFloat(r.getAttribute("x1")),i=parseFloat(r.getAttribute("y1")),u=parseFloat(r.getAttribute("x2")),s=parseFloat(r.getAttribute("y2")),l=new c(o,i);a=new c(u,s).sub(l).length()}else a=r.pathLength;n.elemAttr["stroke-dasharray"]=a,r.setAttribute("stroke-dasharray",a),n["stroke-reversed"]?(n.from=0,n.to=a):(n.from=a,n.to=0)}var f=n.attr,d=(n.duration,n.from),h=n.to,p=n.dur,v=n.easing,y=n.offset,g=[{duration:0},{duration:p}];g[0][f]=d,g[1][f]=h,t.add({targets:r,duration:p,easing:v||"linear",keyframes:g},y||"+=0")}}(e,o,t)};i({elem:"circle",attr:"stroke-width",from:0,to:a,dur:200,easing:"easeInOutQuad"});var u={dur:250,stroke:!0,easing:"easeInOutQuad"};return i(de(de({},u),{},{elem:"zSegment0",offset:"-=100"})),i(de(de({},u),{},{elem:"zSegment1"})),i(de(de({},u),{},{elem:"zSegment2"})),i(de(de({},u),{},{elem:"lSegment0",offset:n})),i(de(de({},u),{},{elem:"lSegment1",offset:r})),o}var ve={basic:pe,semiSyncroEnd:function(e,t){return pe(e,t,"-=250")},syncroEnd:function(e,t){return pe(e,t,"-=500","-=250")}};const ye={draw:function(e){var t=document.createElementNS("http://www.w3.org/2000/svg","svg"),n=function(e,n,r){r||(r=t);var a=document.createElementNS("http://www.w3.org/2000/svg",e);for(var o in n)a.setAttribute(o,n[o]);return r.appendChild(a),a},r=e.color,a=e.radius,o=e.padding,i=e.lineWidth,u=e.lStartAngle,s=e.zAngles0,l=e.zAngles1,f=e.zAngles2,d=e.isPath,h=new c(2*(a+o),2*(a+o)),p=h.div(2);t.setAttribute("xmlns","http://www.w3.org/2000/svg"),t.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),t.setAttribute("version","1.1"),t.setAttribute("width",3*h.x+"px"),t.setAttribute("height",3*h.y+"px"),t.setAttribute("preserveAspectRatio","xMidYMin meet"),t.setAttribute("viewBox","0 0 ".concat(h.x," ").concat(h.y));var v=function(e,t,r,o,i){if(!d)return n("line",{x1:e.x,y1:e.y,x2:t.x,y2:t.y,r:a,fill:"none",stroke:o,"stroke-width":r,id:i});var u=t.sub(e),s=new c(u.y,-u.x).normalize().mul(r/2);n("line",{x1:e.x+s.x,y1:e.y+s.y,x2:t.x+s.x,y2:t.y+s.y,r:a,fill:"none",stroke:o,"stroke-width":1}),n("line",{x1:e.x-s.x,y1:e.y-s.y,x2:t.x-s.x,y2:t.y-s.y,r:a,fill:"none",stroke:o,"stroke-width":1})};!function(e,t,r,a,o){if(!d)return n("circle",{cx:e.x,cy:e.y,r:t,fill:"none",stroke:a,"stroke-width":r,id:"circle"});n("circle",{cx:e.x,cy:e.y,r:t-r/2,fill:"none",stroke:a,"stroke-width":1}),n("circle",{cx:e.x,cy:e.y,r:t+r/2,fill:"none",stroke:a,"stroke-width":1})}(p,a,i,r||"red");for(var y=[s-90,-s-90,l-90,f-90].map((function(e){return c.fromAngle(e).mul(a).add(p)})),g=[],m=0;m<y.length-1;m++){var x=y[m],b=y[m+1];g.push({p1:x,p2:b}),v(x,b,i,r||"red","zSegment"+m)}var w=c.fromAngle(u-90).mul(a).add(p),k=function(e,t,n,r){var a=(e.x-t.x)*(n.y-r.y)-(e.y-t.y)*(n.x-r.x),o=((e.x*t.y-e.y*t.x)*(n.x-r.x)-(e.x-t.x)*(n.x*r.y-n.y*r.x))/a,i=((e.x*t.y-e.y*t.x)*(n.y-r.y)-(e.y-t.y)*(n.x*r.y-n.y*r.x))/a;return new c(o,i)}(g[1].p1,g[1].p2,w,w.add(0,1)),M=function(e,t,n,r){var a,o,i,u,s,l,f,d,h,p;return p={},(h={}).x=r.x-n.x,h.y=r.y-n.y,p.x=n.x-e.x,p.y=n.y-e.y,a=h.x*p.x+h.y*p.y,o=2*(h.x*h.x+h.y*h.y),a*=-2,i=Math.sqrt(a*a-2*o*(p.x*p.x+p.y*p.y-t*t)),isNaN(i)?[]:(s=(a+i)/o,f={},d={},l=[],(u=(a-i)/o)<=1&&u>=0&&(f.x=n.x+h.x*u,f.y=n.y+h.y*u,l[0]=new c(f)),s<=1&&s>=0&&(d.x=n.x+h.x*s,d.y=n.y+h.y*s,l[l.length]=new c(d)),l)}(p,a,k,k.add(g[2].p2.sub(g[2].p1).normalize().mul(a*a)))[0];return v(w,k,i,r||"red","lSegment0"),v(k,M,i,r||"red","lSegment1"),t},animate:function(e,t){var n=ve[t.anim];return n&&n(e,t)},anims:ve}}},t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}return n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n(484)})().default}));
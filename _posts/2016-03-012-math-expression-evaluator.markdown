---
layout: post
title:  "Code Golf - Math expression evaluator"
date:   2016-03-12 21:52:28 -0500
image:
   url: http://lapinozz.github.io/assets/image/code_golf_post_tumbnail.gif
categories: learning
description: Writting a simple math expression evaluator in the less amount of characyer possible in C++
tags:
- code golf
- C++
- IRC
---

# Code Golf
Code Gold are challenge where you have to write code in the least amount of character possible.


I was on the IRC server of SFML (irc.boxbox.org), on the C++ channel (#c++) and someone was asking how to implement a Math Expression Evaluator. Basically something that takes a string like this `2+2` and evaluate the result (in this case `4`). At first it might look like a really simple case, but actually there is quite a few things to think about and it's not as straight forward as it seems. Consider this expression `((2-3+2*(3-6)-1)/2.5)*(5+3^2)`. If we want to compute the correct result, we have to take into account brackets and operator precedence.

# The Rules

It's at that moment that someone suggested that we could do a Code Gold challenge where we have to write a math expression evaluator. He also suggested the following rules.

- The code most run on Cee

    Cee is a bot running on the IRC server that let you execute code. You can execute code using a command like this `.g++ int main(){cout << "Hello";}` and the bot will compile, execute and answer back with the output of the program.
  
- The code must be in C/C++
    
- No preprocessor instruction allowed

     So no #define, Cee dosen't allow proprocessor directive anyway. Don't worrie for #include,
     Cee already  include most standard header.
     
- Support basic arithmetic operator

    * \+ : Addition
    * \- : Subtraction
    * \* : Multiplication
    * / : Division
    * ^ : Exponent
    
    
- Respect operator precedences and brackets
    
    `2+2*2` is not the same as `(2+2)*2`
    
- Whitespace and newline count as characters

- Input is taken as follows and is not accounted in the character count
    
    `<type> <variable name> = <optional caste>"<expression>";`
    
    eg:`char* i = (char*)"((2-3+2*(3-6)-1)/2.5)*(5+3^2)";`

- The result of the expression must be output to stdout

- You must declare main and it counts in the score


# My entry

Here it is. But be careful, you might turn blind.

{% highlight cpp %}
char* i = (char*)"((2-3+2*(3-6)-1)/2.5)*(5+3^2)";using F=float;F z();F y(F a=z()){return*i==94?i++,y(pow(a,z())):a;}F x(F a=y()){return*i-47&&*i-42?a:x(*i++-47?a*y():a/y());}F w(F a=x()){return*i-45&&*i-43?a:w(a+x());}F z(){F r;return*i==40?i++,r=w(),i++,r:strtof(i,&i);}int main(){std::cout<<w();}
{% endhighlight %}{:class="highlight-linewrap"}

Final count: 250 (remember, the input part dont't count)


I'm not going to explain how the code work, but here's some of the tricks I used to make it that small. By the way, if you happen to make a shorter version or shorten mine, be sure to send it to me! Here's the code with space and new line to make it easier to analyze. As I said earlier, the rules forbid preprocesor instruction in the code and #include too. If you want to compile it without using the bot you will need to include `iostream` and `math.h`.

{% highlight cpp %}
char* e = (char*)"((2-3+2*(3-6)-1)/2.5)*(5+3^2)"; //−44.8
using F=float;

F z();

F y(F a=z())
{
    return*e==94?e++,y(pow(a,z())):a;
}

F x(F a=y())
{
    return*e-47&&*e-42?a:x(*e++-47?a*y():a/y());
}

F w(F a=x())
{
    return*e-45&&*e-43?a:w(a+x());
}

F z()
{
    F r;
    return*e==40?e++,r=w(),e++,r:strtof(e,&e);
}

int main()
{
    std::cout<<w();
}
{% endhighlight %}


####Using alias = Type

Near the beginning of the code you can see `using F=float;`. For those who don't know, it's a C++11 feature equivalent to `typedef float F;` but it is 2 characters shorter to use the `using` version. The type `float` is used 9 times and we save 4 chars each time, less the `using` declaration of 14 chars. That make an optimization of 12 chars.


####Ternary Operator

Ternary operator are really convenient when doing code golf. Rather than doing 

{% highlight cpp %}
if(condition){ /*Do things if true*/ }else{ /*Do things if false*/ }
{% endhighlight %}

They let you do 

{% highlight cpp %}
condition ? /*Do things if true*/ : /*Do things if false*/
{% endhighlight %}

Plus, they can be used as an expression like this.

{% highlight cpp %}
std::string s = isReady ? "Ready!" : "Not Ready!";
someFunction(5 + ( isReady && isAlive ? 17 * getLive() : getDeadCount()));
{% endhighlight %}

Where if you were using `if` you would probably do.

{% highlight cpp %}
std::string s;
if(isReady)
    s = "Ready!"
else 
    s = "Not Ready!";

if(isReady && isAlive)
    someFunction(5 + 17 * getLive());
else
    someFunction(5 + getDeadCount());
{% endhighlight %}

That's some massive optimization. And it even stays quite readable when you are used to them.


####Comma Operator

The comma operator(`operator,`) basically evaluates both operand and return the second one.


That lets you replace this code

{% highlight cpp %}
if(foo)
{
    someRandomFunction();
    v = i * 7;
    answerToTheUniverse = 42;
    i = compute(v, answerToTheUniverse);
}
else
    i = 7;
{% endhighlight %}

By this one.

{% highlight cpp %}
i = foo ? someRandomFunction(),v = i * 7,answerToTheUniverse = 42,compute(v, answerToTheUniverse):7;
{% endhighlight %}

When golfing, it doesn't matter if the code is unreadable as long as it's as small as possible. This optimization might seem insignificant but is actually really useful, especially when things have to be executed is specific order, eg: `return *e == 94 ? e++, y(pow(a,z())) : a;`. Here `e` had to be incremented before calling the function `y`. 


####Using the shortest form for const

At multiple place you can see that I check for equality between `*e` and various numbers like `94` or `40`. Those numbers are the ASCII code for the arithmetic operator. Rather than comparing with `'+'`, we compare directly with `43`. which is the ASCII code for the character "+". It's a simple and easy trick, we tend to overlook what's easy and obvious. It's actually one of the last change i made.

{% highlight text %}
'+' = 43
'-' = 45
'/' = 47
'*' = 42 
'^' = 94
'(' = 40
{% endhighlight %}


####Taking advantage of the STL

The STL is full of function which can make your code way shorter, learning to use the right one at the right place is part of code golf. In my code I used `strtof`. This function takes a `char*` to a null terminated string representing a float, eg `-127.45634`. It also takes a `char**`, a pointer to a pointer to a char. It will set this char pointer so that it point at the end of the parsed float. If I have `char* a = "+145.3hello"` and call `strtof(a, &a)` then `a` is now pointing to the `hello` part of the string. And since `strtof` also parse "+" and "-", I don't even have to manually handle subtraction since `strtof` will return a negative number for me and `a - b` is the same as `a + -b`.


#Conclusion

Code Golf are a pretty fun to do and are good occasion to discover new language feature or learn new way to write specifique statement(even if most of the time they become absolutely unreadable). If I remember correctly, there is a dedicated subreddit on redit and subsite on stackexchange just for code golf. I hope it this was useful to you. If you have any suggestion or anything else to say, you can comment in the box below or send me a message.


*[IRC]: Internet Relay Chat

[part 1]: {{site.url}}learning/2016/02/02/Messing-with-vtables.html


---
layout: post
title:  "Code Challenge - Self Replicating Code"
date:   2016-04-06 08:22:23 -0500
image:
   url: http://lapinozz.github.io/assets/image/self_replicating_post_thumbnail.jpeg
categories: learning
tags:
- C++
- IRC
- Quine
- Challenge
---

# Quine

A program that outputs its own source code, preferably without reading a file, is called a Quine. One of the simplest example is as follows 

{% highlight cpp %}
#include<stdio.h>
main(){char*a="#include<stdio.h>%cmain(){char*a=%c%s%c;printf(a,10,34,a,34);}";printf(a,10,34,a,34);}
{% endhighlight %}

This is the base I used for this challenge.

# The constraint

Just like for [the math expression parser challenge](http://lapinozz.github.io/learning/2016/03/13/math-expression-evaluator.html) I was on the IRC server boxbox.org but this time on the channel #sfml where multiple bot are present. The idea had come multiple time to try and create a loop between multiple bot. After some time someone stumbled across #two command of two bot that made them intereact, to understand this process you have to know that most bot where ignoring each other and ignoring their own messages. Once the commands found the real challenge could start, writing a self replicating code that could fit with them! Two bots were needed for the completion of this self imposed challenge.


# Cee

Cee let you execute arbitrary C++ code. There are four ways to invoke the execution of code. Note that you can not use preprocessor command and that most header will be added for you.

* `.g++ << "Something"`
        
    Cee will automaticly put the code following the "<<" in a `std::cout << _your code_ << std::endl inside of main`
        
* `.g++ {int i; cout << i}`
    
    Cee will add `int main()` at the begining for you
    
* `.g++ int main(){}`
    
    Here Cee will only add the security code and the include
    
* `cee: << "Something"`
    
    this is the part that interess us
        
    
# Marybeth

Marybeth is a multipurpose bot, for this we only need one of her command. The `.in` command let you set a reminder ex: `.in 10m pasta is ready` and in 10 minutes Marybeth will print `yourNick: pasta is ready`

# The trick

If you send `.g++ << ".in 1s << \".in 1s nearly recursion!\""`

First cee will output `.in 1s << ".in 1s nearly recursion!"`

One second later Marybeth will output `cee: << ".in 1s nearly recursion!"`

Which make cee output `.in 1s nearly recursion!`

And at last one second later Marybeth print `cee: nearly recursion!`


The problem with this code is that if you want the loop to happen 10 times you have to make the code 10 times longer and it will still end. That's where we need Quine!

# The Code

The problem is that every Quine I could find or think of required to store a string in some kind of variable. The code need to be inserted inside `cout << *here* << endl` and you can't really create a variable in that statement. So I searched for something in the STL where I could store a `char*` and retrieve it twice, that's all I needed but no matter what I could not find anything. Then I finally found, the rdbuf function of ios, `ios::rdbuf`.

It takes a `streambuf*`, what a `streambuf` is is completely irrevelante to our purpose. I simply cast `char*` to `streambuf*` to store it and `streambuf*` to `char*` when retrieving. Of course, this is entirely horrible and is absolutely not to use in real code. Note that if the code were to use cin, it would most likely crash.

{% highlight cpp %}
//Note: I added new line to "help" readability
<< (cin.rdbuf((streambuf*)".in 2s << (cin.rdbuf((streambuf*)%c%s%c),
printf((char*)cin.rdbuf(),34, (char*)cin.rdbuf(), 34),(char)0)"),
printf((char*)cin.rdbuf(),34, (char*)cin.rdbuf(), 34),(char)0)
{% endhighlight %}

It works pretty much like the first example but modified to work with commands and the rdbuf trick.

# Conclusion

Maybe this a bit confusing or you don't care for those bots commands, if so, sorry about that. For myself this is the kind of challenge I like. Exploring the concept of quine and their implications was quite instructing. I hope you had has much fun as I did reading this beautiful code.


*[IRC]: Internet Relay Chat
*[SFML]: Simple And Fast Library

[the math expression parser challenge]: http://www.lapinozz.github.io


---
layout: post
title:  "Game developement in Assembly"
date:   2016-03-28 15:36:54 -0500
image:
   url: http://lapinozz.github.io/assets/image/assembly_post_thumbnail.png
categories: project
tags:
- Assembly
- Gamedev
- Logic Gate
github: https://github.com/lapinozz/ASM-PROJECT
---

# Why? Why would you make a game in Assembly?

This is generally the first question I get when someone enter my stream on [livecoding] . The most honest answer I can give is simply, for the fun! Of course it is also helpful for practicing things like architecture. I've found that it is harder to go back and modify the way a part of the program work when developing in Assembly, especially if the architecture is flawed. So using Assembly is a way to force me to think more about the design of the code. Also, i've always loved challenges.

# What kind of game are you making

It's a logic circuit simulator. You place logic gate to make a circuit. How is that a game, will you ask. The plan is that you will have "mission", you are given a set of input and rules and you have to create a circuit that takes those inputs and follow the rules to generate the correct output. You will also have to create component like Adder because the in main campaign the goal will be to create a complete CPU, each mission of the campaign explore a part of the CPU and help you create the chips you will need to complete it. The cricuit are grid based and work a bit like the Conway game of life. The current version use mouse, but I'm planning on using only keyboard both to make development easier and also because it will give it a better and faster to use interface.

# Is it only Assembly? What assembler do you use?

My code is entirely in Assembly, I do use a C library called CSFML and the libc. CSFML is the C binding of SFML which is a library I used a lot and am very familiar with. I use nasm to assemble the code and GCC to link it. I did a couple of tests and could not get it to run on windows, from what I understood some calling convention are a little different, I might make a windows version later.

# That's pretty cool, can we see the code?

Sure, the code is, like for practically all of my projects, on github and free to use.

# You said you were streaming on livecoding.com?

Yes, I found it help motivation and keep me from procrastinating and doing other things while coding. Each time I work on this project I stream it at [on my channel on livecoding] . Feel free to join, it's always pleasing to have company while coding.

# Is it hard?

That's a tricky question. Assembly has a reputation of begin very hard to read and difficult to learn. It is not entirely false, I don't think that Assembly language in itself is harder than other programming language. I think the reason why it is considered so hard is because it often come with a bunch of low level concept. For example, I did some operating system development at some point and then there is a lot of stuffs to learn, addressing modes, interrupts, real and protected mode, etc. You really have to learn how computers work inside. For a project like this circuit simulator, it's much easier, especially considering that I do it using CSFML and the libc. Anyone that already knows C can learn it very fast.

# Conclusion

This is a side side project on which i don't work very often. Still, this is one of my favorite project and I can always be sure to have fun when I work on it. I'm not sure when i'll finish it or if it will be even near of what I imagine, but from the current state of the project I think it's quite doable.



*[IRC]: Internet Relay Chat

[this one]: http://www.primaryobjects.com/2013/01/27/using-artificial-intelligence-to-write-self-modifying-improving-programs/

[livecoding]: livecoding.com
[on my channel on livecoding] https://www.livecoding.tv/lapinozz/


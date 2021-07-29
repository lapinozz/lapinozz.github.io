---
layout: post
title:  "Rubber Duckies and practical trolling"
date:   2021-05-29 17:21:23 -0500
image:
   url: /assets/image/ducky/icon.png
categories: project
description: That time I pranked my colleague by installing my virus on his computer
tags:
- Electronics
- Arduino
---

# The Troll

Leaving your computer unlocked when you leave to get some coffee is a risk. It's a security risk as someone could just walk up and exploit the free admin access to your computer, from which point they could do any number of things like install a backdoor or copy important files. But most importantly, it's a very powerful troll magnet. There's no better prank than changing someone's background while they are not looking.

# Rubber ducky

A rubber ducky is a tiny little Arduino-like board that features an Attiny85 chip and a little protrusion on the PCB which just the right shape and lines to be inserted in a USB port.

I soldered headers on those for some reason but they usually come without those which gives them a really tight footprint.

![image](/assets/image/ducky/duckies1.png) 
![image](/assets/image/ducky/duckies2.png){:style="max-height:360px;position:relative;left:50%;transform:translateX(-50%)"}    

The idea behind those devices is that they can simulate a keyboard, with the ability to send thousands of characters per seconds. Now if you had some nefarious intentions and you managed to either plug this device in an unlocked computer or trick someone in doing so themselves you could easily make it install a virus or extract information. If you are slightly less evil you might also realize that it is the perfect trolling tool.

It also works as a normal Attiny85 so you can control a led or read some switch for example. I toyed with this a little to make one where you could switch which script it would execute. (There used to be two additional switches on this but at some point I stole them for another project)

![image](/assets/image/ducky/switched.png){:style="max-height:500px"}  

They also come in other form factor, with better chips or a micro sd card reader, etc.

# The plan

Those devices are great but are quite limited, if you want to type a lot of text the storage quickly becomes a problem. Luckily people are smart and have thought about ways to circumvent the issue. If the target computer has access to internet you can:

- Open the Windows start menu ("Windows Key")
- Open an administrator Powershell (Type "powershell" then press Ctrl+Shift+Enter to launch as admin)
- Say yes to the admin prompt ("Left Arrow" to select the yes button then "Enter" to confirm)
- Use a powershell command that will download a script and run it immediately

![image](/assets/image/ducky/explanation.png){:style="max-height:720px;position:relative;left:50%;transform:translateX(-50%)"}  

This way you have no limit on the size of the script. I used a combination of [GitHub's gists](https://gist.github.com/) and [TinyUrl](https://tinyurl.com) to both keep the URL short and be able to modify the script as I develop it.

# The Rootkit

At this point I had a couple of fun powershell scripts working but it was clear that powershell windows floating around had nothing stealthy about them. It's possible to launch a powershell script with no window but I knew the first thing any competent person would do is to open the Task Manager where they would immediately spot the quite suspicious powershell processes, I needed a better way. 

Thing is, Windows is designed in such a way so that no process can "hide" itself. In other word, a program able to hide itself is essentially a virus ([Unless you're Sony and you think you're the most important thing on earth](https://en.wikipedia.org/wiki/Sony_BMG_copy_protection_rootkit_scandal)). A rootkit is a software, or group of software, designed to maintain access to a system and to conceal itself. After reading a bit on the subject I decided to go the quick and dirty way; injecting a DLL into every running process on the machine.

DLL injection is a method by which you make a program load a piece of code and then execute it in the program itself. On your code is running in the program it can alter its memroy and even its code. For example, [ZwQueryDirectoryFileReal](https://docs.microsoft.com/en-us/windows-hardware/drivers/ddi/ntifs/nf-ntifs-ntquerydirectoryfile) is a function to list the files in a directory. Pretty much all calls a program makes to query the files in a directory go through this function as it's a system function and the way to go to interface with the OS. This function gets loaded in memory somewhere, we can get the address of the function, make that part of memory temporarily writable then put our own code there. This code could do anything but the most useful thing to do in our case is to look at the queried path, if it points to something we want to hide, we return the same thing the original function would return if the path didn't exist. If we don't care about this path then we just call the original function and forward it's return value. Same applies for the function responsible for listing processes. Now we just have to inject that code into all the running programs and monitor new ones so we can inject it into them too.

The code "injector" I made for this is called [Vaccinator](https://github.com/lapinozz/Vaccinator) and the DLL it injects is [Kernel64](https://github.com/lapinozz/Vaccinator)

# The pranking

I want to make it very clear that I wouldn't do this on just anyone, nor should you. The person I did this to was sitting right next to me, we joked a lot about locking your computer when you get up,  which he always forgot to do, and he was actually well aware of what I was working on. 

That said, here's what the final scripts were doing:

- Periodically change his wallpaper (Of course)
- Trigger Text-To-Speech randomly ("I will lock my computer", "Computer compromised", "All systems hacked", "Never Forget, Never Forgive, Expect Us", "Once upon a time, I forgot to lock his computer", "Trollollollollollollollollolloll")
- Periodically open/close CD tray
- And most importantly, hide all the relevant processes and files

It was easy to deploy, just wait for him to get up, leaving his computer unlocked, stick the little thing in a USB port(our keyboards had very accessible ports on the back), screen briefly flashes a console and voila!

# The Defusing

I was so sure, so certain, my code was so perfect. He would have to capitulate, there was _no_ way he could defeat my beautiful system.

Turns out by opening a powershell window through the start menu it left it in the history. He didn't fail to notice that and upon opening a shell he just had to press the up arrow to see the history of commands where he found the address of my script. That script contained links to other scripts and to the GitHub repository of [Vaccinator](https://github.com/lapinozz/Vaccinator) where it was pretty easy to spot the [code I had left to deactivate all the hiding functions](https://github.com/lapinozz/Vaccinator/blob/master/Kernel64/dllmain.cpp#L38) when a file with a specific name was place at the root of the C drive.

If I had just cleared the powershell command history he probably wouldn't have found a way to deactive my scripts. They could have been more aggressive anyways but this was just for fun. Turned out pretty funnny in the end.
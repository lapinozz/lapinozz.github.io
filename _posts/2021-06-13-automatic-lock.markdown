---
layout: post
title:  "DIY Smart Door-Lock"
date:   2021-06-13 1:21:23 -0500
image:
   url: /assets/image/lock/icon.png
categories: project
description: How I made a lock that automatically lock and unlocks my door as I leave or approach my home.
tags:
- Electronics
- Arduino
---

# The Repetition

There are things you do every day, they don't always take long, but they always make me dream of a way to automate them. A task I found of no value and wished to automate is the action of locking and unlocking my front door. The whole process of getting my keys out, selecting the right one, inserting it correctly into the keyhole and turning is incredibly gratifying. I began to dream of a system that would do it all for me, without any involvement on my part. Of course this might take more time to make then it would save me but that's without counting the fun I would have in building it and the immense satisfaction I would get each time I passed my door.

![image](/assets/image/lock/xkcd.png "xkcd 1205")
{:.image-caption}
[*xkcd 1205*](https://xkcd.com/1205/)

# The Perfect Lock

My idea was to make a lock that would automatically unlock the door as I arrive home and lock it when I leave. I started looking for a way to detect when I come close and away from home. Immediately I decided to disregard geolocalisation because I wanted something more reliable and didn't want to require having any program running on my phone. I then looked into Bluetooth, but it wasn't clear if there would be an easy and reliable way to detect my phone from an Arduino through Bluetooth. Finally, I realized my phone connects to my Wi-Fi when I get close to home and if I assign it a static IP I could simply ping it continuously to see if it was connected to the network. It might not be the cleanest solution but it was easy to get working and so I went with it. 

I'm still amazed at the price and availability of microcontroller these days. I can get a couple of Arduino Nano and ESP8266 for a few bucks.  I already had some Nanos lying around for exactly this kind of project and had recently purchased ESP8266 and NodeMCU boards as I never had the chance to mess with Wi-Fi in my electronics project so far.

Here's the Nano and ESP I used on a prototype board and a little 5v to 3v converter to power the ESP.

![image](/assets/image/lock/nano_esp2.png)

# The Hardware

One of the requirement of my design was to not modify the current lock mechanism. My rent contract explicitly stated that I was forbidden from changing the key and I wanted something that would be simple to remove when the time comes. It was also important that you can still open the lock with the key for any of those occasions:

- landlords should still be able to access
- as any maintenance personnel like a plumber
- if I give a key to a friend
- in the inevitable case of my system crashing
- for the unfortunate situation of a power outage

This means that I could not couple a motor directly to the lock, as the resistance of the motor would prevent you from easily turning the key.
My door fashions a deadbolt lock similar to this:

![image](/assets/image/lock/lock.png)

After some time of thinking passively about it I figured out that this shape would allow the handle of the deadbolt to rotate 90 degrees from the action of the key while also allowing for the shape to rotate the lock by applying a 180 degrees rotation. 

![image](/assets/image/lock/deadbolt_animation.gif)
![image](/assets/image/lock/mount_animation.gif)

I made the circular piece was made out of layers of foam board panels with the middle cut in that hourglass shape. To rotate it I used a motor already integrated with a gearbox, that made it slower but gave it more torque, I extracted from a toy years ago. Since this is just a simple DC motor there wasn't a way to know the current angle of the motor. To be able to rotate it accurately I placed a little tab on the circular piece and three sensors around it, one at locking position, one at unlocking position and finally one in the center relaxed position to allow the handle to move freely without having any force from the motor on it.

![image](/assets/image/lock/sensors.gif)

For the sensors I used some LM393 wheel speed sensor I had lying around. The sensor is composed of two little arms and sends a signal when there's something between them. And here's the thing with the motor and all the sensors mounted in all its glory. In retrospect I really should have trimmed all the wires a bit more.

![image](/assets/image/lock/wip.png)

I also added two buttons on the top to lock/unlock and an on/off switch.


# The Software

Controlling the motors and reading the states of the sensors was quite easy, it wasn't my first Arduino project and I got it out of the way very quickly. Now I had to get the Nano and the ESP8266 talking together. The ESP works on 3.3v, and I used a little 5v to 3v convert to power it. I also needed something so they could talk together and I tried to use a level shifter IC which is supposed to enable a 5v chip to communicate with a 3.3v chip without damaging them by shifting the voltage level on each side but I couldn't get it to work so in the end I used the cheap and dirty solution of a voltage divider using two resistors on the Arduino to ESP line and just connected the ESP to Arduino line as-is since the Arduino had no issue reading a signal at 3.3v.

Once I had that working it was just a matter of reading the documentation, I used a direct serial communication so I learned about AT commands and how they work. It was really exciting when I got it working and I saw it lock when I turned off the Wi-Fi on my phone and unlock when I turned the Wi-Fi back on. Sometimes the ping would fail even if my phone was connected. That was easy to fix by adding a counter of "failed" ping and only locking after 3 fail in a row. Next I wanted to be able to control it from a webpage, I opened a port on the ESP to receive TCP connection and forward that port in my router. I didn't need to do proper HTTP request parsing, just the bare minimum to extract the information I needed, which is essentially just the password which was passed in the URL making it's location was very standard and easy to extract. The webpage was extremely minimal, just a textbox with two buttons under it to lock or unlock. Even if I wanted I couldn't make the page very complex as the text quickly takes place on this already quite limited hardware and it also means it takes more time to send it from the Arduino to the ESP.

# The Voice Activation

Now that I had a way to lock/unlock using a web request it means that I could connect it to any services that uses a webhook. A very nice website to connect services and devices of all sort together is [IFTTT](ifttt.com/) (If This Then That). You give it an event to trigger on (If this) and an action to perform (Then That) and it will perform the action when it receives the event. There's all kind of events like, when you receive an email with optional filters, when you enter a certain location, on a Facebook post, by a Google calendar event. There's a ton of services adding their own piece to the website so that you can connect them to other things. The event I used was Google Assistant when I say "Ok Google, open front door" or "Hey Google, unlock the door" and the likes. My action was a simple webhook, sending a request with the correct password to my device. In a couple of minutes I got it working so that I could lock/unlock my door using Google Assistant, pretty cool.

# The Finishing Off

After finishing the software and the hardware and had glued the remaining panels I was finally able to enjoy the fruit of my hard labour, after adjusting a couple of things... For the power I used two thin and long white cables, matching the color of the door and making sure they wouldn't show too much. Turns out when my phone's screen is turned off it takes a long time to respond to pings, sometimes too long, and it would lead to the system thinking I left and locking the door. It was extremely creepy and startled me each time. I already had added an on/off switch which only toggled the pinging and didn't disable the web server. I simply made it so that when I turn it _off_ it would _lock_ the door, since it would mean that I arrive home and when I turn it _on_ it would _unlock_ as I am probably leaving. This way it would be off most of the time I am home and it wouldn't randomly decide to trigger the mechanism.

Here's a picture of the final product, a bit clunky but I love it. I'm very happy I thought of leaving a little hole so I could upload a new program to the Arduino as it would have been much more painful to do this upgrade without it. Also note that I later added some black electrical tape on the edges which gave it a much better appearance. 
![image](/assets/image/lock/finish.png)

# The Security

It might seem like adding a clumsy, self-made lock system connected to the internet could be a huge security issues but I don't believe this has significantly increased the chance of someone gaining unauthorized access to my apartment. First of all this is a unique device, no one has access to its program which already makes it harder to create an exploit for it. I'm pretty confident that I sanitized all the inputs and all the buffers in the code are static. Brute forcing it would be difficult because it's quite slow, it can take a couple of seconds to try even a single combination. The password could be anything, since there's about 95 printable ASCII character and an URL can be about 2000 characters, let's say minus 100 for the address of and the path, that leaves 95^1900 combination. But my main point is that my door isn't very secure to start with, the truth is that most residential door lock aren't any good and I can lockpick it open without too much trouble even though I barely have any experience. So if someone wanted to gain access to my apartment it would be easier to just lockpick the door (or straight away break it down or break a window) than to hack into my system.

PS: Now that I think about all the connections are over HTTP so assuming that someone is able to sniff those packets, they could probably retrieve the password, oh well.
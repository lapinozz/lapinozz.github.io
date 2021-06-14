---
layout: post
title:  "Persistence-Of-Vision Display"
date:   2021-05-29 17:21:23 -0500
image:
   url: /assets/image/POV/icon.png
categories: project
description: An Arduino Nano POV Display
tags:
- Electronics
- Arduino
---

# The Itch

Sometimes you get the urge to try something, an idea come to you or you see something and you just know you have to make it. Me and my friends call this "the itch". Sometimes it would be a huge endeavour, which you would probably never finish, so to avoid adding to the huge pile of unfinished project you already have, you have to resist it. But sometimes the scope is approachable, that's when it gets really dangerous, that's when the itch is irrepressible.

![image](/assets/image/POV/itch.png){:height="400px"}  

# POV Display

I saw a video about a POV Display and it reminded me of their existence. That was enough, I had to make one, today. They work quite simply, you have some spinning leds and if you light when they are at the same angle on each turn they will appear like there's a constance source of light there. Blink them at the right place and time, you got a circular screen on which you can write or draw things.

# Construction

For this kind of "on the spot" projects I have to do with what is laying around, I already had a couple of motors, AC adaptor, Arduino Nano, leds, pretty much everything needed. It took me a couple of trial and error to find the right combination of motor and power supply, in the end I used a DC 12V motor, which came from something I dismantled but I can't remember what it was, and an old computer's PSU which double as a base for the contraption. Even with this big heavy base it still vibrates a lot and wobbles around so I ned to hold it a bit with one hand Which is a bit scary since the upper part is made of a 4XAA battery holder on one side and a mix of popsicle sticks and pointy prototype board on the other giving a radius of about 20 centimeters, the whole thing turning quite fast.

![image](/assets/image/POV/base.png){:height="500px"}  

I wanted to maximize the ability of my Arduino nano so I went with a resolution of 10 pixel in "height" and 2 colors. I think I chose white and blue for my colors because those leds worked fine with the 5V and didn't need any resistor. Took me quite some time to finish the led board because the leds kept dying, until I realised I was accidentally shorting them when testing.

![image](/assets/image/POV/leds.png)

# Testing and Adjusting

Getting the code to work wasn't too hard but once I got the speed aproximatively tuned to the speed of the motor it became apparent that the design was flawed. The lines were very moving around and it was impossible to keep it exactly sync as the motor's speed isn't exacly constant. I knew other who have made this used some kind of sensor to detect the RPM so I looked for something that could work and found some LM393 wheel speed sensor. The sensor is composed of two little arms and sends a signal when there's something between them. I just had to mount the sensor on the rotating part of the display and a little piece of popsicle stick on the static part so that it pass in the sensor on each rotation then measure the time it took between two rotation to know the speed at which it was rotating. As soon as I got the speed sensor working I was amazed, the display was precise and clear, much better than I had imagined it would work.

![image](/assets/image/POV/sensor.png){:height="500px"}  

# Result

The result is a big deadly circle of light title "CIRCULUS LUMINIS" (Google assures me it means "circle of light" in Latin).
It has a nice radius, I'm pretty happy with the result. As always those kind of things are hard to capture properly on camera, between brightness and rolling shutter effects it makes it look much worse on camera than it does in real life. It works well with the lights on but the picture were better in the dark. Also I took some videos but as I said the  effect made them quite unattractive. When asking my friends what I should display for the showcase they came up with the very mature "send nude" so here it is, in two colors.


![image](/assets/image/POV/hello.png){:height="425px"} ![image](/assets/image/POV/send-nude.png){:height="425px"}

# Going further

I had started on animations for the display using a pixel art animation editor and a little script(that [my friend](https://github.com/alexge50) generously made for me) to convert the images into binary on/off arrays but I was stretching the limit of the storage available and processing power on my Arduino Nano so it was hard to put more frames but I'm sure I could manage some simple compression which doesn't take too much time. Maybe one day I'll get back to it.


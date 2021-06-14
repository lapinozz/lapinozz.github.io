---
layout: post
title:  "Facechat - Custom chat api"
date:   2016-06-07 16:05:23 -0500
image:
   url: http://lapinozz.github.io/assets/image/facebook_logo.png
categories: learning
tags:
- C++
- Networking
- IRC
description: Don't try at home, seriously, I got my account banned.
github: https://github.com/lapinozz/facechat
---

## Facechat

# Why?

If you followed my previous post you may know that I tend to go on IRC and that we have there some pretty cool bots. I was swapping between a conversation on IRC and one on Facebook when an idea struck me, how cool would it be to have those bots functionalitys directly in Facebook's chat? And even better, how about reading and writting Facebook's messages in IRC chat or reading and writing IRC's messages on Facebook? Awesome!

# Why "Unofficial"?

It should be easy, right? Facebook must have an API for sending and receiving messages, surely they have something like a REST API? Well... No. It turns out that they had an XMPP API that they shot down on April 30, 2014 [^n]. They still had a service to read the inbox but they put it down too, exactly one year later on April 30, 2015 [^n]. Since there was no official API I had to create my own.

# How?

The idea is that if your browser can connect to Faceboos and send messages, then your program can too, as the browser is just another program. When the you go to Facebook's login page you receive an html page and some js scripts, when you enter your identifiant and hit enter the scripts generate data to send to the server to make https request to establish a connection. Now a theoretical way our program could do that would be to simulate the whole browser, html parser, js code interpreter etc. The problem with this thechnique is that it makes a big dependency and it does way more than we need, we only need to send and receive specifique https responses and know how to generate/decode them.
To do that we completely forget what our browser is doing and only look at the https request sent to Facebook and the response and we try to guess how they were generated. So rather than trying to execute the js code or understand it, we make our own code, that works in the way we want it. Let me give you an example.  
  
I open my browser (Firefox) and launch a plugin called "Live HTTPS headers" that logs all https requests my browser makes. I open facebook.com and login then I send a message "test".  
  
Here's the https request that my browser made.  
As you can see, for a question of privacy I obfuscated the user ids.  

{% highlight txt linenos %}
POST /ajax/mercury/send_messages.php?
message_batch[0][action_type]=ma-type:user-generated-message
message_batch[0][thread_id]
message_batch[0][author]=fbid:100000*******67
message_batch[0][author_email]
message_batch[0][timestamp]=1467513329087
message_batch[0][timestamp_absolute]=Aujourd'hui
message_batch[0][timestamp_relative]=22:35
message_batch[0][timestamp_time_passed]=0
message_batch[0][is_unread]=false
message_batch[0][is_forward]=false
message_batch[0][is_filtered_content]=false
message_batch[0][is_filtered_content_bh]=false
message_batch[0][is_filtered_content_account]=false
message_batch[0][is_filtered_content_quasar]=false
message_batch[0][is_filtered_content_invalid_app]=false
message_batch[0][is_spoof_warning]=false
message_batch[0][source]=source:chat:web
message_batch[0][source_tags][0]=source:chat
message_batch[0][body]=test
message_batch[0][has_attachment]=false
message_batch[0][html_body]=false
message_batch[0][specific_to_list][0]=fbid:100003*******64
message_batch[0][specific_to_list][1]=fbid:100000*******67
message_batch[0][ui_push_phase]=V3
message_batch[0][status]=0
message_batch[0][offline_threading_id]=6155197026245292939
message_batch[0][message_id]=6155197026245292939
message_batch[0][ephemeral_ttl_mode]=0
message_batch[0][manual_retry_cnt]=0
message_batch[0][other_user_fbid]=100003*******64
client=mercury
__user=100000*******67
__a=1
__dyn=7AmajEzUGByA5Q9UoGya4A5ER6yUmyUyGiyEyfirWo8popyui9zob4q68K5U4e2O3J1ebkwy8wGFeex3BKuEjKeCwxxRa3CnDBxe6rxCLGqu2PxOcxu5ocE88C9z9oybx24o9Esw
__req=17
__be=-1
__pc=PHASED%3ADEFAULT
fb_dtsg=AQG5P4wy1kJ6%3AAQGxD7sfo49g
ttstamp=26581715380521191214910774545865817112068551151021115257103
__rev=2425895
{% endhighlight %}
  
That makes a lot of parameters, but actually only a few interests us.  


In particular, line 20, the "body" parameter which is set to "test", exactly our message!  
Line 4, 23, 24 and 31 are relative to who sent the message and to whom.  
Note: line from 33 to 41 are parameters setup in the login phase, they are used to authentify the connection.   


So in my program if I want to add the functionality to send a message (not taking into account sending photos, files etc, which are attachments) all I have to do is fill in all those parameters which are for the most pretty easy to guess what they mean, easier than trying to read the obfuscated js code anyways. Also, most of the parameters are not required for the request to work, here's a more minimalist request:

{% highlight txt linenos %}
POST /ajax/mercury/send_messages.php?
message_batch[0][action_type]=ma-type:user-generated-message
message_batch[0][author]=fbid:100000*******67
message_batch[0][source]=source:chat:web
message_batch[0][source_tags][0]=source:chat
message_batch[0][body]=test
message_batch[0][has_attachment]=false
message_batch[0][specific_to_list][0]=fbid:100003*******64
message_batch[0][specific_to_list][1]=fbid:100000*******67
message_batch[0][other_user_fbid]=100003*******64
client=mercury
__user=100000*******67
__a=1
__dyn=7AmajEzUGByA5Q9UoGya4A5ER6yUmyUyGiyEyfirWo8popyui9zob4q68K5U4e2O3J1ebkwy8wGFeex3BKuEjKeCwxxRa3CnDBxe6rxCLGqu2PxOcxu5ocE88C9z9oybx24o9Esw
__req=17
__be=-1
__pc=PHASED%3ADEFAULT
fb_dtsg=AQG5P4wy1kJ6%3AAQGxD7sfo49g
ttstamp=26581715380521191214910774545865817112068551151021115257103
__rev=2425895
{% endhighlight %}

So if I want to send a message to someone else I just have to replace "test" by the text and put their id (there is a function to find the user id of someone).


For this example it's not too hard to guess what the parameters are for but for some function it can get much more confusing. Fortunately. I didn't have to do all that tiedous work by myself, there is the excellent [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api) project in nodejs on which I could refer to help me in my coding.

# Goals

The goal of the Facechat library is to cover all functionality in a way that you could make your own messenger client with the features as the official and even more. One example of a use case that is not covered by the official client and which I need is downloading a complete conversation. Anyone that's ever used Facebook Messenger knows that it's a real pain to read ancient messages and if the conversation is somewhat long then it's simply impossible to get to the start. So I made a program that download the complete conversation to a file using my lib.

# Difficulty

As mentioned in the previous paragraph I made a concrete program using my lib. But I had some problem, between the time I wrote the lib and the time I got to use it Facebook's internal working changed and the lib didn't work anymore. A couple of change and actually a lot of debugging time was required to make it functional again.

## Facebot

As I said the original intent for writing this lib was to make a bot with the same functionality as some IRC bots and also to channel Facebook's messages through IRC and vice versa. And that's what I did in my Facebot project, here's a list of the available commands which is pretty easy to extend: 

#.say

simple command that echo back. eg: `.say text to be echoed`


# .g, .google

Google search. eg: `.google how to be as cool as lapinozz?`  
Image search. eg: `.google image cool image`


# .y, .youtube

Youtube search. eg: `.youtube how to break laws of physic`

# .w, .wiki, .wikipedia

Wikipedia search. eg: `.wiki proton`

# .tr, .translate
 
Translation command. eg: `.tr traduit ce text en englais`  
The default target language is English you can change that like this:   
`.tr fr This text will be translated to French`

# .def, .define

Get Definition. eg: `.define paradox`

# .rnd

Random, word, sentence or paragraph.  
eg: `.rnd`  
eg: `.rnd sentence`  
eg: `.rnd paragraph`  

# .time

Give the current time. eg: `.time`;

# .userID, .userId, .userid

Get the facebook user id of someone. eg: `.userId Marie Gagnon`

# .userInfo, .userinfo

Get the facebook information of someone. eg: `.userInfo Marie Gagnon`

# .tell

Send a mesage to someone. eg: `.tell Marie Gagnon : you'r so sexy today`  
you can also send to multipel personne eg: `.tell Marie Gagnon | Stephanie Gagnon : im not a cheater`
                        
# .g++, .gcc, .nasm (My favourite command)

Execute code, yes this use cee from BoxBox :D  
eg: `.g++ {int i; i = 4*5; cout << i};`


# .choose

Randombly choose between multiple choice eg: `.choose choice1|choice2|choice3`


#.irc

IRC commands  
eg: `.irc join #sfml`  
eg: `.irc part #sfml`  
eg: `.irc send #sfml im too cool for you`  
eg: `.irc send Nyrox im too cool for you`  
Turn on Facebook to IRC eg: `.irc on`  
Turn off Facebook to IRC eg: `.irc off`  

If Facebook to IRC is turned on each, when someone send a message to you or you send them a message on Facebook it will automaticly connect a IRC user with their name and send you the message in private, you can then replie to that irc user and it will send that replie on facebook.

# .in
Send message after a certain time eg: `.in 4m 30s tell me this`  
can also send to someone else eg: `.in 4m 30s Marie Gagnon: tell her this`  
or even to mutiple personne eg: `.in 4m 30s Marie Gagnon | Stephanie Gagnon: i already told you nothing happened between your sister and me`

# Limitation

One down side of Facechat is that, contrary to the case where Facebook would have an public API, you can't use an authentification token, the library user must provide his login credentials which can make it harder for the user to trust the application.

# Conclusion

It was a fun project and I plan to add more functionality, if you have any idea or suggestion feel free to contact me by email.  
   
   
Thank you for reading I hope you did enjoy.


[^n]: [facebook docs](https://developers.facebook.com/docs/chat)

*[IRC]: Internet Relay Chat
*[SFML]: Simple And Fast Library

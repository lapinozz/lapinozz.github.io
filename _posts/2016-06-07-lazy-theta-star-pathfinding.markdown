---
layout: post
title:  "Lazy Theta* Any Angle Pathfinding"
date:   2016-06-07 16:05:23 -0500
image:
   url: http://lapinozz.github.io/assets/image/pathfinding_thumbnail.png
categories: learning
tags:
- C++
- Pathfinding
github: https://github.com/lapinozz/Lazy-Theta-with-optimization-pathfinding
---

# Any angle pathfinding

To get smooth path there is a widely used method of using A* and then smoothing the path. Theta* is an any angle pathfinding algorithm, which mean that it allow for a path between two nodes even if they are not neighbors as long as there is a direct line of sight between them.

Examples of grid path(left) vs shortest path(right)
![](http://aigamedev.com/static/tutorials/aap-navmesh.png)

# Theta*

Where in A* a node parent's must be a neighbor, the idea behind Theta* is that a node parent's can be any other node. So in A* we take the node in the open queue with the lowest g-value and for each of its neighbors, we check if the g-value of the current node plus the cost to travel from that node to the neighbor is inferior to the current cost of the neighbor. If so, we set the neighbor parent to the current node and update its g-value.

Here's a pseudo code for A\* (note that most image were taken from [this page](http://aigamedev.com/open/tutorials/theta-star-any-angle-paths/) and [this one](http://aigamedev.com/open/tutorial/lazy-theta-star/))

![pseudo code](http://aigamedev.com/static/tutorials/aap-AStarCode.png)

Now for Theta\* the only difference is in the ComputeCost function. What we add is a line of sight check between the neighbor and the parent of the current node, if there is we check if the g-value of the parent plus the cost to travel from it to the neighbor is inferior to the current cost of the neighbor, if it is then we update the neighbor g-value and set its parent to the parent of the current node. Here the cost is calculated by simple line distance.

Again, pseudo code of the updated ComputeCost

![pseudo code](http://aigamedev.com/static/tutorials/aap-Path2tex.png)

# Lazy Theta*

Lazy Theta\* is an optimization of Theta\* which reduce the number of line of sight check. Rather then doing the line of sight check for each neighbors of the current node we assume that there is a line of sight and check it latter. So for each neighbors, we directly check if it would have a smaller g-value if we set the its parent to the parent of the current node and if it does then set it. And at the step where we fetch the node with the smallest g-value in the open list, before processing its neighbors, we do the actual line of sight. Because it was added to the open list and its parent updated wihtout knowing if there was a line of sight or not. If there is a line of sight between the node and its parent then it's all perfect and we can skip this step, if there is none, we look at each neighbor in the closed list and set the parent to the one which give the lowest g-value.

Here's the complete pseudo code, from left to right for A\*, Theta\* and Lazy Theta\*

![pseudo code](http://aigamedev.com/wp-content/blogs.dir/5/files/2013/07/fig53-full.png)

# Implementation

I had some theory and even some pseudo code, what could go wrong? Well, I don't if you can understand line 37/38 of the third code but I sure could not. So when I searched if I could find any code online but pretty much anything I could find was a comparison of different pathfinding algorithm and the code was very dispatched and hard to follow, it would have been hard to make sens of the Theta* code without going over pretty much every other file, plus most of them were implementation of Theta* and I could already make sense of the Theta* pseudo code, what I needed was a source code for Lazy Theta*. I finally found this page http://idm-lab.org/project-o.html which host an archive with code for several any angle pathfinding algorithms. I had to rewrite it pretty much completrly because the code style really did not suit me and I wanted a nice C++14 code.

# Modularity

I also wanted the code to be the most modular and reusable as possible so I used the concept of adaptor(shamelessly stolen from a friend of mine [^n])

This approach makes it possible to use it for grid, hexagon tiles, polygon map. Really anything where you need to find a path between two points, my friend even told me he was able to reuse his code to find the shortest path between two words.

# One last optimization

Another optimization that was discussed in the article linked above was to use weighted h-value. Remember that the h-value is the heuristic distance between a node and the goal. This method can give slightly longer path, but can also reduce a lot the number of line of sight check. So it simply consists of multiplying our h-value by a weight superior to 1.

Here's all the nodes that get checked with on the left a weight of 1(basically no weight) and on the right a weight of 1.1

![image](http://aigamedev.com/wp-content/blogs.dir/5/files/2013/07/lazy_1_11.png)

# Conclusion

My github repo contains the main file, pathfinding.hpp and an adaptor example for tile grid in tileadaptor.hpp (2x AA battery included)

I also added a demo in main.cpp to show how to use everything, it makes little map and find the path from the start to the end then output it to the console like so:

{% highlight txt %}
######################################################################
#S   #              #                                                #
#    #              #                                                #
#    #              #                                                #
#    #              #                            2                  3#
#    #              #                             ################## #
#    #              #                                           #    #
#    #              #                                           #4   #
#    #              #                                           # ####
#    #              #                                           #    #
#    #              #                                           #    #
#    #              #                                           #    #
#    #              #                                           #    #
#    #              #                                           #    #
#   0               #                                           #    #
#                   #                                           #    #
#                                 1                             #5   #
#                                                               #    #
#                                                               #   E#
######################################################################
#  = walls
S  = start
E  = end
number = path nodes
{% endhighlight %}

[^n]: [feather kit](http://featherkit.therocode.net/)

*[IRC]: Internet Relay Chat
*[SFML]: Simple And Fast Library



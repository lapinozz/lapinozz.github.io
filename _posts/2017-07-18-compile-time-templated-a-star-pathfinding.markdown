---
layout: post
title:  "Compile-time templated A* pathfinding in C++14"
date:   2017-07-17 17:21:23 -0500
image:
   url: /assets/image/hex-maze.png
categories: learning
tags:
- C++
- HUOT
---

# What is this?

In simple terms, a complete mess. More concretely, it's a piece of code that I wrote which computes a path using the A* algorithm and works entirely at compile-time, that is, all computations are done by the compiler and nothing is done at runtime. So at the end, the executable only contains the result, in this case, the path.

# Inspiration 

I asked my good friend Nyrox on the #sfml IRC for a compile-time challenge to my measure.  
He finally suggested doing A* pathfinding and I gladly took the challenge. 

# Tools

To help me in my task I used the superb [Compiler Explorer](http://www.godbolt.org). It lets you choose between a vast selection of compiler and versions and continuously try to compile your program as you type it. When your program compiles, it shows the resulting assembly on the right, it's really practical when doing. At the end I also used [Regex101](http://www.regex101.com) to quickly filter part of the compiler output. Finally, I used [C++ Shell](http://www.cpp.sh) which lets you execute C++ code online.
   
## Code

Let's dive right in!
For those who just want to see the code, [here's the link](https://github.com/lapinozz/CompileTime-Pathfinding/blob/master/main.cpp).

# Starting simple, Vec class

{% highlight cpp %}
template<int X, int Y>
struct Vec
{
    static constexpr int x = X;
    static constexpr int y = Y;
};
{% endhighlight %}

There we go, a simple templated class, I use it to store a position on the map. For example `Vec<4, 5> v;` would create an instance, but in this project I almost only work with type, so I would more likely write `using V = Vec<4, 5>;` which is a type alias declaration. I can then access the value like this `V::x`.

I want to do pathfinding in a 2D map and I will store this map as a 1D array, so I need a way to map 2D coordinate, which I'll call Vec now, to a 1D coordinate, which I'll call Index.

{% highlight cpp %}
template<int X, int Y>
struct Vec
{
    static constexpr int x = X;
    static constexpr int y = Y;
    
    template<int sizeX>
    static constexpr int Index = Y * sizeX + X;
}
{% endhighlight %}


I basically declare templated variable that is static, so that it is not part of an instance but of the class itself, and constexpr, so that it can be used in a constant expression and thus at compile-time. If any of those terms are unknown to you I suggest researching them and experimenting with them as it is the best way to learn about them and this is not a tutorial about template haxery but merely an overview of my experiment.

Assuming that the horizontal size of my map is 10, I'd use it like this `int Index = V::Index<10>;`.

Of course we also need to do the opposite operation, go from Index to Vec:

{% highlight cpp %}
template<int sizeX, int Index>
using FromIndex = Vec<Index % sizeX, Index / sizeX>;
{% endhighlight %}

And using it is as easy as `using V = FromIndex<10, _IndexHere_>;

It will also be handy further down the road to get the neighbors of this Vec: 


{% highlight cpp %}
template<int X, int Y>
struct Vec
{
    static constexpr int x = X;
    static constexpr int y = Y;
    
    template<int sizeX>
    static constexpr int Index = Y * sizeX + X;
    
    using Up =    Vec<X, Y - 1>;
    using Down =  Vec<X, Y + 1>;
    using Left =  Vec<X - 1, Y>;
    using Right = Vec<X + 1, Y>;
}
{% endhighlight %}


# Vector

Now that I have some Vec I need a way to hold them in an array, so I implemented a Vector class.
I won't cover every line, it's not trivial but with the "function" name, and some serious dedication, understanding the code should be possible. It is probably not the best way to do those things anyways, I wanted something that worked, coding feature as I needed them, once they worked reasonably well and that the code was not too terrible, I just moved on. 

With that in mind, feel free to inspire yourself from it or suggest improvements.

Note that, as to not make the post too long and boring, I removed most function of the following code. In the complete code you can find functions such as `PopBack`, `Find`, `Transform`, `Get`, `Remove` and so on.

{% highlight cpp %}
template <typename... T>
struct Vector
{
    template<typename...V>
    using PushFront = Vector<V..., T...>;

    template<typename...V>
    using PushBack = Vector<T..., V...>;

    template<typename V>
    struct Insert
    {
        template<typename>
        struct Impl;
        
        template<typename...Vs>
        struct Impl<Vector<Vs...>>
        {
            using Type = Vector<T..., Vs...>;
        };

        using Type = typename Impl<V>::Type;
    };

    template<typename V>
    using insert = typename Insert<V>::Type;
};
{% endhighlight %}

# Note on my synthax

You might have noticed I declare my "function" in a strange way, look at the insert _function_:

{% highlight cpp %}
    template<typename V>
    struct Insert
    {
        template<typename>
        struct Impl;
        
        template<typename...Vs>
        struct Impl<Vector<Vs...>>
        {
            using Type = Vector<T..., Vs...>;
        };

        using Type = typename Impl<V>::Type;
    };
{% endhighlight %}

I just feel like it's less of a mess when I write it this way, it feels more "contained", it's simply a personal preference, I could also write it in a more "normal" way:


{% highlight cpp %}
    template<typename V>
    struct Insert;
    
    template<typename...Vs>
    struct Insert<Vector<Vs...>>
    {
        using Type = Vector<T..., Vs...>;
    };
{% endhighlight %}

It is way less typing in this case, and I would guess it compiles faster, I didn't do any benchmark in this regard yet.   
Let me know what you think of it!


I also define aliases in lower case that are easier to call so rather than doing `MyVec::Insert<MyOtherVec>::Type` I can do `MyVec::insert<MyOtherVec>`.

{% highlight cpp %}
    template<typename V>
    using insert = typename Insert<V>::Type;
{% endhighlight %}

# Bad, bad Vector

In itself, this class works well, you can do fun stuff at compile time, hold any kind of type and insert, remove, find them, etc. But there is a problem, it only holds _Types_, so no int or any kind of value. And I want my final map to be made of chars, how to solve it? 

The solution is simple, make a type that has for sole purpose to hold a value:

{% highlight cpp %}
template<typename T, T Value>
struct ValueHolder
{
    using Type = T;
    static constexpr T value = Value;
};
{% endhighlight %}

Now I can hold a value, a 5 as an int for example `ValueHolder<int, 5>`. But it's still extremely annoying to always have to care about the ValueHolder and such. So I made an overload for values, this way I can push, remove, and find value using the exact same syntax as I would with types.

Again, I removed most functions, this time I left `Find`.

{% highlight cpp %}
template <bool ForceGeneric, typename... T>
struct VectorImpl;

template<typename...T>
struct Vector : public VectorImpl<false, T...>
{
    static constexpr int Size = sizeof...(T);
};

template <bool ForceGeneric, typename... T>
struct VectorImpl
{
    template<typename V, template<typename, typename> class Condition = std::is_same>
    struct Find
    {
        template <int CurrentIndex, typename Current, typename...I>
        struct Impl
        {
            static constexpr int Index = Condition<Current, V>::value ? CurrentIndex : Impl<CurrentIndex + 1, I...>::Index;
        };

        template <typename Current, typename...I>
        struct Impl<Vector<T...>::Size, Current, I...>
        {
            static constexpr int Index = -1;
        };

        static constexpr int Index = Impl<0, T..., IgnoreT>::Index;
    };

    template<typename V, template<typename, typename> class Condition = std::is_same>
    static constexpr int find = Find<V, Condition>::Index;
};

template <typename T, T...V>
struct VectorImpl<false, ValueHolder<T, V>...> : public VectorImpl<true, ValueHolder<T, V>...>
{
    template<T Value, template<typename, typename> class Condition = std::is_same>
    struct Find
    {
        template<typename Left, typename Right>
        struct ConditionWrapper;

        template<T Left, T Right>
        struct ConditionWrapper<ValueHolder<T, Left>, ValueHolder<T, Right>>
        {
            static constexpr bool value = Left == Right;
        };

        static constexpr int Index = vecImpl::template Find<ValueHolder<T, Value>, ConditionWrapper>::Index;
    };

    template<T Value, template<typename, typename> class Condition = std::is_same>
    static constexpr int find = Find<Value, Condition>::Index;
};
{% endhighlight %}

# Map

The map itself is just inheriting from vector and simply adds function to get a value from a coordinate and holds the horizontal size


{% highlight cpp %}
template<int SizeX, typename...T>
struct Map : public Vector<T...>
{
    using GetVector = Vector<T...>;
    static constexpr int sizeX = SizeX;

    template<typename VecT>
    struct GetFromPos
    {
        static constexpr auto Value = GetVector::template Get <VecT::template Index<SizeX> >::Value;
    };

    template<typename VecT>
    static constexpr auto getFromPos = GetFromPos<VecT>::Value;
};
{% endhighlight %}

# Node

A* is implemented using nodes, which hold a pointer to its parent, the cost of its path so far, its heuristic cost and its position.

{% highlight cpp %}
template<int index, int G, int H, typename ParentType = void>
struct Node
{
    static constexpr int Index = index;

    static constexpr int g = G;
    static constexpr int h = H;
    static constexpr int Cost = G*G + H;

    using Parent = ParentType;
};
{% endhighlight %}

You might wonder why G is squared, it's because my heuristic function takes two Vec and returns the distance between them squared. Sqrt is a real pain in template since we can't use float at compile-time and it's really easy to just represent every distance as squared distances!

{% highlight cpp %}
template<typename Vec1, typename Vec2>
struct Heuristic
{
    static constexpr int X3 = Vec2::x - Vec1::x;
    static constexpr int Y3 = Vec2::y - Vec1::y;
    static constexpr int Value = X3 * X3 + Y3 * Y3;
};
{% endhighlight %}

# Pathfinding

I made a `AStar` class, in it there's a couple of members which are the start value of the algorithm, so the start and end position, the openlist and closedlist, etc.

Then I have a "function" called `BuildNeighbors` its role is to gather in a vector all the neighbor position of a node, removing all those are out of the map bounds. Then there is `FilterNeighbors` which removes the position that point to a wall or if a node with the same cost and position exists in the closedlist or openlist. 

`MakePath` is the final function that takes the final node when the algorithm has reached the end position and unroll all its parents and puts all the position in a vector.

`MainLoop` is, well, the main loop, it takes the node with the least cost on the openlist, removes it from the list and find its neighbors using `BuildNeighbors`, filter them using `FilterNeighbors` and add them to the openlist, it then adds the least node to the closedlist and recurse, unless the least node position is equal to the end position, in which case it stops recursing and returns the result of `MakePath`.

# Debugging

Many times during the development, things refuse to work as intended, but I could not use a simple std::cout as I'm used to, because everything was at compile time. So I found a nice trick, you can force an "error" and hope that the compiler will throw you the information that you want. Here for example I want to know the content of a vector.

{% highlight cpp %}
using MyVector = Vector<Vec<0,0>,Vec<1,1>,Vec<2,2>,Vec<3,3>>;
using Test = MyVector::Test;
{% endhighlight %}

Clang, for example, will output this

{% highlight txt %}
666 : <source>:666:24: error: 'Test' in 'using MyVector = struct Vector<Vec<0, 0>, Vec<1, 1>, Vec<2, 2>, Vec<3, 3> > {aka struct Vector<Vec<0, 0>, Vec<1, 1>, Vec<2, 2>, Vec<3, 3> >}' does not name a type
 using Test = MyVector::Test;
{% endhighlight %}

And GCC will do something close. Another way is to use static_assert, it's just like a classic assert but at compile-time, so it takes a constant expression and if it resolves to true then it's ignored, if it's false whoever, it will output an error and potentially stop.

So I could do this to verify that the size member of my vector is correct

{% highlight cpp %}
using MyVector = Vector<Vec<0,0>,Vec<1,1>,Vec<2,2>,Vec<3,3>>;
static_assert(MyVector::Size == 4);
{% endhighlight %}

Thus, if I made an error somewhere, I will immediately know.
I made a couple of test cases as I was adding various functions.
The define is because this is all C++14 conformant and the C++14 static_assert version requires a string as second parameter to output in case of failure, in C++17 it is optional. To make my life easier, I made that macro that just put an empty string for me.

Here's some part of my tests.

{% highlight cpp %}
#define static_assert(...) static_assert(__VA_ARGS__, "")

static_assert(map::getFromPos<Vec<6, 0>> == 0);
static_assert(map::getFromPos<Vec<3, 4>> == 1);

static_assert(map::get<0> == 'S');
static_assert(map::getFromPos<Vec<0, 0>> == 'S');
static_assert(map::getFromPos<Vec<2, 3>> == 'E');

static_assert(map::find<'S'> == 0); // Start
static_assert(map::find<'E'> == 3*8 + 2); // End

static_assert(Vec<1, 2>::Index<8> == 17);
static_assert(std::is_same<FromIndex<8, 17>, Vec<1, 2>>::value);
static_assert(FromIndex<8, 17>::Index<8> == 17);

using TestVec1 = VectorFromValue<int, 0, 1, 2, 3, 4, 5>;
using TestVec2 = TestVec1::PushFront<6>;

static_assert(TestVec1::Get<0>::Value == 0);
static_assert(TestVec1::Get<5>::Value == 5);
static_assert(TestVec1::remove<2>::get<3> == 4);

static_assert(TestVec2::Get<0>::Value == 6);
static_assert(TestVec2::PopFront::value == 6);

using TestVector4 = Vector<Test<0>, Test<-1>, Test<1>, Test<8>, Test<-1>>;
using LeastNode = FindLeast<TestVector4>;
static_assert(LeastNode::Index == 1);
static_assert(LeastNode::Type::Cost == -1);
{% endhighlight %}

# The actual map

Here's my map, `0` is void, `1` is a wall, `S` is the start and `E` is the end. Note that I used define because if I typed `'S'` it would offset the whole row and I really wanted to use `S` and not `2` or something.

{% highlight cpp %}
#define S 'S'
#define E 'E'

    using map = MapFromValue<8, char,
        S, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, E, 1, 1, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0
        >; 

#undef S
#undef E
{% endhighlight %}

# The Final code

The complete and final code is [available on github](https://github.com/lapinozz/CompileTime-Pathfinding/blob/master/main.cpp)


## It's nice and all that but how do you know it actually works?

Excellent question! As I showed earlier, we can force the compiler to output the final path, then I extract that path using a regex `.*?(Vec<(\d+), (\d+)>).*?` and replace with ` {$2,$3}, \n` so that 

{% highlight txt %}
668 : <source>:668:21: error: no type named 'Test' in 'Vector<Vec<0, 0>, Vec<1, 0>, Vec<2, 0>, Vec<3, 0>, Vec<4, 0>, Vec<5, 0>, Vec<6, 0>, Vec<7, 0>, Vec<7, 1>, Vec<7, 2>, Vec<7, 3>, Vec<7, 4>, Vec<7, 5>, Vec<7, 6>, Vec<7, 7>, Vec<6, 7>, Vec<5, 7>, Vec<5, 6>, Vec<5, 5>, Vec<5, 4>, Vec<5, 3>, Vec<5, 2>, Vec<4, 2>, Vec<3, 2>, Vec<2, 2>, Vec<2, 3> >'
{% endhighlight %}

Becomes 

{% highlight txt %}
{0,0}, 
{1,0}, 
{2,0}, 
{3,0}, 
{4,0}, 
{5,0}, 
{6,0}, 
{7,0}, 
{7,1}, 
{7,2}, 
{7,3}, 
{7,4}, 
{7,5}, 
{7,6}, 
{7,7}, 
{6,7}, 
{5,7}, 
{5,6}, 
{5,5}, 
{5,4}, 
{5,3}, 
{5,2}, 
{4,2}, 
{3,2}, 
{2,2}, 
{2,3}, 
{% endhighlight %}

Then I simply paste that into a program that I made which print the map with the a `#` at all the aboves positions.

{% highlight cpp %}
#include <iostream>
#include <vector>

int main()
{
    //  .*?(Vec<(\d+), (\d+)>).*?
    //  {$2,$3}, \n

    int mapSize = 8;

    std::vector<char> map = {
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 1, 1, 0, 1, 0,
    0, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 1, 1, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0
    };

    struct Vec
    {
        int x;
        int y;
    };

    std::vector<Vec> path = 
    {
        // INSERT POSITIONS HERE
    };

    for(char& c : map)
    {
        c = (c == 0 ? ' ' : '#');
    }

    for(const Vec& vec : path)
    {
        map[vec.x + vec.y*mapSize] = '*';
    }

    for(size_t x = 0; x < map.size(); x++)
    {
        if(x % mapSize == 0 && x != 0)
            std::cout << '\n';
            
        std::cout << map[x];
    }
}
{% endhighlight %}

# Final Output

Finally, I run this program using [Cpp Shell](cpp.sh) and it outputs the map and I can see that the path is correct.
{% highlight txt %}
********
#######*
  ****#*
  *##*#*
   # *#*
   # *#*
 ### *#*
     ***
{% endhighlight %}

## Conclusion

This was pretty fun to write, even thought it can't really be used in real world code I still learned a lot of tricks that can be useful during real development. I also find amazing that I was able to write everything on the web, in my web browser, it was really easy and practically pain free.

Thank you for reading I hope you did enjoy.  
As always comments are welcome and appreciated!

---
layout: post
title:  "Messing with vtables - Part I"
date:   2016-02-02 21:58:24 -0500
image:
   url: http://lapinozz.github.io/assets/image/vtable_post_tumbnail.gif
categories: learning
tags:
- vtable
- C++
---

This is an article about vtable. Even if in practice you should never use them directly, it can be useful to know how they work when considering performance (Especially for virtual inheritance). And well... it's fun.


# Disclaimer
Vtabels are not part of the standard, using them manually is absolutly **_not portable_**. The only purpose of this code is to <del>have fun</del> learn and understand. Don't use it for any other purpose


Code tested on 

- GCC 5.3 - Ubuntu 14.04
- Clang 3.7 - Debian GNU/Linux testing (stretch)


# Vtable by example

Vtables are used by the compiler to know which virtual function to call or how to access members of virtual inherited class. Let's see an example. 

{% highlight cpp linenos %}
struct BaseClass 
{
    virtual void sayHello()
    {
        std::cout << "Hello from BaseClass" << std::endl;
    }
};

struct ChildClassA : public BaseClass
{
    void sayHello() override
    {
        std::cout << "Hello from ChildClassA" << std::endl;
    }
};

struct ChildClassB : public BaseClass
{
    void sayHello() override
    {
        std::cout << "Hello from ChildClassB" << std::endl;
    }
};
{% endhighlight %}

Now let's say we have a `BaseClass*`, it could point to either a `BaseClass`, a `ChildClassA` or a `ChildClassB`. But how does the program know which function to call?

It is actually not so complex, in `BaseClass` is a hidden pointer to a special struct(the vtable) containing the addresses of the functions. The vtable for our `BaseClass` would look like this:


{% highlight cpp linenos %}
struct BaseClass_vtable
{
    void (*sayHello_ptr)(BaseClass*);
};
{% endhighlight %}

That's it a simple function pointer.
For those confused by function pointer (let's be honest, we all are) here is a [link to the cppreference page about them](http://en.cppreference.com/w/cpp/language/pointer#Pointers_to_functions)


When the object gets constructed it set the function pointer according to the type. If the object is a `BaseClass` then it will be pointing to `BaseClass::virtualFuncion`, if it is a `ChildClassA` then it will be pointing to `ChildClassA::sayHello` and so on. Then, When you call the function like this `myBaseClassPtr->sayHello()` it call the function pointed in the vtable.


The pointer to the vtable, let's call it the vptr to make it shorter, is located at the base of the class so that you can cast `BaseClass*` to `BaseClass_vtable**` which would be a pointer to pointer.

Again, all of this is entirely implementation dependent, C++ has no concept of vtable. The C++ specification only provides specific behaviors that must be guaranteed and this is simply how most compilers implement it.

Here's what it would look like if you were to do this manually:

{% highlight cpp linenos %}
BaseClass* foo = new ChildClassA();

// cast foo to a pointer to pointer to vtable then dereference it to get a pointer to vtable
BaseClass_vtable* vptr = *reinterpret_cast<BaseClass_vtable**>(foo);

//simply call the function pointer
vptr->sayHello_ptr(foo);
{% endhighlight %}

This output `Hello from ChildClassA`. 


Now we know how to read the vtable but can we write to it too? In my test I've found that I would get a segfault when trying to set the function pointer. I believe this is because (on GCC at least) the vtables are not created at runtime. They are set at compile time just like a global const and then when constructing an object the vptr is set to point to the correct vtable. This keeps us from editing the already existing vtable but nothing keeps us from creating our own!

Let's declare a simple function to inject into our vtable

{% highlight cpp linenos %}
void intruderFunction(BaseClass* this_ptr)
{
        std::cout << "Hello from intruder" << std::endl;
}
{% endhighlight %}

Now to create and insert our own vtable

{% highlight cpp linenos %}
// Create our taget object
BaseClass* foo = new BaseClass();

// Create our own vtable
BaseClass_vtable* vtable = new BaseClass_vtable();

// Set the function pointer to point to our function
vtable->sayHello_ptr = &intruderFunction;

// Set the vptr so it point to our vtable
*reinterpret_cast<BaseClass_vtable**>(foo) = vtable;

// Call it!
foo->sayHello();
{% endhighlight %}

This output `Hello from intruder`. 


Naturally, if we have multiple virtual function in the class the vtable will contain multiple function pointer. From my experience the order of the function pointer is the same as the function definition in the class.

So if we have our `BaseClass` like this:

{% highlight cpp linenos %}
struct BaseClass 
{
    virtual void sayHello()
    {
        std::cout << "Hello from BaseClass" << std::endl;
    }

    virtual void sayClassName()
    {
        std::cout << "My class name is: BaseClass" << std::endl;
    }

    virtual void sayBye()
    {
        std::cout << "Bye from BaseClass" << std::endl;
    }
};
{% endhighlight %}

The vtable would now look like:

{% highlight cpp linenos %}
struct BaseClass_vtable
{
    void (*sayHello_ptr)(BaseClass*);
    void (*sayClassName_ptr)(BaseClass*);
    void (*sayBye_ptr)(BaseClass*);
};
{% endhighlight %}

And we can use and call the function pointer the same way as we did previously.

<br/>
<br/>

That's it for part 1! In [part 2] we'll look into the more complex subject of virtual inheritance.

*[vtable]: virtual table
*[vptr]: pointer to virtual table
*[segfault]: segmentation fault

[part 2]: {{site.url}}/learning/2016/02/08/Messing-with-vtables-part-two.html


---
layout: post
title:  "Messing with vtables - Part II"
date:   2016-02-08 22:47:08 -0500
image:
   url: http://lapinozz.github.io/assets/image/vtable_post_tumbnail.gif
categories: learning
tags:
- vtable
- C++
---

This second post on vtable will be consecrated to the mechanics of virtual inheritance. It will get slightly more complex, so bear with me.


# Disclaimer
Like it was said in [part 1], all of this is entirely implementation dependent, C++ has no concept of vtable. The C++ specification only provides specific behaviors that must be guaranteed and this is simply how most compilers implement it. . Using them manually is absolutely **_not portable_**. The only purpose of this code is to <del>have fun</del> learn and understand. Don't use it for any other purpose


Code tested on 

- GCC 5.3 - Ubuntu 14.04


# Simple Inheritance

First, let's see a simple case where virtual inheritance is needed. We have four classes, `GuiElement`, `Label`, `Clickable` and `Button`. They form an hierarchy where both `Label` and `Clickable` inherited from `GuiElement`. `Button` needs to be drawn so it inhertie from `Label`. It also need to be clickable so of course it also inherits from `Clickable`. One code worth ten thousand words right?

{% highlight cpp linenos %}
struct GuiElement
{
    int id;
};

struct Label : public GuiElement
{
    int a;
};

struct Clickable : public GuiElement
{
    int b;
};

struct Button : public Label, public Clickable
{
    int c;
};
{% endhighlight %}


And to make it even easier to visualize, UML diagram: 

![UML_vtable_simple_inheritance]({{site.url}}/assets/image/UML_vtable_simple_inheritance.png)
{:align="center"}

That's not quite what we want. If we had an object `button` of type `Button` we could see that it has two member variable `id`, accessible by `button.Label::id` and `button.Clickable::id`. We'll still try to understand how it work for simple inheritance. Here we can look at how our structs are organized in memory.

{::comment}
{% highlight text %}
Label:
    GuiElement::id
    Label::a
    
Clickable:
    GuiElement::id
    Clickable::a
{% endhighlight %}
{:/comment}

<br/>

|Label|Clickable|
|:-|:-|
|GuiElement::id|GuiElement::id|
|Label::a|Clickable::b|
{:style="table-layout:fixed;width:40%;" align="center"}
<br/>

The magic of this configuration is that you can very easily cast between `Label*` and `GuiElement*`. Just like in all the code and explanation we'll see, `Label` and `Clickable` are equivalent. Minus the name change, the same code and concept applies to both in the exact same way. Unfortunately, it is not that simple for `Button`.

<br/>

|Button|
|:-|
|Label::GuiElement::id|
|Label::a|
|Clickable::GuiElement::id|
|Clickable::b|
|Button::c|
{:style="table-layout:fixed;width:40%;" align="center"}
<br/>


As you can see, we can cast with ease between `Button*` and `Lable*`.

To cast from `Button*` to `Clickable*` we need to adjust our pointer to point to the "`Clickable`" part of `Button`. That can be done by adding an offset to our pointer so that we are pointing to `Clickable::GuiElement::id`. 

||Button|
|-:|:-|
||Label::GuiElement::id|
||Label::a|
|->|Clickable::GuiElement::id|
||Clickable::b|
||Button::c|
{:style="width:40%;" align="center"}
<br/>

And now we are pointing to a valid `Clickable` object. To cast it back to `Button*` we just have to remove that offset from the pointer so that we point to `Label::GuiElement::id` again.


You might want to note that you can't do `GuiElement* guiElement = button`. Because `button` has two instance of `GuiElement`, the compiler wouldn't know to which you want to refer . If I'm begin stubborn and decide to try anyway, GCC gently remind me that I'm an idiot:

{% highlight text %}
error: ‘GuiElement’ is an ambiguous base of ‘Button’
{% endhighlight %}


It is still possible to do it by first casting to `Label*` or `Clickable*`:

{% highlight cpp linenos %}
GuiElement* guiElementLabel = (Label*)button;
GuiElement* guiElementClickable = (Clickable*)button;
{% endhighlight %}


And that's pretty much it for basic inheritance, let's dive in the core subject.


# Virtual Inheritance


So we've seen that in our example that, when using simple inheritance, we don't get exactly what we wanted, we got two instances of `GuiElement` for each `Button`. That's an issue we can fix with one magic word!

{% highlight cpp linenos %}
struct Label : virtual public GuiElement
{
    int a;
};

struct Clickable : virtual public GuiElement
{
    int b;
};
{% endhighlight %}

By making `Label` and `Clickable` virtually inherit from `GuiElement` we get:

![UML_vtable_simple_inheritance]({{site.url}}/assets/image/UML_vtable_virtual_inheritance.png)
{:align="center"}

Much better! Now our `Button`s only have one instance of `GuiElement`. This may look easier from a programmer stand point, but it makes the life harder for the compiler. And since you're here, for you too.

<br/>

|Button|Label|Clickable|
|:-|:-|:-|
|vptr_Label|vptr|vptr|
|Label::a|Label::a|Clickable::b|
|vptr_Clickable|GuiElement::id|GuiElement::id|
|Clickable::b|
|Button::c|
|GuiElement::id|
{:style="table-layout:fixed;width:40%;" align="center"}
<br/>

Unexpected right? At least it was for me at first. Let's see how it works! Note that the following code is not the actual class declaration, rather the result of compilation. it's what the object might will look like in memory. To avoid confusion, I'll add the sufix `_real` at the end of structs name. And don't forget that this is only to give you an idea of how it work, details might change depending of the compiler.


First case, Label:

{% highlight cpp linenos %}
struct Label_vtable
{
    // offset are in byte
    int offsetToVariable_GuiElement_id; //offset from the vptr to the variable
    int offsetToTop; //offset from the vptr to the top of the class
    type_info* typeInfoPtr; //pointer to the type_info for this object
};

struct Label_real
{
    Label_vtable vptr; //pointer to the vtable
    int label_a; // member varible
    int guiElement_id; // member variable inherited from GuiElement
};
{% endhighlight %}
 
 
 Note the arriving of a new friend, `typeInfoPtr`. It is used for various RTTI operations, eg: dynamic_cast, typeid.
  
 
When we want to access the member variable id, here represented by `guiElement_id`. We have to look into the vtable to see at what offset it is in the class. Assuming we have a `Label*` named `label` it would pretty much like this.
 
{% highlight cpp linenos %}
Label_vtable* vtable = label.vptr;
int8_t offset = vtable->OffsetToVariable_GuiElement_id; // the offset is in byte
int8_t* varaibleAddress = (int8_t*)label + offset;
id = *(int*)varaibleAddress;
{% endhighlight %}

or for those that prefer really dense code.

{% highlight cpp linenos %}
id = *(int*)((int8_t*)label + label.vptr->OffsetToVariable_GuiElement_id);
{% endhighlight %}


But we didn't initialize our `label` with valid offset yet! Adding a constructor to do so, we would end up with this. Note that we get a memory leak here since the vtable get allocated but never is freed.


{% highlight cpp linenos %}
Label_real::Label_real()
{
    // create the vtable
    vptr = new Label_vtable();
 
    // calcualte the offset from the vptr (wich is as the top of the class) to the variable
    // label + offset == &label->variable
    vptr->OffsetToVariable_GuiElement_id = sizeof(Label_vtable*) + sizeof(int);
 
    // the vptr is at the top of the class
    // so the offset from the vptr to the
    // top of the class is obviously 0
    vptr->OffsetToTop = 0;
 
    // theoricaly that's how we should do it but the copy constructor of type_info is private
    // anyway we dont actually need it for our exemple
    // I'll still leave it here as reference
    //vptr->typeInfoPtr = new type_info(typeid(Label));
}
{% endhighlight %}

The same applies for `Clickable`.


I hope that you're still following and that it's not too messy. If everything is confusing and you're lost then it's my fault, I apologize.


Now we need to understand how it works for `Button`, especially for casting to `Label*` or `Clickable*`.

{% highlight cpp linenos %}
struct Button_vtable
{
    Label_vtable vtable_label;
    Clickable_vtable vtable_clickable;
};

struct Button_real
{
    Label_vtable* vptr_lable; //pointer to the lable vtable
    int Label_a; // member varible inherited from Label

    Clickable_vtable* vptr_clickable; //pointer to the clickable vtable
    int Clickable_b; // member varible inherited from Clicackable

    int Button_c; // member varible

    int GuiElement_id = 10; // member variable inherited from GuiElement
};
{% endhighlight %}
 
Do you see it? If you don't, no worries! Here's how it goes. We defined `Label_real` like this.

{% highlight cpp linenos %}
struct Label_real
{
    Label_vtable vptr; //pointer to the vtable
    int label_a; // member varible
    int guiElement_id; // member variable inherited from GuiElement
};
{% endhighlight %}

The first two members fit perfectly in the layout of `Button`. For the third one, remember, it's position is calculated from an offset located in the vtable. So we just have to adjust this offset so that it point to our `guiElement_id` in `Button`. To make it more clear(yes I'm better with code than words) here's our beloved constructor.

{% highlight cpp linenos %}
Button_real::Button_real()
{
    vptr_label = new Label_vtable();

    // the variable is separeted from the vptr by three int and two pointer
    vptr_label->OffsetToVariable_GuiElement_id = sizeof(void*)*2 + sizeof(int)*3;

    // this vptr is still at the top
    vptr_label->OffsetToTop = 0;

    vptr_clickable = new Clickable_vtable();

    // the variable is separated from the vptr by two int and one pointer
    vptr_clickable->OffsetToVariable_GuiElement_id = sizeof(void*) + sizeof(int)*2;

    // this vptr is separated from the top by one int and one pointer
    vptr_clickable->OffsetToTop = sizeof(void*) + sizeof(int);
    
    // note that the typeInfoPtr of both vtable would be pointing to
    // the type_info of Button 
}
{% endhighlight %}

Now you know how it works under the hood when casting from derived class to base class (upcasting), even when virtual inheritance is involved. You can brag to your friend about it and look cool. Until they ask you about downcast... You might be tempted to say that's it as simple as it is for non-virtual inheritance, you just have to substract the offset you added previously right? Well, no, that would be too easy wouldn't it be?


To understand why, we need yet another class.

{% highlight cpp linenos %}
struct Slider : public Label, public Clickable
{
    int d;
    int e;
};
{% endhighlight %}

And the obligatory UML diagram.

![UML_vtable_simple_inheritance]({{site.url}}/assets/image/UML_vtable_virtual_inheritance_advanced.png)
{:align="center"}

Consider the following case. We have want to cast from `GuiElement*` to `Label*`, don't forget it could be pointing to any of the following; `GuiElement`, `Label`, `Clickable`, `Button` or `Slider`. Now the problem is that `GuiElement` by itself carry no type information. 

{% highlight cpp linenos %}
struct GuiElement_real
{
    int id;
};
{% endhighlight %}

That means it could be any of the following case 
That means that the `GuiElement` could be at any of those point and we have no way to know which one it is. Since we dont have RTTI we can't know how to cast from `GuiElement*` to `Label*` because we dont know where we point relatively to the `Label`, and in some case there is no `Label`.

||Slider||Button||Label||Clickable||GuiElement
|:-|:-|:-|:-|:-|:-|:-|:-|:-|:-|
||vptr_Label||vptr_Label||vptr||vptr|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;->|GuiElement::id
||Label::a||Label::a||Label::a||Clickable::b|
||vptr_Clickable||vptr_Clickable|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;->|GuiElement::id|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;->|GuiElement::id|
||Clickable::b||Clickable::b|
||Slider::d||Button::c|
||Slider::e|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;->|GuiElement::id|
|->|GuiElement::id
{:style="white-space:pre" align="center"}


You can actually try it and the compiler will tell you.

{% highlight cpp linenos %}
Label* label = dynamic_cast<Label*>(guiElement);
{% endhighlight %}

{% highlight text %}
error: cannot dynamic_cast ‘guiElement’ (of type ‘struct GuiElement*’) to type ‘struct Label*’ (source type is not polymorphic)
{% endhighlight %}


As the compiler pointed out, the problem is that `GuiElement` is not polymorphic. The best way to fix this is to add a virtual destructor to `GuiElement`. Anyway, every class which gets inherited from should have a virtual destructor to ensure proper destruction of every class.

{% highlight cpp linenos %}
struct GuiElement
{
    virtual ~GuiElement() = default;
    int id;
};
{% endhighlight %}

Now the compiler knows that `GuiElement` needs a vtable and will include one. And since the vtable include RTTI (via `typeInfoPtr`) we will be able to perform our cast! But first, since we modified `GuiElement` we need to redefine `Button_real` and `Button_vtable`.

{% highlight cpp linenos %}
struct Button_vtable
{
    Label_vtable vtable_label;
    Clickable_vtable vtable_clickable;
    GuiElement_vtable vtable_guiElement;
    
    //here would also be a function pointer to the virtual destructor 
    //~GuiElement()
};

struct Button_real
{
    Label_vtable* vptr_lable; //pointer to the lable vtable
    int Label_a; // member varible inherited from Label

    Clickable_vtable* vptr_clickable; //pointer to the clickable vtable
    int Clickable_b; // member varible inherited from Clicackable

    int Button_c; // member varible

    GuiElement_vtable* vptr_guiElement; //pointer to the guiElement vtable
    int GuiElement_id = 10; // member variable inherited from GuiElement
};
{% endhighlight %}


From all the information here you should be able to work out what `GuiElement_vtable` looks like. Of course `vptr_guiElement` need to be added to `Lable_real` and `Clickable_real`. And every constructor need to be updated so that they give the correct offset.


One last point, you might wonder what's `offsetToTop` doing in vtables. It's used when casting to `void*` so that you can simply substract the pointer by the offset to get the base of the most derived class.

<br/>
<br/>

And that's pretty much it. I hope it was clear enough. If you have any suggestion or question, feel free to comment in the box below or to contact me directly.

*[vtable]: virtual table
*[vptr]: pointer to virtual table
*[segfault]: segmentation fault
*[RTTI]: Real Time Type Info

[part 1]: {{site.url}}learning/2016/02/02/Messing-with-vtables.html


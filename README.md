## An Alternative EverWebinar Popup Code

everwebinar-popup.js is an alernative to the defualt popup script EverWebinar uses to load the registration popup. 

[Here is a link to the stock popup registration code](https://events.genndi.com/register.evergreen.extra.js)

## Why the ConveYour.com team built their own. 

We were having a lot of problems with the stock script.. 

- We were experiencing very slow render times for our customers causing the page visitor to leave before waiting for the popup to load! We wanted a way to pre-load the popup so that when they click the popup was instantly there to register. Seriously, this was a big problem. With 3 second load times, people just leave if they think something is broken!

- The stock script loads an entirely new version of jQuery. This is good for avoiding page conflicts. However, if you have control over the host page, it already has jQuery on the page, and you can check for conflicts on your page; than why would you load a new jQuery version. It just adds to the slowness. 

- There was no control over when we instantiated, revealed, or hid the popup programatically

- The click binding was not working if you clicked on a child node inside an anchor tag! So if you clicked on a `<span>` element inside an anchor... broke..

- Poorly written, old jQuery code. This new version uses an EverWebinar constructor and methods are well organized in it's prototype. DOM selctors are not repeated over and over. 

- The stock script always sent the visitor to the top of the page which wasn't a great user experience. 

## How to use...

**1. Include the script on your page you want to have the webinar registration popup show**


```
<script src="/js/everwebinar-popup.js">
</body>
```

**2. Add links in your HTML that open the popup.**


```
<a href="#" class="wj-popup" data-memberid="<MEMBER ID>" data-webicode="<WEBINAR CODE>">Register Now</>
```

- wj-popup is a special class that the new script binds to (vs using title tag)
- data-memberid : REQUIRED, your everwebinar memberid
- data-webicode : REQUIRED pace your everwebinar webinar code here.
- data-tz : optional, you can set the desired timezone right on the element instead of using the timezone detected in the script.. 

**3. Instantiate EverWebinar()**

Include a script like this AFTER loading the webinar-popup.js file

```
  $(function(){
    //check to make sure Web
    if( !window.EverWebinar ){
      return false
    }
    var ew = new EverWebinar();
    ew.init();

    // optionally pre-load the popup but keep it hidden until someone clicks a button you 
    // made in step 2
    ew.load(MEMBERCODE, WEBICODE);

  });

```

**4. Other things you can do...**

pre-load after 2 seconds on page...

```
  $(function(){
    //check to make sure Web
    if( !window.EverWebinar ){
      return false
    }
    var ew = new EverWebinar();
    ew.init();

    setTimeout(function(){
      ew.load(MEMBERCODE, WEBICODE);
    }, 2000);

  });

```

Use Helper methods.. 

Show the popup...

```
  // show the popuup
  ew.show();

  // hide the popup
  ew.hide()

  // load a new webinar
  ew.load(MEMBERCODE, WEBICODE2);
```

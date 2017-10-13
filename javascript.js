//this is a file of usefull js functions




/************************************Prototypes************************************/


//remove element
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

//If you wish to remove an HTML element with id test, do
//document.getElementById("test").remove();

//remove from nodelist or array
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

//Same idea as above, to remove the third element of an aray called foo, do
//foo[3].remove();

//replace all in string
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
//To replace all spaces with nothing in a string called bob, do
//bob.replaceAll(" ", "");

//Makes ":scope" work in query selector
(function(doc, proto) {
  try { // check if browser supports :scope natively
    doc.querySelector(':scope body');
  } catch (err) { // polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function(method) {
      var nativ = proto[method];
      proto[method] = function(selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          var id = this.id; // remember current element id
          this.id = 'ID_' + Date.now(); // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          var result = doc[method](selectors);
          this.id = id; // restore previous id
          return result;
        } else {
          return nativ.call(this, selectors); // use native code for other selectors
        }
      }
    });
  }
})(window.document, Element.prototype);



/************************************Position/Dimentions************************************/

//get window width
function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

//get window height
function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

//finds current "fixed equivelent" position on screen
function findPos(node) {
    var node = node; 	
    var curtop = 0;
    var curtopscroll = 0;
    var curleft = 0;
    var curleftscroll = 0;
    var needHTML = true;
    if (node.offsetParent) {
        do {
        	if(node.offsetParent && node.offsetParent == document.getElementsByTagName("html")[0]){
        		needHTML = false;
        	}
            curtop += node.offsetTop;
            curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
            curleft += node.offsetLeft;
            curleftscroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
        } while (node = node.offsetParent);

        if(needHTML){
        	curtopscroll += document.getElementsByTagName("html")[0].scrollTop;
        	curleftscroll += document.getElementsByTagName("html")[0].scrollLeft;
        }
        


        return [curleft - curleftscroll, curtop - curtopscroll];
    }
}


/************************************Class Manipulation************************************/


function hasClass(obj, c) {
  return new RegExp('(\\s|^)' + c + '(\\s|$)').test(obj.className);
}

function addClass(obj, c) {
  if (!hasClass(obj, c)) {
    obj.className += ' ' + c;
  }
}

function removeClass(obj, c) {
  if (hasClass(obj, c)) {
    obj.className = obj.className.replace(new RegExp('(\\s|^)' + c + '(\\s|$)'), ' ').replace(/\s+/g, ' ').replace(/^\s|\s$/, '');
  }
}

function toggleClass(obj, c){
    if (!obj || !c){
        return;
    }

    var classString = obj.className, nameIndex = classString.indexOf(c);
    if (nameIndex == -1) {
        classString += ' ' + c;
    }
    else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+c.length);
    }
    obj.className = classString;
}


/************************************AJAX************************************/

function JHencodeURI(object) {
    var encodedString = '';
    for (var prop in object) {
	if (object.hasOwnProperty(prop)) {
	    if (encodedString.length > 0) {
		encodedString += '&';
	    }
	    encodedString += encodeURI(prop + '=' + object[prop]);
	}
    }
    return encodedString;
}

function ajaxGet(url,data,onsuccess,onerror){
	var xhr = new XMLHttpRequest();
	url = url + '?' + JHencodeURI(data);
	xhr.open('GET', encodeURI(url));
	xhr.onload = function() {
	    if (xhr.status === 200 && onsuccess !== undefined) {
		onsuccess(xhr.responseText);
	    }
	    else if (xhr.status !== 200 && onerror !== undefined) {
		onerror(xhr.status);
	    }
	};
	xhr.send();
}


function ajaxPost(url,data,onsuccess,onerror){

	var xhr = new XMLHttpRequest();
	var toSend = JHencodeURI(data);
	xhr.open('POST', encodeURI(url));
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	    if (xhr.status === 200 && onsuccess !== undefined) {
		onsuccess(xhr.responseText);
	    }
	    else if (xhr.status !== 200 && onerror !== undefined) {
		onerror(xhr.status);
	    }
	};
	xhr.send(encodeURI(toSend));
}


/************************************Misc************************************/


//normal random number
function normalRandom() {
	var val, u, v, s, mul;
	do	{
		u = Math.random()*2-1;
		v = Math.random()*2-1;

		s = u*u+v*v;
	} while(s === 0 || s >= 1);
	mul = Math.sqrt(-2 * Math.log(s) / s);
	val = u * mul;
	return val / 14;	// 7 standard deviations on either side
}




//detect ios
//I don't normally like checking useragent but ios messes up fixed backgrounds so check for that
if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
	document.querySelector("body").classList.add("ios");
}


//check if arrays are equal
function arraysEqual(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
      if(Array.isArray(arr1[i]) && Array.isArray(arr2[i])){
        if(!arraysEqual(arr1[i],arr2[i])) return false;
      } else if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true; 
}

//duplicate object
function duplicateObject(obj){
	if(typeof obj == "object" && obj !== null){
		var ret = {};
		for(var index in obj){
			ret[index] = duplicateObject(obj[index]);
		}
		return ret;
	} else {
		return obj;
	}
}

//cross browser add event listener
function addEvent(elm, evType, fn, useCapture) {

	if (elm.addEventListener) { 

		elm.addEventListener(evType, fn, useCapture); 

		return true; 

	}

	else if (elm.attachEvent) { 

		var r = elm.attachEvent('on' + evType, fn); 

		return r; 

	}

	else {

		elm['on' + evType] = fn;

	}

}

//get prefixed version of css properties
function getPrefixedVersion(property){
    var root = document.documentElement;
    var prefixes = "webkit,Webkit,Moz,O,ms,Khtml".split(",");
    
    if(property in root.style){
        return property;
    }
    
    property = property.charAt(0).toUpperCase() + property.slice(1);
    
    for (var i = 0; i<prefixes.length; i++){
        if (prefixes[i] + property in root.style){
            return prefixes[i] + property;
        }
    }
}

//extend an object
function extend(Child, Parent){
  var Temp = function(){};
 
  Temp.prototype = Parent.prototype;
 
  Child.prototype = new Temp();
 
  Child.prototype.constructor = Child;
}

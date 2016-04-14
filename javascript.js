//this is a file of usefull js functions

//remove element
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

//remove from nodelist
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


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
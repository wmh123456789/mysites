//worker callback will run "main" function unless instructed otherwise.

//callbacks' return values are ignored unless they are strictly equal to 'false' 
//in which case they stop the postMessage method from returning anything to the main thread.
//The message or transfers should be modified in place.

/*
callbacks can be global functions (as in negate.js), or they can be enclosured
like in this example. This example is intentionally over complex to show how you 
might incorporate non-trival code.

Whatever function used is actually enclosured again inside of the mutable worker's 
addWorkerCallback handler. Thus you could have several callbacks
registered, using their 'main' function, and they won't overwrite each other
*/

(function () {
    function lower(s) {
        return s.toLowerCase();
    }

    function upper(s) {
        return s.toUpperCase();
    }
    
    function replacer(m, lowers, uppers){
        return (lowers) ? upper(m) : lower(m);
    }

    var modifier = function (msg, transfers) {
        if (typeof msg.result == 'string') {
            //toggle upper and lower
            msg.result = msg.result.replace(/([a-z]+)|([A-Z]+)/g, replacer);
        }
    };
    
    this.main = modifier;

}(this));
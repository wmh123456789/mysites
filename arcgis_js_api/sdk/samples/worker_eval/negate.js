//worker callback will run "main" function unless instructed otherwise.
//we specified "negateIt" as the callback function name, so that is what will get used here.

//callbacks' return values are ignored unless they are strictly equal to 'false' 
//in which case they stop the postMessage method from returning anything to the main thread. 

function negateIt(msg){
    if(typeof msg.result == "number"){
        msg.result *= -1;
    }
}
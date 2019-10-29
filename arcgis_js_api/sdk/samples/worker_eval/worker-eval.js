/* jshint worker:true */
self.addEventListener('message', function (evt) {
    var msg = evt.data;
    try {
        postMessage({
            msgId: msg.msgId,
            result: eval(msg.code),
            code: msg.code
        });
    } catch (err) {
        postMessage({
            msgId: msg.msgId,
            status: 'error',
            message: err.message || err
        });
    }
});
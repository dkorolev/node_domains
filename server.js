var express = require('express');
var trycatch = require('trycatch');

function someAsyncServe(request, response) {
    if (true) {
        throw new Error("Something went wrong.");
    } else {
        response.status(500).send('OK\n');
    }
}

function someServe(request, response) {
    process.nextTick(function() {
        setTimeout(function() {
            someAsyncServe(request, response);
        }, 100);
    });
}

var app = express();
app.get('/', function(request, response) {
    trycatch(function() {
        someServe(request, response);
    }, function(e) {
        var payload = {
            error: 'Error',
        };
        if (e instanceof Error) {
            payload.message = e.message;
        }
        response.status(500).send(JSON.stringify(payload, null, 2) + '\n');
    });
});
app.listen(5001);

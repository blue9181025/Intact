var Express = require('express'),
    Vdt = require('vdt');

var app = Express();

app.use(Express.static(__dirname));

app.use(Vdt.middleware({
    src:__dirname
}));

app.listen(9678);

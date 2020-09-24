import ServerBuilder from 'statenext-api';

let server = new ServerBuilder();
server.usePath(__dirname + "/routes", __dirname + "/services");

server.setup({

}).server.listen(8080, () => {
    console.log("listen on 8080")
});
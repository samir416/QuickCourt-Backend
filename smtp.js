const net = require("net");

const server = net.createServer((socket) => {
    socket.write("220 localhost SMTP\r\n");
    socket.on("data", (data) => {
        const msg = data.toString();
        console.log("C:", msg.trim());
        if (msg.startsWith("EHLO") || msg.startsWith("HELO")) {
            socket.write("250-localhost\r\n250 AUTH PLAIN LOGIN\r\n");
        } else if (msg.startsWith("AUTH")) {
            socket.write("235 Authentication successful\r\n");
        } else if (msg.startsWith("MAIL FROM")) {
            socket.write("250 OK\r\n");
        } else if (msg.startsWith("RCPT TO")) {
            socket.write("250 OK\r\n");
        } else if (msg.startsWith("DATA")) {
            socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
        } else if (msg === ".\r\n" || msg.endsWith("\r\n.\r\n")) {
            socket.write("250 OK: Message accepted for delivery\r\n");
        } else if (msg.startsWith("QUIT")) {
            socket.write("221 Bye\r\n");
            socket.end();
        } else {
            // handle other or ignore
        }
    });
});
server.listen(2525, () => console.log("SMTP running on 2525"));

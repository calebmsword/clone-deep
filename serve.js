import http from "node:http"
import * as path from "node:path";
import fs, { R_OK } from "fs";
import { parse } from "node:url";

/*
Thanks to stackoverflow user Jonathan Tran.
https://stackoverflow.com/a/13635318/22334683
*/

const port = process.argv[2] || 8888;

var contentTypesByExtension = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "text/javascript"
};

const directory = process.cwd();

http.createServer((request, response) => {

    const uri = parse(request.url).pathname;
    let filename = path.join(directory, uri);

    if (fs.statSync(filename).isDirectory()) filename += "\\index.html";

    fs.access(filename, R_OK, err => {
        if (err) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write(`404 Not Found\n, ${err}`);
            response.end();
            return;
        };

        fs.readFile(filename, "utf-8", (err, file) => {
            if (err) {
                response.writable(500, {"Content-Type": "text/plain"});
                response.write(`${err}\n`);
                response.end();
                return;
            }

            const headers = {};
            const contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;

            response.writeHead(200, headers);
            response.write(file, "utf-8");
            response.end();
        });
    });
}).listen(parseInt(port, 10));  // argv[2] is a string

console.log("Static file server running at\n  => http://localhost:" 
            + port + "/\nCTRL + C to shutdown");

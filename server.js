// var http = require('http');

// var server = http.createServer(function (req, res) { //req=request dan res=response
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end("<h1>Hi, selamat datang di nodejs Dion!</h1>");
//     res.end();
// });

// server.listen(8000); //arahin port server ke 8000

// console.log("server running on http://localhost:8000"); //outputnya

// var http = require('http');

// http.createServer(function (request, response) {
//     response.writeHead(200, {'Content-Type': 'text/html'});
//     switch(request.url){
//         case '/about':
//             response.write("Ini adalah halaman about");
//             break;
//         case '/profile':
//             response.write("Ini adalah halaman profile");
//             break;
//         case '/produk':
//             response.write("Ini adalah halaman produk");
//             break;
//         default:
//             response.write("404: Halaman tidak ditemukan");
//             break;
//     }
//     response.end();
// }).listen(8000);

// console.log('Server running on http://localhost:8000');

// var http = require('http');
// const mysql = require('mysql2');
// const url = require('url');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'latihan_node'
// });

// db.connect((err) => {
//     if (err) throw err;
//     console.log('MySQL connected!');
// });

// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);

//     if (req.method === 'GET' && parsedUrl.pathname === '/users') {
//         db.query('SELECT * FROM users', (err, results) => {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Database error');
//             }
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(results));
//         });

//     } else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk;
//         });

//         req.on('end', () => {
//             try {
//                 const { name, passsword } = JSON.parse(body);

//                 db.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, password], (err) => {
//                     if (err) {
//                         res.writeHead(500);
//                         return res.end('Insert failed');
//                     }
//                     res.writeHead(200);
//                     res.end('User added!');
//                 });
//             } catch (e) {
//                 res.writeHead(400);
//                 res.end('Invalid JSON');
//             }
//         });
//     } else {
//         res.writeHead(404);
//         res.end('Tambahkan /users pada search bar');
//     }
// }).listen(8000);

// console.log('Server running on http://localhost:8000');

const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const mysql = require('mysql2');

const publicDir = path.join(__dirname, 'public');
const port = 8000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'latihan_node'
});

db.connect((err) => {
    if (err) {
        console.log("koneksi database gagal");
        process.exit();
    }
    console.log("database terhubung!");
});

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);

        fs.readFile(fullPath, (err, content) => {
            const ext = path.extname(fullPath);
            const contentType = ext === '.css' ? 'text/css' :
                                ext === '.js' ? 'text/javascript' :
                                ext === '.html' ? 'text/html' : 'text/plain';
            res.writeHead(200, { 'content-type': contentType });
            res.end(content);
        });

    } else if (req.method === 'POST' && req.url === '/data') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            //proses di sini!
            const parsed = parse(body);
            const { name, password } = parsed;
            const sql = 'insert into users (name, password) values(?, ?)';

            db.query(sql, [name, password], (err) => {
                if (err) {
                    console.log("gagal simpan ke db");
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    return res.end("gagal simpan ke db");
                }

                res.writeHead(200, { 'content-type': 'text/plain' });
                return res.end('berhasil simpan ke db');
            });
        });
    }
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
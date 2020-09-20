#coding:utf-8

import http.server
import socketserver

port = 80
address = ("",port)

handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(address,handler)

print(f"Server démaré sur le PORT {port}")

httpd.serve_forever()

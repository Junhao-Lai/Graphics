import socket 
import datetime
import sys 

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind(("127.0.0.1",int(sys.argv[1]))) # do nothing since want to receive mail from this address 
sock.listen(10) #one request at a time 


header_template = (
"HTTP/1.1 {status}\r\n" +
"Date: Mon, 1 April 2024 12:28:53 GMT\r\n" +
"Server: MyFavoriteSmallServer\r\n" +
"Last-Modified: Mon, 1 April 2024 12:28:53 GMT\r\n" +
"Content-Length: {length}\r\n" +
"Content-Type: text/html\r\n" +
"Connection: Closed\r\n" +
"\r\n")

while True:
    conn, add = sock.accept()
    print(f"connection from {add}")
    data = conn.recv(1024)
    text = data.decode()
    now  = datetime.datetime.now()
    body = f"Hello World now is {now}"
    body = body.encode()

  #  header = header_template.format(status = "200 OK", length=len(body))
    header = header_template.format(status="200 OK",length=str(len(body))).encode()
    print(header)
    conn.send(header + body)
    conn.close()










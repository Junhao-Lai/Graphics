import socket 

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind(("127.0.0.1",8000)) # do nothing since want to receive mail from this address 
sock.listen(1)
conn, add = sock.accept()
data = conn.recv(1024)
text = data.decode()

header = (
b"HTTP/1.1 200 OK\r\n" +
b"Date: Mon, 1 April 2024 12:28:53 GMT\r\n" +
b"Server: MyFavoriteSmallServer\r\n" +
b"Last-Modified: Mon, 1 April 2024 12:28:53 GMT\r\n" +
b"Content-Length: 11\r\n" +
b"Content-Type: text\r\n" +
b"Connection: Closed\r\n" +
b"\r\n")

body = "Hello Hins Cheung" 

conn.send(header + body.encode())
conn.close()








#print(sock.accept()) # It blocks
#sock.accept()
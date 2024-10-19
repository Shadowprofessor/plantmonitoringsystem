from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs

class LoginHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('login.html', 'rb') as file:
                self.wfile.write(file.read())

        elif self.path == '/smart_monitoring.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('smart_monitoring.html', 'rb') as file:
                self.wfile.write(file.read())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Page not found')

    def do_POST(self):
        if self.path == '/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = parse_qs(post_data)
            username = params['username'][0]
            password = params['password'][0]

            # Replace the hardcoded values with your authentication logic
            valid_username = "admin"
            valid_password = "123"

            if username == valid_username and password == valid_password:
                self.send_response(302)  # 302 Found (redirect)
                self.send_header('Location', '/smart_monitoring.html')
                self.end_headers()
            else:
                self.send_response(401)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'Invalid username or password. Please try again.')
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Page not found')

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, LoginHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

run_server()


#!/usr/bin/env python3
"""
Simple HTTP server with proper MIME types for audio files
"""

import http.server
import socketserver
import os

class AudioHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def guess_type(self, path):
        mimetype, _ = super().guess_type(path)
        
        # Ensure correct MIME types for audio files
        if path.endswith('.mp3'):
            mimetype = 'audio/mpeg'
        elif path.endswith('.wav'):
            mimetype = 'audio/wav'
        elif path.endswith('.ogg'):
            mimetype = 'audio/ogg'
        elif path.endswith('.webm'):
            mimetype = 'audio/webm'
            
        return mimetype, _

PORT = 8000

with socketserver.TCPServer(("", PORT), AudioHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print("Audio MIME types configured correctly")
    print("Press Ctrl+C to stop")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
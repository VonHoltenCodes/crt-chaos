# CRT CHAOS - Server Implementation Plan

## Overview
This document outlines the steps needed to deploy CRT CHAOS to a production web server.

## Server Requirements

### Minimum Requirements
- **Web Server**: Apache 2.4+ / Nginx 1.18+ / any static file server
- **SSL Certificate**: Required for HTTPS (Let's Encrypt recommended)
- **Storage**: ~50MB (includes all assets)
- **RAM**: Minimal (static site)
- **Node.js**: Not required (pure client-side JavaScript)

### Recommended Stack
1. **Nginx** - Lightweight and efficient for static files
2. **Let's Encrypt** - Free SSL certificates
3. **CloudFlare** (optional) - CDN and DDoS protection

## Deployment Steps

### 1. Pre-Deployment Checklist
- [ ] Set `DEBUG_MODE = false` in `js/chaos-core.js`
- [ ] Verify all puzzle solutions work correctly
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Compress images if needed
- [ ] Minify CSS/JS files (optional)

### 2. File Structure
```
/var/www/crt-chaos/
├── index.html
├── css/
│   ├── style.css
│   ├── crt.css
│   ├── chaos-engine.css
│   └── back-to-top.css
├── js/
│   ├── chaos-core.js
│   ├── main.js
│   ├── back-to-top.js
│   ├── audio-manager-simple.js
│   ├── puzzle-init.js
│   └── puzzles/
│       ├── sentient-terminal.js
│       ├── paranoid-password.js
│       ├── time-clock.js
│       ├── drunk-nav.js
│       ├── conspiracy-search.js
│       ├── existential-error.js
│       ├── mime-modal.js
│       └── iframe-maze.js
├── assets/
│   └── sounds/
│       └── [audio files]
└── images/
    └── favicon.ico
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name crt-chaos.com www.crt-chaos.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crt-chaos.com www.crt-chaos.com;
    
    ssl_certificate /etc/letsencrypt/live/crt-chaos.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crt-chaos.com/privkey.pem;
    
    root /var/www/crt-chaos;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src 'self';" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|wav|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve index.html for all routes (single page app)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Apache Configuration (Alternative)
```apache
<VirtualHost *:80>
    ServerName crt-chaos.com
    ServerAlias www.crt-chaos.com
    Redirect permanent / https://crt-chaos.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName crt-chaos.com
    ServerAlias www.crt-chaos.com
    DocumentRoot /var/www/crt-chaos
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/crt-chaos.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/crt-chaos.com/privkey.pem
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src 'self';"
    
    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
    </IfModule>
    
    # Cache control
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|wav|mp3)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    <Directory /var/www/crt-chaos>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 5. Deployment Commands

#### For Nginx on Ubuntu/Debian:
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Copy files
sudo mkdir -p /var/www/crt-chaos
sudo cp -r /path/to/crt-chaos/* /var/www/crt-chaos/

# Set permissions
sudo chown -R www-data:www-data /var/www/crt-chaos
sudo chmod -R 755 /var/www/crt-chaos

# Install SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d crt-chaos.com -d www.crt-chaos.com

# Enable site
sudo ln -s /etc/nginx/sites-available/crt-chaos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### For Apache on Ubuntu/Debian:
```bash
# Install Apache
sudo apt update
sudo apt install apache2

# Enable required modules
sudo a2enmod ssl headers rewrite

# Copy files
sudo mkdir -p /var/www/crt-chaos
sudo cp -r /path/to/crt-chaos/* /var/www/crt-chaos/

# Set permissions
sudo chown -R www-data:www-data /var/www/crt-chaos
sudo chmod -R 755 /var/www/crt-chaos

# Install SSL certificate
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d crt-chaos.com -d www.crt-chaos.com

# Enable site
sudo a2ensite crt-chaos.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 6. Post-Deployment Testing
1. **Check HTTPS**: Ensure SSL certificate is working
2. **Test all puzzles**: Verify each puzzle functions correctly
3. **Check localStorage**: Ensure progress saves properly
4. **Mobile warning**: Verify it appears on mobile devices
5. **Console errors**: Check browser console for any errors
6. **Performance**: Test load times and responsiveness

### 7. Monitoring & Maintenance
- Set up basic monitoring (uptime, SSL expiry)
- Regular backups (though it's a static site)
- Monitor server logs for errors
- Update SSL certificates before expiry (auto-renewal recommended)

### 8. Performance Optimization (Optional)
1. **Enable HTTP/2**: For faster loading
2. **Implement Brotli compression**: Better than gzip
3. **Use a CDN**: CloudFlare, Fastly, or AWS CloudFront
4. **Minify assets**: Reduce CSS/JS file sizes
5. **Optimize images**: Convert to WebP format

### 9. Security Considerations
- Keep server software updated
- Implement rate limiting for DDoS protection
- Regular security audits
- Monitor access logs for suspicious activity
- Consider implementing fail2ban

### 10. Backup Strategy
Since it's a static site, backups are simple:
```bash
# Daily backup script
#!/bin/bash
tar -czf /backups/crt-chaos-$(date +%Y%m%d).tar.gz /var/www/crt-chaos/
find /backups -name "crt-chaos-*.tar.gz" -mtime +30 -delete
```

## Alternative Hosting Options

### 1. GitHub Pages (Free)
- Push to GitHub repository
- Enable GitHub Pages in settings
- Custom domain support
- Automatic HTTPS

### 2. Netlify (Free tier available)
- Drag and drop deployment
- Automatic HTTPS
- Custom domain support
- Continuous deployment from Git

### 3. Vercel (Free tier available)
- Simple deployment
- Excellent performance
- Custom domain support
- Edge network

### 4. AWS S3 + CloudFront
- Highly scalable
- Global CDN
- Pay-per-use pricing
- More complex setup

## Troubleshooting

### Common Issues:
1. **403 Forbidden**: Check file permissions
2. **Mixed content warnings**: Ensure all resources use HTTPS
3. **localStorage not working**: Check browser privacy settings
4. **Slow loading**: Enable compression and caching
5. **SSL errors**: Verify certificate installation

## Final Notes
- The game is completely client-side, making deployment simple
- No database or server-side processing required
- Can be hosted on any static file server
- Consider adding analytics (privacy-friendly options like Plausible)
- Remember to update the GitHub link in the footer if you change domains

Good luck with your deployment! The chaos awaits... 🎮
# Simple Nginx container serving the static BP Calculator UI

FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy our app files
COPY index.html styles.css app.js ui.js telemetry.js telemetry.html \
     /usr/share/nginx/html/

# (optional) if you have images/fonts etc:
# COPY Images/ /usr/share/nginx/html/Images/

EXPOSE 80

# Nginx default CMD already serves /usr/share/nginx/html

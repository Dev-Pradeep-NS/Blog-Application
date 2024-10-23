#!/bin/sh

# Function to extract a specific secret
get_secret() {
    awk -F '=' -v key="$1" '$1 == key {print $2}' /run/secrets/REACT_APP_SERVER_URL
}

# Extract and set individual environment variables
export REACT_APP_SERVER_URL=$(get_secret "REACT_APP_SERVER_URL")
export REACT_APP_BREVO_API_KEY=$(get_secret "REACT_APP_BREVO_API_KEY")
export REACT_APP_BREVO_EMAIL=$(get_secret "REACT_APP_BREVO_EMAIL")
export REACT_APP_BREVO_NAME=$(get_secret "REACT_APP_BREVO_NAME")
export REACT_APP_FIREBASE_APIKEY=$(get_secret "REACT_APP_FIREBASE_APIKEY")
export REACT_APP_FIREBASE_AUTHDOMAIN=$(get_secret "REACT_APP_FIREBASE_AUTHDOMAIN")
export REACT_APP_FIREBASE_PROJECTID=$(get_secret "REACT_APP_FIREBASE_PROJECTID")
export REACT_APP_FIREBASE_STORAGEBUCKET=$(get_secret "REACT_APP_FIREBASE_STORAGEBUCKET")
export REACT_APP_FIREBASE_MESSAGINGSENDERID=$(get_secret "REACT_APP_FIREBASE_MESSAGINGSENDERID")
export REACT_APP_FIREBASE_APPID=$(get_secret "REACT_APP_FIREBASE_APPID")
export REACT_APP_FIREBASE_MEASUREMENTID=$(get_secret "REACT_APP_FIREBASE_MEASUREMENTID")

# Replace placeholders in env.template with actual env variables
envsubst < /usr/share/nginx/html/env.template > /usr/share/nginx/html/env.js

# Start Nginx
nginx -g 'daemon off;'

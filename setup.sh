#!/bin/bash
# setup.sh
# This script sets up the folder structure for the e-learning-api project.

# Create main project folder


# Create the src folder and its subdirectories
mkdir -p "./src/controllers"
mkdir -p "./src/models"
mkdir -p "./src/routes"
mkdir -p "./src/middlewares"
mkdir -p "./src/config"
mkdir -p "./src/utils"

# Create main files
touch "./src/app.js"
touch "./src/server.js"
touch "./.env"
touch "./README.md"

echo "Folder structure for './' has been created successfully."

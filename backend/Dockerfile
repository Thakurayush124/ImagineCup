# Use a lightweight Python base image
FROM python:3.9-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Set the working directory inside the container
WORKDIR /app

# Copy project files into the container
COPY . /app

# Install Python dependencies
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
RUN npm install

# Expose port 5000
EXPOSE 5050

# Command to start the Node.js server
CMD ["node", "server.js"]

# Use the official Python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Create the output folder
RUN mkdir output

# Copy the Python script into the container
COPY image_scraper_bot.py .

# Run the bot script
CMD ["python", "image_scraper_bot.py"]

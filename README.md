<a href="https://www.linkedin.com/in/cdasmkt" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn profile" />
</a>
<a href="https://twitter.com/cdasmktcda" target="_blank">
  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white" alt="Twitter profile" />
</a>
<a href="https://www.facebook.com/davidacannan" target="_blank">
  <img src="https://img.shields.io/badge/Facebook-1877F2?style=flat&logo=facebook&logoColor=white" alt="Facebook profile" />
</a>
<a href="https://github.com/cdaprod" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" alt="GitHub profile" />
</a>


# 🖼️ Discord Image Scraper Bot 🤖

Its under the python folder, javascript is me still learning javascript...

This Discord bot scrapes images from a Discord channel's history, processes them, and resizes them while maintaining quality and details with resampling. The largest side of the resized images will be 3840 pixels.

## Features

- Scrape images from Discord channel history 💾
- Automatically split images into quadrants and save them 🌐
- Resize images while preserving quality and details 🔎
- Detect and redownload corrupted images 🚨
- Docker support for easy deployment 🐳

## Commands 📜

1. `*scrape_images <limit>`
   - Scrape images from the channel's history up to the specified limit (default: 500) and save them into the output folder.
   - Example: `*scrape_images 200`
2. `*resize_images`
   - Resize the images in the output folder so that the largest side is 3840 pixels, maintaining their quality and details with resampling. The resized images are saved in the `resized_images` folder.
   - Example: `*resize_images`

## Setup 🚀
See discord developers portal for API key and channel_id

### Requirements

- Python 3.9+
- Docker (optional)

### Installation

1. Clone the repository:
2. Install the required packages:
3. Set up the `.env` file with your Discord bot token:
4. Run the script:


### Docker Deployment 🐳

1. Build the Docker image:
2. Run the Docker container, replacing `your_bot_token_here` with your Discord bot token:

``` 
docker build -t discord_image_scraper .
``` 

``` 
docker run -e DISCORD_BOT_TOKEN=your_bot_token_here discord_image_scraper
``` 

## Contributing 🤝

Feel free to open issues or submit pull requests if you have any suggestions, improvements, or bug reports.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

# cda.discordScraper was made for a personal workflow

## Functionality

- Listen to discord channel via bot application and ap1 t0ken

- Download any images as they come in
- Images that are in a 2:2 grid are cropped into 4 individual images and saved to output_folder.

- Images are indexed so that they shouldnt be duplicated.

### Commands via discord message

- Use the ```*scrape_images 500``` 
command from the channel to scrape older images.

#### Docker command

```
docker run -d -p 8000:8000 -v /my/computer/file:/app/output_images --name discordScraper discordScraper
```

---

# How to use docker tag commands with Docker Registry

To clarify, the docker run command I provided in the previous response is for running a Docker container using a locally built image. The command does not interact with a remote repository or push the image to any repository.

If you want to tag your Docker image and push it to a remote repository, such as Docker Hub or a private container registry, you need to follow these steps:

Build and tag your Docker image:

```
docker build -t your_dockerhub_username/your_image_name:your_tag .
```

Replace your_dockerhub_username with your Docker Hub username, your_image_name with a name for your Docker image, and your_tag with a tag for your image (e.g., "latest", "v1.0", etc.).

Log in to Docker Hub (or your private container registry) using the docker login command:

```
docker login
```

Enter your Docker Hub (or private registry) credentials when prompted.

Push your tagged image to the remote repository:

```
docker push your_dockerhub_username/your_image_name:your_tag
```

Replace your_dockerhub_username, your_image_name, and your_tag as you did in step 1.

Now your Docker image is tagged and pushed to the remote repository.

To run a Docker container using the image from the remote repository, you can use the following command:

```
docker run -d -p 8000:8000 -v /my/computer/file:/app/output_images --name your_container_name your_dockerhub_username/your_image_name:your_tag
```

Replace your_container_name, your_dockerhub_username, your_image_name, and your_tag as needed. Docker will pull the image from the remote repository if it's not already present on your local machine.

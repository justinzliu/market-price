# Project Summary

## Project Objective/Goal

This project is a webscraper web application with initial intentions for convenient job hunting. Future development will be be aimed towards generality of the tool, focusing to minimize necessary user inputs while maximizing generality and functionality.

## Languages & Implementation

This project primarily utilizes three programming languages: Javascript, Python, and Go.

Python was chosen for it's access to powerful webtools for HTML and XML parsing; and HTML requests. Beautiful Soup and Requests were invaluable tools to navigate the complexities of HTML. The dynamic nature of Python was also a benefit as it minimized the necessary expertise in manipulating these complex libraries.

Go was adopted to handle the computationally heavy parts of the project. With the current features added, this included processing the large datasets retrieved by the Python webscraper. Since Go was designed for easy access to concurrent programming (particularly useful for predictable, but large workload computations), it was an obvious choice for the computational side of the web application.   

Given this is a NodeJS web application, Javascript was heavily leveraged. Using the Express framework, a light-weight server was deployed to showcase the project. As this is a web application, CSS and HTML domain languages were also utilized.

## Methods for Communication

NodeJS offers a built-in spawn() method, a foreign function interface that allowed for easy execution of the webscraper. This method facilitated passing the HTML information needed by the webscraper, and the resulting dataset back to the NodeJS server.

ZeroMQ message queue was utilized for communications between the NodeJS server and the Go socket server. A POST method also calls a ZeroMQ requests that passes the scraped data to the Go server. Once the dataset is processed, the processed information is transferred back to the NodeJS server and the results are rendered to the client.


## Steps To Run Project

Unfortunately, I was unable to get vagrant and chef to deploy the necessary environment for easy deployment of the project. With the necessary packages, the project may be run by:
1. Navigating to the project directory
2. Starting the Node server (node app.js)
3. Building the Go program (go build functions.go)
4. Starting the Go server (./functions)
5. Opening a browser and navigating to localhost:3000
6. This will load the index page, prompting entry of a URL, Container Details, and Container Entry Details.

(1) example URL: https://www.monster.com/jobs/search/?q=Software-Developer&where=Seattle	
This is the hyperlink to the website with results in a container you wish to scrape.

(2) example Container Details: SearchResults,section,card-content
This describes the container which holds the results. This may be expressed as a section, table, div, etc HTML tag. We need the class name, HTML tag, and class, expressed in a comma separated form. 

(3) example Container Entry Details: [h2,div,div],[title,company,location]
This is the actual container description that holds all desired information. Here we want the position name, company, and location. We need the HTML tag and class for each piece of information, expressed in arrays (encased in []) separated by commas with no spaces.

See screencaps folder for screenshots of the project

### Necessary external packages to run include:
Javascript: npm, express, body-parser
Python: beautifulsoup4
Go: libzmq3-dev (dependency for zmq4), zmq4, encoding/json

## Features

1. Web Application with the goal of accessible generalized webscraping. Plug in the URL and with minimal details to retrieve the target data.
2. Upon entry of the necessary details, the application will scrape the target site, return the contents for processing, then display all entries captured as well as a histogram displaying the proportional representation of the entries based on one of the captured details (in our example, its location).
3. Scraped entries may be sorted by lexigraphical order and selected (resulting in the entry highlighted)
4. See screencaps folder for screenshots of the project
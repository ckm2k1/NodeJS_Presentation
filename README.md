NodeJS Presentation
===================

Presentation files for Node.js talk given at js-montreal on July 10th, 2012.

Content
------------------

1. Main directory - Files for the slides and highlighting code snippets. 

2. Scripts - Live exmaples of the code snippets shown in the slides.

3. CLPadMapper - Contains the concurrent CL crawler including all front-end files required to map
the coordinates onto a google map. 

Project dependencies
------------------

The following are required Node modules:

CLPadMapper requires 'request' and 'jsdom'. Windows users will need to acquire or build their own binaries for a library called Contextify which jsdom depends on to function. 
For this you will need node-gyp, python 2.7 and visual studio express 2010 installed on your machine already. python_path environment variable will need to be configured properly. This WILL NOT work with 64bit Node.js, only 32bit. 

The main presentation files require express and jade.

-- ./CLPadMapper/node_modules/jsdom/node_modules/contextify contains the proper binaries for windows 7 64bit. Node has to be 32bit!

-- What's this parse.py in CLPadMapper? That was my first attempt at crawling Craigslist. It actually turned out to be an intersting starting point because python handles concurrency very differently.
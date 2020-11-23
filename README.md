# Tensordlow app to classify dog images

### node version - v12.14.0

### Demo URL

https://bhargavthakrar.github.io/tensorflow-app/

### To run

`npm i`  
`npm start`  
[http://localhost:3000/tensorflow-app](http://localhost:3000/tensorflow-app)

### Note

The app currently detects any type of image and predicts its className.  
Any specific configuration is not currently passed to the mobilenet model and in
the interest of time I have not researched on that part but, I'm pretty sure we
can load specific models and detect only specific category of images.  

Also there is one warning while ruuning tests in `@tensorflow/tfjs-core/src/environment.ts`. It essentially warns about environment being set twice. Need to figure out how to get rid of that warning.

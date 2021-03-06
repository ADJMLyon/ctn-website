# ctn-website

Web platform for content management, video and inventory, for [CTN](https://www.facebook.com/ctnecl/).

## Introduction

Licensed under the MIT license.

## Running

### Building
```
    $ npm install
    $ webpack
```

### Developing
We're using nodemon to manage Node.js code watching, and `webpack --watch` for browser-code watching.
```
    $ npm run watch
    $ nodemon
```

### Running
```bash
    $ npm install
    $ mongod
    $ sudo /etc/init.d/redis-server start # Whether you want session-persistence on Node.js server reboot
    $ forever start # If the forever task is properly configured
```

## Code entry points
Browser: `./browser/scripts/index_router.jsx`

Node: `./app.js`

## Questions
Contact @jhoareau on GitHub.

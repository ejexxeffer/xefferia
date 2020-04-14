'use strict';

const version = '' + Math.random().toString(36).substr(2, 9);

const CACHE = `offline-cache-${version}`;

const CACHE_ERRORS = `err-cache-${version}`;

const FILES_TO_CACHE = [
  '/manifest.json',
  '/index.html',
  '/archive.html',
  '/contacts.html',
  '/about.html',
  '/404.html',
  '/posts/20_04_2019.html',
  '/posts/29_08_2019.html',  
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-256x256.png',
  '/android-chrome-512x512.png',
  '/img/320dp.svg',
  '/img/570dp.svg',
  '/img/770dp.svg',
  '/img/1024dp.svg',
  '/img/1440dp.svg',
  '/img/1920dp.svg',
  '/img/2048dp.svg',
  '/img/behance.svg',
  '/img/cake.jpg',
  '/img/cake_slice.jpg',
  '/img/chevron-down.svg',
  '/img/envelope.svg',
  '/img/instagram.svg',
  '/img/octofaceright.svg',
  '/img/rss.svg',
  '/img/search.svg',
  '/img/three-bars.svg',
  '/img/twitter.svg',
  '/img/wtf.jpg',
  '/build/main.css',
  '/build/main.js',
  '/fonts/oranienbaum-regular-webfont.woff',
  '/fonts/roboto-italic-webfont.woff2',
  '/fonts/roboto-italic-webfont.woff',
  '/fonts/roboto-light-webfont.woff2',
  '/fonts/roboto-light-webfont.woff',
  '/fonts/roboto-lightitalic-webfont.woff2',
  '/fonts/roboto-lightitalic-webfont.woff',
  '/fonts/roboto-medium-webfont.woff2',
  '/fonts/roboto-medium-webfont.woff',
  '/fonts/roboto-regular-webfont.woff2',
  '/fonts/roboto-regular-webfont.woff',
  '/fonts/roboto-thin-webfont.woff2',
  '/fonts/roboto-thin-webfont.woff',
  '/fonts/roboto-thinitalic-webfont.woff2',
  '/fonts/roboto-thinitalic-webfont.woff',
  '/fonts/robotomono-regular-webfont.woff2',
  '/fonts/robotomono-regular-webfont.woff'
];

self.addEventListener('install', (event) => {
  console.log('The service worker is being installed.');

  event.waitUntil(precache());
  console.log('Precache is done')
});

// self.addEventListener('fetch', (event) => {
//   console.log('The service worker is serving the asset.');
  
//   event.respondWith(fromCache(event.request));
//   event.waitUntil(update(event.request));
// });


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(response) {
              return caches.open(CACHE)
                .then(function(cache) {
                  cache.put(event.request.url, response.clone());    //save the response for future
                  return response;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_ERRORS)
                .then(function(cache) {
                  cache.put(event.request.url, err);
                  return err;
                });
            });
        }
      })
  );
});

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll(FILES_TO_CACHE)
    .then(() => {console.log('Assets added to cache')})
     .catch(err => console.log('Error while fetching assets', err));
  });
}

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((response) => {
      return response || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then((cache) => {
    return fetch(request).then((response) => {
      return cache.put(request, response);
    });
  });
}
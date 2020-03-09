'use strict';

const version = '1';

const CACHE = `static-cache-${version}`;

const FILES_TO_CACHE = [
  '/index.html',
  '/archive.html',
  '/posts/20_04_2019.html',
  '/posts/29_08_2019.html',
  '/about.html',
  '/404.html',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/img/320dp.svg',
  '/img/570dp.svg',
  '/img/770dp.svg',
  '/img/1024dp.svg',
  '/img/1440dp.svg',
  '/img/1920dp.svg',
  '/img/2048dp.svg',
  '/img/bars_new.svg',
  '/img/behance.svg',
  '/img/cake_slice.jpg',
  '/img/cake.jpg',
  '/img/wtf.jpg',
  '/img/chevron-down.svg',
  '/img/envelope.svg',
  '/img/github-alt.svg',
  '/img/instagram.svg',
  '/img/octoface.svg',
  '/img/octofaceright.svg',
  '/img/rss.svg',
  '/img/search.svg',
  '/img/three-bars.svg',
  '/img/twitter.svg',
  '/css/fonts.css',
  '/css/main.css',
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
  '/fonts/robotomono-regular-webfont.woff',
];

self.addEventListener('install', (event) => {
  console.log('The service worker is being installed.');

  event.waitUntil(precache());
});

self.addEventListener('fetch', (event) => {
  console.log('The service worker is serving the asset.');

  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request));
});

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll(FILES_TO_CACHE);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      return matching || Promise.reject('no-match');
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
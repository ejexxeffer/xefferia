'use strict';

// const version = '' + Math.random().toString(36).substr(2, 9);
const version = '2';

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
  '/posts/binaryfind.html',
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
// NEW VERSION OF SERVICE WORKER WITH ASYNC AWAIT
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE);
  await cache.addAll(FILES_TO_CACHE);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }
  
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      // correct error is 408 but i don't have exact page for that
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};


self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache(CACHE)
    );
  });

  // Enable navigation preload
  // const enableNavigationPreload = async () => {
  //   if (self.registration.navigationPreload) {
  //     // Enable navigation preloads!
  //     await self.registration.navigationPreload.enable().then((response) => {console.log('Preload is active', response)});      
  //   }
  // };
  
  // self.addEventListener('activate', (event) => {
  //   event.waitUntil(self.clients.claim());
  //   event.waitUntil(enableNavigationPreload());
  // });
  
  // new version of fetch listener
  self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/404.html',
    })
  );
});

// self.addEventListener('install', (event) => {
//   console.log('The NEW service worker is being installed.');
  
//   event.waitUntil(precache());
//   console.log('Precache is done')
// });

// // self.addEventListener('fetch', (event) => {
// //   console.log('The service worker is serving the asset.');
  
// //   event.respondWith(fromCache(event.request));
// //   event.waitUntil(update(event.request));
// // });


// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         if (response) {
//           return response;     // if valid response is found in cache return it
//         } else {
//           return fetch(event.request)     //fetch from internet
//             .then((response) => {
//               return caches.open(CACHE)
//                 .then((cache) => {
//                   cache.put(event.request.url, response.clone());    //save the response for future
//                   return response;   // return the fetched data
//                 })
//             })
//             .catch(err => console.log('Error while fetching assets', err));
//         }
//       })
//   );
//   event.waitUntil(update(event.request));
// });

// function precache() {
//   return caches.open(CACHE).then((cache) => {
//     return cache.addAll(FILES_TO_CACHE)
//     .then(() => {console.log('Assets added to cache')})
//      .catch(err => console.log('Error while fetching assets', err));
//   });
// }



// // function fromCache(request) {
// //   return caches.open(CACHE).then((cache) => {
// //     return cache.match(request).then((response) => {
// //       return response || Promise.reject('no-match');
// //     });
// //   });
// // }

// function update(request) {
//   return caches.open(CACHE).then((cache) => {
//     return fetch(request).then((response) => {
//       console.log('Update is done.');
//       return cache.put(request, response);
//     })
//     .catch(err => console.log('Error while put response in cache', err));
//   })
//   .catch(err => console.log('Error while caching', err));
// }
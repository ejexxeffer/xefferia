/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7aa339e7'], (function (workbox) { 'use strict';

  workbox.enable();
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "404.html",
    "revision": "9711b77bdc8c020c8ce6cfb61030540c"
  }, {
    "url": "about.html",
    "revision": "69713d102cfba3614b9334445af5732c"
  }, {
    "url": "android-chrome-192x192.png",
    "revision": "5d62c70e364674f37ae7f37537f19a66"
  }, {
    "url": "android-chrome-256x256.png",
    "revision": "c39e0ae752ea1339dfff9f26f42bb668"
  }, {
    "url": "android-chrome-512x512.png",
    "revision": "7649e919df95660bd0f9c6a08a01feea"
  }, {
    "url": "apple-touch-icon-114x114.png",
    "revision": "f4618e59e09cb7c65893db566b52f84b"
  }, {
    "url": "apple-touch-icon-120x120.png",
    "revision": "fae32620944d1647ffc0cd53f3de513e"
  }, {
    "url": "apple-touch-icon-144x144.png",
    "revision": "661762cd09fb42b0d39f047ce7c8a60d"
  }, {
    "url": "apple-touch-icon-152x152.png",
    "revision": "538db3e652c35a63f1abbc59e0f3e388"
  }, {
    "url": "apple-touch-icon-180x180.png",
    "revision": "c5c72dace6ff5b6e1da066b013da9d88"
  }, {
    "url": "apple-touch-icon-57x57.png",
    "revision": "4616c488037f09702b78ec945e64b4ba"
  }, {
    "url": "apple-touch-icon-60x60.png",
    "revision": "e99cfe6a21a46452151a774c2e7971fe"
  }, {
    "url": "apple-touch-icon-72x72.png",
    "revision": "85647b778990f9190d27927ac78572f6"
  }, {
    "url": "apple-touch-icon-76x76.png",
    "revision": "4da30bdb3f8ed455b046fbfcf7191d32"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "cd4aa14abb7bd764cbf36b8f7c827f99"
  }, {
    "url": "archive.html",
    "revision": "f37bfc15b6174cd1b294d4ac1873c061"
  }, {
    "url": "build/dark.css",
    "revision": "f9973f3c2f3741e484053ce9fd3accee"
  }, {
    "url": "build/light.css",
    "revision": "63b53ea871f1b46f0d1ca650006292e3"
  }, {
    "url": "build/main.css",
    "revision": "cb3eed98e5ad001a10e562baf6b583bd"
  }, {
    "url": "build/main.js",
    "revision": "89aec464c2700fa359d5a03bd533b6a1"
  }, {
    "url": "contacts.html",
    "revision": "532db4e94236f9cc67c8923df494b99e"
  }, {
    "url": "favicon-16x16.png",
    "revision": "a0e55e403a8401ce96aaef46edab27c5"
  }, {
    "url": "favicon-32x32.png",
    "revision": "bb5d943d82e19991a7b00b3ee4b38cb2"
  }, {
    "url": "favicon.ico",
    "revision": "2abf1cf63ca21f7488f5a0c5f71a829e"
  }, {
    "url": "fonts/oranienbaum-regular-webfont.woff",
    "revision": "bee7716326e508242a4482cd50cfe761"
  }, {
    "url": "fonts/oranienbaum-regular-webfont.woff2",
    "revision": "dd668a8be33601248853b272553261b0"
  }, {
    "url": "fonts/roboto-italic-webfont.woff",
    "revision": "c34d1b863564e2c41233763a51694590"
  }, {
    "url": "fonts/roboto-italic-webfont.woff2",
    "revision": "dd38cf271fc55a22052a22269012eb02"
  }, {
    "url": "fonts/roboto-light-webfont.woff",
    "revision": "97b4c4f90d5381a0db0f707b10028424"
  }, {
    "url": "fonts/roboto-light-webfont.woff2",
    "revision": "78d23348333008519755bd16d27f037e"
  }, {
    "url": "fonts/roboto-lightitalic-webfont.woff",
    "revision": "eb0d7e9a294bdea49eedfa4b89e10e48"
  }, {
    "url": "fonts/roboto-lightitalic-webfont.woff2",
    "revision": "6c6487d88672152d876449b6a50757a7"
  }, {
    "url": "fonts/roboto-medium-webfont.woff",
    "revision": "c59989de5dc88397591c7e1eb65cb980"
  }, {
    "url": "fonts/roboto-medium-webfont.woff2",
    "revision": "b84930179c81c8fd2a15d894a1ed8152"
  }, {
    "url": "fonts/roboto-regular-webfont.woff",
    "revision": "4a530e6663867009fe46e7ae2295d6a1"
  }, {
    "url": "fonts/roboto-regular-webfont.woff2",
    "revision": "d585f280b03b00f9fc090967207a0117"
  }, {
    "url": "fonts/roboto-thin-webfont.woff",
    "revision": "f9278f79aa9667133a5a49210e742f12"
  }, {
    "url": "fonts/roboto-thin-webfont.woff2",
    "revision": "7f5c7c1277e41992eaeb9ba3ea1ffb34"
  }, {
    "url": "fonts/roboto-thinitalic-webfont.woff",
    "revision": "173a193b9f81d71e2273209c4cda89d2"
  }, {
    "url": "fonts/roboto-thinitalic-webfont.woff2",
    "revision": "03c52b124ac9cbccf9f25e39971d8633"
  }, {
    "url": "fonts/robotomono-regular-webfont.woff",
    "revision": "69972feda2122adc47e87bfcebdb152b"
  }, {
    "url": "fonts/robotomono-regular-webfont.woff2",
    "revision": "d68a1771adc4ac273fbf1fd9e7e28858"
  }, {
    "url": "gulpfile.js",
    "revision": "cc7ff9f509309ef0fd6c49730a7153fb"
  }, {
    "url": "img/1024dp.svg",
    "revision": "df58dc214dd5bc87b5fcddb6468518e4"
  }, {
    "url": "img/1440dp.svg",
    "revision": "b0ed3b0ad0de11829755ef2404f818c1"
  }, {
    "url": "img/1920dp.svg",
    "revision": "65c16028fe13eb30fe4d711c050f47db"
  }, {
    "url": "img/2048dp.svg",
    "revision": "9ff1102d04596153ba508aeeaa0e66fc"
  }, {
    "url": "img/320dp.svg",
    "revision": "19d0de5c046c8a7a1ac0cea1c3dc7948"
  }, {
    "url": "img/570dp.svg",
    "revision": "a79dd3f48d76941da415055ba625a116"
  }, {
    "url": "img/770dp.svg",
    "revision": "e0404005b7a11437113b0feabd83e8b3"
  }, {
    "url": "img/basedfile.svg",
    "revision": "b559bcc92d07c527737bb7e168498abe"
  }, {
    "url": "img/behance.svg",
    "revision": "2a84bd64ad209588feafd74ac7240b53"
  }, {
    "url": "img/cake_slice.jpg",
    "revision": "3d8cef5cdd0131a13d9a3cf6ada410b3"
  }, {
    "url": "img/cake.jpg",
    "revision": "e3aa4b9ed8142e4a6b1af8a36574a373"
  }, {
    "url": "img/chevron-down.svg",
    "revision": "57511d47595edacc2cddcb455a30509f"
  }, {
    "url": "img/chevron-left.svg",
    "revision": "6f8cfeca5e5765d30c07e82b2b5e8e09"
  }, {
    "url": "img/chevron-right.svg",
    "revision": "345dc10e8e042b52f0dcd07c475bd98f"
  }, {
    "url": "img/close.svg",
    "revision": "612304f43b0efb86a5557662bd59f0e2"
  }, {
    "url": "img/ejex0002.svg",
    "revision": "bcabb38a056a383482f636536fcc05f9"
  }, {
    "url": "img/ejexlogo.svg",
    "revision": "c4f9b3ac7113852201490a84576490e3"
  }, {
    "url": "img/envelope.svg",
    "revision": "7745bfc1a8002c65bd8870055144415f"
  }, {
    "url": "img/instagram.svg",
    "revision": "ed1014ac252eb9ae484c75341d02dac8"
  }, {
    "url": "img/octoface.svg",
    "revision": "5c314caa8f4b77e5d8d053aa0da211e4"
  }, {
    "url": "img/octofaceright.svg",
    "revision": "360e67d42df3ba3bbee9084c9542f63b"
  }, {
    "url": "img/one.svg",
    "revision": "c0164f9c7ffe01d30071fa40ce1a79ce"
  }, {
    "url": "img/optimised_ejex_animated.svg",
    "revision": "acde5b1e1e6d1e9bdaf005d284ad7fb5"
  }, {
    "url": "img/rss.svg",
    "revision": "360e8f39e143129b45cee676f82d1b89"
  }, {
    "url": "img/search.svg",
    "revision": "36809be2a9ffd36c6af8ec97c4625a3a"
  }, {
    "url": "img/strange.svg",
    "revision": "5b47d7fffdae269a63f1e1f95c589fd6"
  }, {
    "url": "img/three-bars.svg",
    "revision": "291b63a3f2b98cee03a2fca2c020638a"
  }, {
    "url": "img/twitter.svg",
    "revision": "93b56711da03bd30debd6be33d771546"
  }, {
    "url": "img/two.svg",
    "revision": "2a2730020aafd38ef56d6fee3237760d"
  }, {
    "url": "img/wtf.jpg",
    "revision": "e13bcf1427b2a0297f03ef84ae3160a9"
  }, {
    "url": "index.html",
    "revision": "86425685ed35e02c0749306437cf2bab"
  }, {
    "url": "main_index1.html",
    "revision": "d1f22b8abbc2af6996f0f6ff6cabdb54"
  }, {
    "url": "main_index2.html",
    "revision": "d1f22b8abbc2af6996f0f6ff6cabdb54"
  }, {
    "url": "manifest.json",
    "revision": "e70a45140dfb973afd1861eae900742b"
  }, {
    "url": "mstile-150x150.png",
    "revision": "b54c8130cfc2f3d406e35354138752ed"
  }, {
    "url": "old_sw.js",
    "revision": "8c4a6aa498dcaa6ded46026ebbce7bb4"
  }, {
    "url": "package-lock.json",
    "revision": "be20f6ea0a6abdbdd3aba17112a4789b"
  }, {
    "url": "package.json",
    "revision": "95e54c3d1961ea0c34f39c1d2fcfae5a"
  }, {
    "url": "posts/20_04_2019.html",
    "revision": "ede9f7cb0fee2d4c883bf9febc0e1381"
  }, {
    "url": "posts/202020.html",
    "revision": "d08a0c5e726e4a4c4276ba6f87d3b64a"
  }, {
    "url": "posts/29_02_2020.html",
    "revision": "ac6a699df4703bc88dba5e1a56a8822b"
  }, {
    "url": "posts/29_08_2019.html",
    "revision": "4931f04c2be916c82c9110fee7cb8345"
  }, {
    "url": "posts/binaryfind.html",
    "revision": "662e5e0b6434fac08360537b95f87daf"
  }, {
    "url": "prod.config.js",
    "revision": "184bc93b0cb665e7959089b692aa211f"
  }, {
    "url": "safari-pinned-tab.svg",
    "revision": "358b87ce969b6916891cb53ce97e6994"
  }, {
    "url": "src/js/main.js",
    "revision": "b6c82d8a25aa199511d0ff1157938c9e"
  }, {
    "url": "webpack.config.js",
    "revision": "24ed65a9b98c762ee9d3ab99f9d2a955"
  }], {});
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html")));
  workbox.registerRoute("/*", new workbox.StaleWhileRevalidate({
    "cacheName": "my-api-cache",
    "fetchOptions": {
      "mode": "no-cors"
    },
    "matchOptions": {
      "ignoreSearch": true
    },
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 5,
      maxAgeSeconds: 60
    }), new workbox.BackgroundSyncPlugin("my-queue-name", {
      maxRetentionTime: 3600
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200],
      headers: {
        'x-test': 'true'
      }
    }), new workbox.BroadcastUpdatePlugin({
      channelName: 'my-update-channel',
      notifyAllClients: true
    })]
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map

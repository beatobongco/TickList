/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["css/fonts.css","a04c0974d2805dc63fc2645690d785f6"],["css/libs/animate.css/3.5.2/animate.min.css","d14d93614583b5e1211adba58181854c"],["css/libs/gridforms/1.0.10/gridforms.min.css","1a3a70920dcb62ffe09dc1fcb2871177"],["css/style.css","66aad94a7adecc779b72d2d26569dd2e"],["fonts/fira-sans-v6-latin-300.eot","5245f84f11100164a81ca655b1cee4d6"],["fonts/fira-sans-v6-latin-300.svg","f30fefb6138d20ffd2c01c871577f73c"],["fonts/fira-sans-v6-latin-300.ttf","1913cd3cb11735f7111cc3f7a36a846c"],["fonts/fira-sans-v6-latin-300.woff","ea5caa89b93371a2f1d2f332deecc59f"],["fonts/fira-sans-v6-latin-300.woff2","aff5185d5a70e57d2a2330f4632f1daf"],["fonts/fira-sans-v6-latin-700.eot","5ad231f5eda29eba0d3186829f4fc520"],["fonts/fira-sans-v6-latin-700.svg","5ee1dc7462befc25bf1625fea6471d34"],["fonts/fira-sans-v6-latin-700.ttf","80332b135b512d6dc210839315041c26"],["fonts/fira-sans-v6-latin-700.woff","8baf5f39d4a9b629f15ca70366d9757a"],["fonts/fira-sans-v6-latin-700.woff2","7b796fa13b1d4231596c2cdb1fefb967"],["fonts/fira-sans-v6-latin-regular.eot","545ba376bb3c632034003fb705537735"],["fonts/fira-sans-v6-latin-regular.svg","e5d7a86ccda8696403109a421657bd81"],["fonts/fira-sans-v6-latin-regular.ttf","9fbd39324ef6389d51f6a25191156f86"],["fonts/fira-sans-v6-latin-regular.woff","b09d00db7ab3eea78c406cd2ce4829ac"],["fonts/fira-sans-v6-latin-regular.woff2","a3bed454d9ab0cfe7db4a1f338efb33c"],["img/icon.png","381bce32ceb125ef160a6019cec4ccd8"],["img/og_image.png","eb137f59afd19089818ec0dd96670295"],["index.html","9f24c0072b19ac632e4cd0f026f08201"],["js/libs/Chart.js/2.1.6/Chart.min.js","60c8a9882a2f6d3870d87f3103d34f94"],["js/libs/fastclick/1.0.6/fastclick.min.js","38508db581042f18f78bc2dbd8f9eeca"],["js/libs/firebasejs/3.2.1/firebase.js","72c1311ff21c0917f31ba4188a9b6660"],["js/libs/jquery/3.1.0/jquery.min.js","05e51b1db558320f1939f9789ccf5c8f"],["js/libs/lodash.js/4.14.0/lodash.min.js","5a69ab843d47de63eca7d088a13848e1"],["js/libs/taffydb/2.7.2/taffy-min.js","3c430555bd64a32922b8dc8b177ccb2f"],["js/libs/vue/1.0.26/vue.min.js","b5ea3ce7bd76bc65aae754beca4bbe79"],["js/main.js","fec7cee5e54cfd0b3c449fca2066e322"],["js/service-worker-registration.js","c1ee5aec388e1ed07d6d290693b72547"],["less/style.less","5118f34ba13e11573a05e504412d97fd"]];
var cacheName = 'sw-precache-v2-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.toString().match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              return cache.add(new Request(cacheKey, {credentials: 'same-origin'}));
            }
          })
        );
      });
    }).then(function() {
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      return self.clients.claim();
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameter and see if we have that URL
    // in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url));
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});








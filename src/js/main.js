'use strict';

let form = document.getElementById('form');
let searchForm = document.getElementById('search_form');
let jsform = document.getElementById('js_form');
let rollable = document.getElementById('rollable');
let mobileMenu = document.getElementById('listmenu');
let threeBars = document.getElementById('threebars');
let threeBars_close = document.getElementById('threebars_close');
let archiveGrid = document.getElementById('archive');
let urls = ['index.html','posts/29_08_2019.html','posts/20_04_2019.html','posts/binaryfind.html'];
let searchTerm = '';
let cards = [];
let filtered = [];

document.addEventListener('DOMContentLoaded', loadValid);

if ('serviceWorker' in navigator)  {
    navigator.serviceWorker.register('../sw.js')
      .then((reg) => {
        console.log('Service worker registration succeeded.', reg);
      })
      .catch((error) => {
        console.log('Registration failed with ' + error);
      });
}

// checking avalible parameters of the page
function loadValid() {
  threeBars.addEventListener('click',toggle);
  threeBars_close.addEventListener('click',toggle);
  //FORM FROM CONTACTS
  if (form !== null) {
    let nameInpt = form.querySelector('#name');
    let emailInpt = form.querySelector('#email');
    let themeInpt = form.querySelector('#theme');
    let messageText = form.querySelector('#textmessage');
    let submitBtn = form.querySelector('#submit');
  
    nameInpt.addEventListener('input', ()=>{
      submitBtn.disabled = !isValid(nameInpt);
    });
    
    emailInpt.addEventListener('input', ()=>{
      submitBtn.disabled = !isValid(emailInpt);
    });
    
    themeInpt.addEventListener('input', ()=>{
      submitBtn.disabled = !isValid(themeInpt);
    });
    
    messageText.addEventListener('input', ()=>{
      submitBtn.disabled = !isValid(messageText);
    });
  
    form.addEventListener('submit', submitFormHandler);
  };
  //SEARCH FORM FROM ARCHIVE
  if (searchForm !== null) {
    let searchInpt = searchForm.querySelector('#search');
    let submitSearchBtn = searchForm.querySelector('#submit_search');
    let i = 0;
  
    searchInpt.addEventListener('input', ()=>{
      submitSearchBtn.disabled = !searchInpt;
    });

    searchForm.addEventListener('submit', submitFormHandlerArchive);

    saveData(urls)
    .then(response => {
      response.forEach(doc => {
        cards.push({
          href:urls[i],
          headerValue:doc.querySelector('h1').innerHTML,
          date:doc.querySelector('time').innerHTML,
          theme:doc.querySelector('p').innerHTML,
        });
        i++;
      });
      buildArchive(cards);
    });
  };
  //BINARY FIND FORM
  if (jsform !== null) {
    let jstext = document.querySelector('#js_text_result');
    let jsvalue = jsform.querySelector('#js_value');
    let jsbutton = jsform.querySelector('#js_text_button');
    let jsinput = '';
    jsform.addEventListener('submit', FormPrevent);
    jsbutton.addEventListener('click', jsArrRandomize)
    jsvalue.addEventListener('input', event => {
      jsinput = event.target.value;
      jstext.innerHTML = '';
      let reg_test = /^-?\d*\.{0,1}\d+$/;
      //add binary search result to js_text_result after the form
      if (reg_test.test(jsinput) && (+jsinput !== null) && (+jsinput !== undefined)) {
        jstext.insertAdjacentText("beforeend", 'Ближайшее число равно:  ' + closestNum(Math.round(+jsinput)));
      } else {
        jstext.insertAdjacentText("beforeend", 'Вы ввели не число или пустую строку');
      }
    });
  }
  //CHECK ABOUT ROLLABLE CONTENT
  if (rollable !== null) {
    ContentRoll();
  }
}

function FormPrevent (event) {
  event.preventDefault();
}

function isValid(param) {
  if (param.value.length && (param.tagName === 'TEXTAREA')) {
    return (param.value.length >=20) && (param.value.length <= 500);
  } else if (param.value.length){
    return (param.value.length >= 3) && (param.value.length <= 20);
  }
}

function toggle() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    document.body.classList.toggle('overflow_hidden');
    mobileMenu.classList.toggle('display_block');
  } else {
    document.body.className = '';
    mobileMenu.className = '';
  }
}

function htmlToCard(href,headerValue,date,theme) {
  return `<section>
            <div class="archive_header">
              <h1><a href="${href}">${headerValue}</a></h1>
            </div>
            <div class="archive_archlabel">
              <time>${date}</time>
              <p>${theme}</p>
            </div>
          </section>`;
}

function saveData(urls) {
  return Promise.all(urls.map(url=> {
    return promiseXHR('GET', `..\/${url}`)}));
}


function buildArchive(cards) {

  if (searchTerm !== '') {
    filtered = cards.filter(item => {
      return item.headerValue.toLowerCase().includes(searchTerm.toLocaleLowerCase());
    });
  } else {
    filtered = cards;
  }

  searchForm.querySelector('#submit_search').disabled = true;

  archiveGrid.innerHTML = '';
  filtered.forEach(item => {
    archiveGrid.insertAdjacentHTML("beforeend",htmlToCard(item.href,item.headerValue,item.date,item.theme));

    searchForm.querySelector('#submit_search').disabled = false;
  });
}

function promiseXHR(method, url, body) {
  return new Promise ((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    if (method === "" || method === null || url === "" || url === null || body === "" || body === null) {
      reject(new Error('Request not filled'));
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Request failed: ${xhr.status} ${xhr.statusText}`));
        }
      }
    }
    xhr.open(method, url);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.responseType = 'json';
    } else  if (method === 'GET') {
      xhr.responseType = 'document';
    } else {
      xhr.responseType = ""
    }
    xhr.onerror = function () {
      reject(new Error(`Request failed: ${xhr.status} ${xhr.statusText}`));
    }
    xhr.send(body);
  })
}

function submitFormHandler(event) {
  event.preventDefault();
  
  if (isValid(nameInpt) && isValid(emailInpt) && isValid(themeInpt) && isValid(messageText)) {
    let question = {
      name: nameInpt.value.trim(),
      email: emailInpt.value.trim(),
      theme: themeInpt.value.trim(),
      text: messageText.value.trim(),
      date: new Date().toISOString()
    }
    submitBtn.disabled = true;

    promiseXHR('POST','mail.php', JSON.stringify(question))
    .then(response => {

      console.log('response from server', response);

      if (response) {
        alert('Ваше письмо отправленно, ' + nameInpt.value.trim()+ '.');
      } else {
        alert('Ошибка, ваше письмо не отправленно, ' + nameInpt.value.trim() + '.');
      }
    })
    .then(() => {
      nameInpt.value = '';
      emailInpt.value = '';
      themeInpt.value = '';
      messageText.value = '';
    })
  }
}

function submitFormHandlerArchive(event) {
  event.preventDefault();

  let searchInpt = searchForm.querySelector('#search');

  if (searchInpt.value.length>=1) {
    searchTerm = searchInpt.value.trim();
    buildArchive(cards);
  } else if (!!searchInpt) {
    searchTerm = '';
    buildArchive(cards);
  }
}

function closestNum(value) {
  let arr = document.querySelector('#js_text_arr').innerHTML.split(' ');
  let rightArr = arr.length - 1;
  let intermediate = 0;
  let leftArr = 0;
  let middle = Math.trunc((rightArr - leftArr)/2);
  if (rightArr === 0) return arr[0];
  while(intermediate === 0) {
    if ((+arr[middle] === +value)) {
      intermediate = +arr[middle];
      break;
    } 
    if (leftArr === rightArr)  {
      intermediate = arr[leftArr];
      break;
    }
    //check left and right border
    if ((+arr[middle] > +value)) {
      rightArr = middle-1;
    } else if (+arr[middle] < +value) {
      leftArr = middle+1;
    }
    middle = Math.trunc(leftArr + (rightArr - leftArr)/2);
  }
  return intermediate;
}

function jsArrRandomize() {
  let arr = [];
  let jsinput = document.querySelector('#js_value');
  let jstextresult = document.querySelector('#js_text_result');
  let jstextarr = document.querySelector('#js_text_arr');
  jstextresult.innerHTML = '';
  jstextarr.innerHTML = '';
  jsinput.value = '';
  for (let i = 0; i < Math.floor(Math.random()*30); i++) {
    arr[i] = Math.trunc(Math.random()*Math.random()*150);
  }
  arr.sort((a,b) => a - b);

  jstextarr.innerHTML = arr.join(' ');
}

function ContentRoll() {
  let headers = document.getElementsByTagName('h2');
  for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', Roll);
    headers[i].style.cursor = 'pointer';
    headers[i].click();
  }
}

function Roll(event) {
  console.log(event);
  if (event.target.nextElementSibling.id === 'insert') {
    event.target.nextElementSibling.remove();
  } else {
    event.target.insertAdjacentHTML('beforeend', rollPlainHTML(event.target.nextElementSibling.innerText.split('\n',1)[0]))
  }
  let elem = event.target.nextElementSibling;
  while (!!elem) {
    if (elem.matches(event.target.localName)) break;
    elem.classList.toggle('hidden');
    elem = elem.nextElementSibling;
  }
}

function rollPlainHTML(string) {
  return `<p id="insert">${string}...</p>`;
}

//fix for viewport on mobile devices
function calculateVh() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial calculation
calculateVh();

// Re-calculate on resize
window.addEventListener('resize', calculateVh);

// Re-calculate on device orientation change
window.addEventListener('orientationchange', calculateVh);
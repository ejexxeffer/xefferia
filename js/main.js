'use strict';

let form = document.getElementById('form');
let searchForm = document.getElementById('search_form');
let mobileMenu = document.getElementById('listmenu');
let threeBars = document.getElementById('threebars');
let threeBars_close = document.getElementById('threebars_close');
let archiveGrid = document.getElementById('archive');
let searсhForm = document.getElementById('search_form');
let urls = ['index.html','posts/29_08_2019.html','posts/20_04_2019.html'];
let searchTerm = '';
let cards = [];
let filtered = [];

document.addEventListener('DOMContentLoaded', loadValid);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', {scope: './'})
      .then((reg) => {
        console.log('Service worker registered.', reg);
      });
  });
}

function loadValid() {
  threeBars.addEventListener('click',toggle);
  threeBars_close.addEventListener('click',toggle);

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

  if (searсhForm !== null) {
    let searchInpt = searchForm.querySelector('#search');
    let submitSearchBtn = searсhForm.querySelector('#submit_search');
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
}

function isValid(param) {
  if (param.value.length && (param.tagName === 'TEXTAREA')) {
    return (param.value.length >=20) && (param.value.length <= 500);
  } else if (param.value.length){
    return (param.value.length >= 3) && (param.value.length <= 20);
  }
}

function toggle() {
  if (window.matchMedia("(max-width: 700px)").matches) {
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

  searсhForm.querySelector('#submit_search').disabled = true;

  archiveGrid.innerHTML = '';
  filtered.forEach(item => {
    archiveGrid.insertAdjacentHTML("beforeend",htmlToCard(item.href,item.headerValue,item.date,item.theme));

    searсhForm.querySelector('#submit_search').disabled = false;
  });
}

function promiseXHR(method, url, body) {
  return new Promise ((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 && method == 'GET') {
          resolve(xhr.response);
        }

        if (xhr.status == 404) {
          reject(xhr.statusText);
        } else if (xhr.status == 500) {
          reject(xhr.statusText);
        }
      }
    }
    xhr.open(method, url);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.responseType = 'json';
    } else  if (method === 'GET') {
      xhr.responseType = 'document';
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

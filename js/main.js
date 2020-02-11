"use strict";

let form = document.getElementById('form');
let searchForm = document.getElementById('search_form');
let mobileMenu = document.getElementById('listmenu');
let threeBars = document.getElementById('threebars');
let threeBars_close = document.getElementById('threebars_close');
let archiveGrid = document.getElementById('archive');
let searhForm = document.getElementById('search_form');
let urls = ['posts/20_04_2019.html','index.html'];
let searchTerm = '';
let cards = [];
let named = promiseXHR('GET', '..\/index.html').then((response, reject) => console.log(response,reject));

document.addEventListener('DOMContentLoaded', loadValid);

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
  
  if (searhForm !== null) {
    let searchInpt = searchForm.querySelector('#search');
    let submitSearchBtn = searhForm.querySelector('#submit_search');
    cards = saveData(urls,new Array());
    buildArchive(cards);

    searchInpt.addEventListener('inpt', ()=>{
      submitSearchBtn.disabled = !isValid(searchInpt);
    });

    searchForm.addEventListener('submit', submitFormHandler);
  };

}

function isValid(param) {
  if (param.value.length && (param.tagName === 'TEXTAREA')) {
    return (param.value.length >=20) && (param.value.length <=500);
  } else if (param.value.length){
    return (param.value.length >= 3) && (param.value.length <= 20);
  }
}

//overflow здесь <div style="overflow">
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

function saveData(urls, array) {
  //запрос файла с сервера
  let index = 0;
  urls.forEach(url => {
    promiseXHR('GET', `..\/${url}`)
    .then(response => {
    array[index] = {
      href:url,
      headerValue:response.querySelector('h1').innerHTML,
      date:response.querySelector('time').innerHTML,
      theme:response.querySelector('p').innerHTML,
    }
    index++;
    });
  });
  return array;
}

function buildArchive(cards) {
  let filtered;
  if (!!searchForm.querySelector('#search').value) {
    filtered = cards.filter((item) => {
      item.headerValue.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    });
  } else {
    filtered = cards;
  }
  
  archiveGrid.innerHTML = '';
  filtered.forEach(item => {
    archiveGrid.insertAdjacentHTML("beforeend",htmlToCard(item.href,item.headerValue,item.date,item.theme));
  });
  // let filesJSON = saveData(urls, object);
  //тут должна быть реализация разбора json в объекты и создание карточек пока есть объекты
  //создание карточки  
  
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
    if (method == 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.responseType = 'json';
    } else {
      xhr.responseType = 'document';
    }
    xhr.send(body);
  })
}

function submitFormHandler(event) {
  event.preventDefault();
  
  if (isValid(nameInpt.value) && isValid(emailInpt.value) && isValid(themeInpt.value) && isValid(messageText.value)) {
    let question = {
      name: nameInpt.value.trim(),
      email: emailInpt.value.trim(),
      theme: themeInpt.value.trim(),
      text: messageText.value.trim(),
      date: new Date().toISOString()
    }
    submitBtn.disabled = true;
    //Async question to server to send mail
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
  } else if (isValid(searchInpt.value)) {
    searchTerm = searchInpt.value;
    buildArchive();
  }
}

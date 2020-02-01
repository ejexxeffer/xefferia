"use strict";

let mobileMenu = document.getElementById('listmenu');
let threeBars = document.getElementById('threebars');
let threeBars_close = document.getElementById('threebars_close');

function isValid(value) {
  if (value) {
    return (value.length >= 3) && (value.length <= 20);
  }
}

function isQuestion(value) {
  if (value) {
    return (value.length >=20) && (value.length <=500);
  }
}

//overflow здесь <div style="overflow">
function toggle() {
  document.body.classList.toggle('overflow_hidden');
  mobileMenu.classList.toggle('display_block');
}

if (window.matchMedia("(max-width: 700px)").matches) {
  threeBars.addEventListener('click',toggle);
  threeBars_close.addEventListener('click',toggle);
} else {
  document.body.className = '';
  mobileMenu.className = '';
}

let form = document.getElementById('form');
let nameInpt = form.querySelector('#name');
let emailInpt = form.querySelector('#email');
let themeInpt = form.querySelector('#theme');
let messageText = form.querySelector('#textmessage');
let submitBtn = form.querySelector('#submit');


nameInpt.addEventListener('input', ()=>{
  submitBtn.disabled = !isValid(nameInpt.value);
});

emailInpt.addEventListener('input', ()=>{
  submitBtn.disabled = !isValid(emailInpt.value);
});

themeInpt.addEventListener('input', ()=>{
  submitBtn.disabled = !isValid(themeInpt.value);
});

messageText.addEventListener('input', ()=>{
  submitBtn.disabled = !isValid(messageText.value);
});

form.addEventListener('submit', submitFormHandler);

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
    fetch('mail.php', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
          'Content-type': 'application/json'}})
    .then(response => response.json())
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

function addToLocalStorage(question) {
  const questions = getQuestiondFromLocalStorage();
  questions.push(question);
  localStorage.setItem('questions', JSON.stringify(questions));
}


function getQuestiondFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions')||'[]');
}
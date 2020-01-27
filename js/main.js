"use strict";

let mobileMenu = document.getElementById('listmenu');
let threeBars = document.getElementById('threebars');
let threeBars_close = document.getElementById('threebars_close');

function isValid(value) {
  return value.length >= 3;
}

function isQuestion(value) {
  return value.length >=20;
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
    //Async question to server to save question
    fetch('https://ajax-test-app-ejex.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
          'Content-type': 'application/json'}})
    .then(response => response.json())
    .then(response => {
      console.log('response from server', response);
      question.id = response.name;
      return question;
    })
    .then(addToLocalStorage)
    .then(() => {
      console.log('Question collection', question);
      nameInpt.value = '';
      emailInpt.value = '';
      themeInpt.value = '';
      messageText.value = '';
      // questionInpt.className = '';
      // submitBtn.disabled = false;
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
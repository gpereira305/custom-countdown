const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Seta a data no input  de acordo com o data atual
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Preenche o countdown
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    // Esconde o Input
    inputContainer.hidden = true;

    // Se o caoundown terminou mostra o estado atual
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} Concluído em ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Caso contrário mostra countdown em progresso
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}



function updateCountdown(e) {
  e.preventDefault();
  // Seta o título e data no localStorage
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  // Checa se alguma data foi informada
  if (countdownDate === '') {
    alert('Por favor, selecione uma data para a contagem');
  } else {

    //Coleta a versão do número da data atual e atualiza o DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

function reset() {
  //Esconde os countdowns e mostra o input form
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  //Pára o countdown
  clearInterval(countdownActive);
  //Reseta os valores e remove o  item do localStorage
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  //Coleta o countdown do  localStorage se disponível
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// Ao carregar checa lse tem histórico no ocalStorage
restorePreviousCountdown();
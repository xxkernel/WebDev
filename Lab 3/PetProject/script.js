'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalactiveHabbitId;
//page

const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  content: {
    daysContainer: document.getElementById('days'),
    nextDay: document.querySelector('.habbit__day'),
  },
  popup: {
    index: document.getElementById('add-habbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
  },
};

// utils

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
  if (page.popup.index.classList.contains('cover_hidden')) {
    page.popup.index.classList.remove('cover_hidden');
  } else {
    page.popup.index.classList.add('cover_hidden');
  }
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = '';
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove('error');
    if (!fieldValue) {
      form[field].classList.add('error');
    }
    res[field] = fieldValue.trim();
  }
  let isValid = true;
  for (const field of fields) {
    console.log(res[field]);
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}
// render

function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('menu__item');
      element.addEventListener('click', () => rerender(habbit.id));
      element.addEventListener('dblclick', () => norerender(habbit.id));
      element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}">`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add('menu__item_active');
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__item_active');
    } else {
      existed.classList.remove('menu__item_active');
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
  if (activeHabbit.days.length == activeHabbit.target) {
    activeHabbit.isFinished = true;
  } else {
    activeHabbit.isFinished = false;
  }
  const btn = document.querySelector('.button');
  const input = document.querySelector('.input_icon');
  const day = document.querySelector('.habbit__day');
  if (activeHabbit.isFinished) {
    btn.disabled = true;
    btn.innerText = '';
    input.placeholder = 'All DONE!';
    day.innerText = 'День 0';
  } else {
    btn.disabled = false;
    btn.innerText = 'Готово';
    input.placeholder = 'Комментария';
    day.innerText = `День ${activeHabbit.days.length}`;
  }
}

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = '';
  for (const index in activeHabbit.days) {
    const element = document.createElement('div');
    element.classList.add('habbit');
    element.innerHTML = `<div class="habbit__day">День ${+index + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button class="habbit__delete" onclick="deleteDay(${index})">
            <img src="images/delete.svg" alt="delete_${+index + 1}">
        </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  globalactiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  rerenderContent(activeHabbit);
  rerenderHead(activeHabbit);
}
function removeButtonByHabbitId(habbitId) {
  const button = document.querySelector(`button[menu-habbit-id="${habbitId}"]`);
  if (button) {
    button.parentNode.removeChild(button);
  }
}

function norerender(activeHabbitId) {
  habbits = habbits.filter((habbit) => {
    if (habbit.id !== activeHabbitId) {
      return habbit;
    }
    location.reload(true);
  });
  removeButtonByHabbitId(activeHabbitId);
  if (habbits.length === 0) {
    page.content.daysContainer.innerHTML = '';
    document.querySelector(
      '.habbit'
    ).innerHTML = `<div class="habbit__day">День _</div>
        <form class="habbit__form" onsubmit="addDays(event)">
            <input type="text" name="comment" class="input_icon" placeholder="Комментарий">
            <img class="input__icon" src="images/comment.svg" alt="comment">
            <button class="button" type="submit">Готово</button>
        </form>`;
    document.querySelector('header').innerHTML = `<h1 class="h1">Welcome!</h1>
        <div class="progress">
            <div class="progress__text">
                <div class="progress__name">Прогресс</div>
                <div class="progress__percent">%</div>
            </div>
            <div class="progress__bar">
                <div class="progress__cover-bar"></div>
            </div>
        </div>`;
    saveData();
    return;
  } else {
    rerender(habbits[0].id);
  }
  saveData();
}
// work with days

function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalactiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ['comment']);
  rerender(globalactiveHabbitId);
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalactiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalactiveHabbitId);
  saveData();
}

//working with habbits

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.icon.icon_active');
  activeIcon.classList.remove('icon_active');
  context.classList.add('icon_active');
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
    isFinished: false,
  });
  resetForm(event.target, ['name', 'target']);
  togglePopup();
  saveData();
  rerender(maxId + 1);
}

// init

(() => {
  loadData();
  rerender(habbits[0].id);
})();

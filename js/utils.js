// Функції для роботи з LocalStorage
function getFromLocalStorage(key, defaultValue = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Функція для генерації унікального ID
function generateUniqueId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Функція для відображення/приховання модального вікна
function toggleModal(modalId, show = true) {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.style.display = show ? 'flex' : 'none';
  }
}

// Функція для валідації полів форми
function validateForm(fields) {
  for (const fieldId of fields) {
      const input = document.getElementById(fieldId);
      if (input && input.value.trim() === '') {
          input.classList.add('invalid'); // Додаємо клас для стилізації невалідних полів
          alert('Будь ласка, заповніть всі обов\'язкові поля.');
          return false;
      } else if (input) {
          input.classList.remove('invalid'); // Видаляємо клас, якщо поле валідне
      }
  }
  return true;
}

// Функція для заповнення випадаючих списків
function populateSelect(selectId, optionsArray) {
  const selectElement = document.getElementById(selectId);
  if (selectElement) {
      selectElement.innerHTML = ''; // Очищаємо існуючі опції
      // Додаємо опцію за замовчуванням, якщо це не модальне вікно для додавання/редагування послуг
      if (!selectElement.closest('.modal')) {
           const defaultOption = document.createElement('option');
           defaultOption.value = '';
           defaultOption.textContent = selectElement.dataset.defaultText || 'Виберіть...';
           selectElement.appendChild(defaultOption);
      }


      optionsArray.forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option;
          selectElement.appendChild(opt);
      });
  }
}

// Перевірка авторизації користувача
function getCurrentUser() {
  return getFromLocalStorage('currentUser', null);
}

// Встановлення поточного користувача
function setCurrentUser(user) {
  saveToLocalStorage('currentUser', user);
}
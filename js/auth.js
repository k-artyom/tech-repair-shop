document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Обробка форми входу
  if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const phone = document.getElementById('loginPhone').value.trim();
          const password = document.getElementById('loginPassword').value.trim();

          if (!validateForm(['loginPhone', 'loginPassword'])) {
              return;
          }

          const users = getFromLocalStorage('users');
          const user = users.find(u => u.phone === phone && u.password === password);

          if (user) {
              setCurrentUser(user);
              alert('Ви успішно увійшли!');
              window.location.href = 'index.html'; // Перенаправлення на головну сторінку
          } else {
              alert('Невірний номер телефону або пароль.');
          }
      });
  }

  // Обробка форми реєстрації
  if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
          event.preventDefault();

          const name = document.getElementById('registerName').value.trim();
          const phone = document.getElementById('registerPhone').value.trim();
          const password = document.getElementById('registerPassword').value.trim();

          const fieldsToValidate = ['registerName', 'registerPhone', 'registerPassword'];
          if (!validateForm(fieldsToValidate)) {
              return;
          }

          if (password.length < 6) {
              alert('Пароль повинен містити мінімум 6 символів.');
              document.getElementById('registerPassword').classList.add('invalid');
              return;
          } else {
               document.getElementById('registerPassword').classList.remove('invalid');
          }


          const users = getFromLocalStorage('users');

          // Перевірка на вже існуючий номер телефону
          if (users.some(u => u.phone === phone)) {
              alert('Користувач з таким номером телефону вже існує. Будь ласка, увійдіть або використовуйте інший номер.');
              return;
          }

          const newUser = {
              id: generateUniqueId(),
              name: name,
              phone: phone,
              password: password
          };

          users.push(newUser);
          saveToLocalStorage('users', users);

          alert('Реєстрація успішна! Тепер ви можете увійти.');
          window.location.href = 'auth.html'; // Перенаправлення на сторінку входу
      });
  }
});
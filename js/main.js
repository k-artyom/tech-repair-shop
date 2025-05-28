document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізація даних в LocalStorage
  const services = getFromLocalStorage('services', initialServices);
  if (services.length === 0) {
      saveToLocalStorage('services', initialServices);
  }

  const users = getFromLocalStorage('users'); // Завантажуємо користувачів
  const orders = getFromLocalStorage('orders'); // Завантажуємо замовлення

  // Заповнення випадаючих списків фільтрів
  populateSelect('filterDeviceType', deviceTypes);
  populateSelect('filterBrand', brands);
  populateSelect('filterProblem', problemTypes);

  // Заповнення випадаючих списків для персонального замовлення
  populateSelect('personalDeviceType', deviceTypes);
  populateSelect('personalBrand', brands);

  const currentUser = getCurrentUser();

  // Оновлення кнопок в хедері залежно від авторизації
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const myOrdersBtn = document.getElementById('myOrdersBtn');
  const orderPersonalServiceBtn = document.getElementById('orderPersonalServiceBtn');

  function updateHeaderButtons() {
      if (currentUser) {
          loginBtn.style.display = 'none';
          logoutBtn.style.display = 'inline-block';
          myOrdersBtn.style.display = 'inline-block';
      } else {
          loginBtn.style.display = 'inline-block';
          logoutBtn.style.display = 'none';
          myOrdersBtn.style.display = 'inline-block'; // Залишаємо кнопку, але вона перенаправлятиме на авторизацію
      }
  }
  updateHeaderButtons();

  // Обробники подій для кнопок хедера
  loginBtn.addEventListener('click', () => {
      window.location.href = 'auth.html';
  });

  logoutBtn.addEventListener('click', () => {
      setCurrentUser(null);
      updateHeaderButtons();
      alert('Ви успішно вийшли з акаунта.');
      window.location.reload(); // Оновлюємо сторінку, щоб оновити стан
  });

  myOrdersBtn.addEventListener('click', () => {
      if (currentUser) {
          renderMyOrdersModal();
          toggleModal('myOrdersModal', true);
      } else {
          alert('Будь ласка, увійдіть або зареєструйтесь, щоб переглянути ваші замовлення.');
          window.location.href = 'auth.html';
      }
  });

  orderPersonalServiceBtn.addEventListener('click', () => {
      if (currentUser) {
          // Заповнюємо поля ім'я та телефон поточного користувача
          document.getElementById('personalName').value = currentUser.name;
          document.getElementById('personalPhone').value = currentUser.phone;
          toggleModal('personalOrderModal', true);
      } else {
          alert('Будь ласка, увійдіть або зареєструйтесь, щоб замовити послугу.');
          window.location.href = 'auth.html';
      }
  });

  // Обробники подій для кнопок футера
  document.getElementById('footerMyOrdersBtn').addEventListener('click', () => {
      myOrdersBtn.click(); // Викликаємо той самий обробник
  });

  document.getElementById('adminLoginBtn').addEventListener('click', () => {
      const password = prompt('Введіть пароль адміністратора:');
      if (password === 'admin123') {
          window.location.href = 'admin.html';
      } else {
          alert('Невірний пароль адміністратора!');
      }
  });

  // Функція рендерингу карток послуг
  function renderServices(servicesToRender) {
      const gallery = document.getElementById('serviceGallery');
      gallery.innerHTML = ''; // Очищаємо галерею перед рендерингом

      if (servicesToRender.length === 0) {
          gallery.innerHTML = '<p class="no-results">Послуг за вашим запитом не знайдено.</p>';
          return;
      }

      servicesToRender.forEach(service => {
          const serviceCard = document.createElement('div');
          serviceCard.classList.add('service-card');
          serviceCard.innerHTML = `
              <img src="${service.imageUrl}" alt="${service.deviceType} ${service.brand}">
              <div class="service-card-content">
                  <h3>Ремонт ${service.deviceType} ${service.brand}</h3>
                  <p><strong>Тип пристрою:</strong> ${service.deviceType}</p>
                  <p><strong>Бренд:</strong> ${service.brand}</p>
                  <p><strong>Проблема:</strong> ${service.problemType}</p>
                  <p>Термін ремонту: ${service.repairTerm} днів</p>
                  <p class="price">${service.price} UAH</p>
                  <button class="btn primary-btn order-service-btn" data-service-id="${service.id}">Замовити</button>
              </div>
          `;
          gallery.appendChild(serviceCard);
      });

      // Додаємо обробники подій для кнопок "Замовити" на картках
      document.querySelectorAll('.order-service-btn').forEach(button => {
          button.addEventListener('click', (event) => {
              const serviceId = event.target.dataset.serviceId;
              const selectedService = services.find(s => s.id === serviceId);

              if (currentUser && selectedService) {
                  document.getElementById('serviceOrderName').value = currentUser.name;
                  document.getElementById('serviceOrderPhone').value = currentUser.phone;
                  document.getElementById('serviceOrderDeviceType').value = selectedService.deviceType;
                  document.getElementById('serviceOrderBrand').value = selectedService.brand;
                  document.getElementById('serviceOrderProblem').value = selectedService.problemType;
                  document.getElementById('serviceOrderPrice').value = selectedService.price + ' UAH';
                  document.getElementById('serviceOrderRepairTerm').value = selectedService.repairTerm;
                  document.getElementById('serviceOrderImageUrl').value = '';

                  // Зберігаємо ID послуги в формі для подальшого використання при відправці
                  document.getElementById('serviceOrderForm').dataset.serviceId = serviceId;

                  toggleModal('serviceOrderModal', true);
              } else if (!currentUser) {
                  alert('Будь ласка, увійдіть або зареєструйтесь, щоб замовити послугу.');
                  window.location.href = 'auth.html';
              }
          });
      });
  }

  // Функція застосування фільтрів та сортування
  function applyFiltersAndSort() {
      let filteredServices = getFromLocalStorage('services', initialServices);

      const keyword = document.getElementById('searchKeyword').value.toLowerCase();
      const deviceTypeFilter = document.getElementById('filterDeviceType').value;
      const brandFilter = document.getElementById('filterBrand').value;
      const problemFilter = document.getElementById('filterProblem').value;
      const sortOrder = document.getElementById('sortOrder').value;

      if (keyword) {
          filteredServices = filteredServices.filter(service =>
              service.deviceType.toLowerCase().includes(keyword) ||
              service.brand.toLowerCase().includes(keyword) ||
              service.problemType.toLowerCase().includes(keyword)
          );
      }

      if (deviceTypeFilter) {
          filteredServices = filteredServices.filter(service => service.deviceType === deviceTypeFilter);
      }

      if (brandFilter) {
          filteredServices = filteredServices.filter(service => service.brand === brandFilter);
      }

      if (problemFilter) {
          filteredServices = filteredServices.filter(service => service.problemType === problemFilter);
      }

      if (sortOrder === 'cheaper') {
          filteredServices.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'dearer') {
          filteredServices.sort((a, b) => b.price - a.price);
      }

      renderServices(filteredServices);
  }

  // Початкове завантаження послуг
  applyFiltersAndSort();

  // Обробник події для кнопки "Шукати"
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFiltersAndSort);

  // Модальні вікна - обробники закриття
  document.querySelectorAll('.modal .close-button').forEach(button => {
      button.addEventListener('click', (event) => {
          toggleModal(event.target.closest('.modal').id, false);
      });
  });

  window.addEventListener('click', (event) => {
      document.querySelectorAll('.modal').forEach(modal => {
          if (event.target === modal) {
              toggleModal(modal.id, false);
          }
      });
  });

  // Обробка форми персонального замовлення
  document.getElementById('personalOrderForm').addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('personalName').value.trim();
      const phone = document.getElementById('personalPhone').value.trim();
      const deviceType = document.getElementById('personalDeviceType').value;
      const brand = document.getElementById('personalBrand').value;
      const problem = document.getElementById('personalProblem').value.trim();
      const imageUrl = document.getElementById('personalImageUrl').value.trim();

      const fieldsToValidate = ['personalName', 'personalPhone', 'personalDeviceType', 'personalBrand', 'personalProblem'];
      if (!validateForm(fieldsToValidate)) {
          return;
      }

      const newOrder = {
          id: generateUniqueId(),
          userId: currentUser.id,
          userName: name,
          userPhone: phone,
          deviceType: deviceType,
          brand: brand,
          problem: problem,
          imageUrl: imageUrl || 'https://via.placeholder.com/150/CCCCCC/000000?text=Немає+фото', // Дефолтне зображення
          orderTime: new Date().toLocaleString('uk-UA'),
          status: 'Принято в обробку',
          price: 'За домовленістю',
          repairTerm: 0,
      };

      const currentOrders = getFromLocalStorage('orders');
      currentOrders.push(newOrder);
      saveToLocalStorage('orders', currentOrders);

      alert('Ваше персональне замовлення успішно створено!');
      toggleModal('personalOrderModal', false);
      document.getElementById('personalOrderForm').reset();
  });

  // Обробка форми замовлення послуги з картки
  document.getElementById('serviceOrderForm').addEventListener('submit', (event) => {
      event.preventDefault();

      const serviceId = event.target.dataset.serviceId;
      const selectedService = services.find(s => s.id === serviceId);

      if (!selectedService) {
          alert('Помилка: послугу не знайдено.');
          return;
      }

      const name = document.getElementById('serviceOrderName').value.trim();
      const phone = document.getElementById('serviceOrderPhone').value.trim();
      const imageUrl = document.getElementById('serviceOrderImageUrl').value.trim();

      // Валідація не потрібна для полів, які readonly, але залишаємо для imageUrl
      if (!imageUrl) {
          // Можна додати більш специфічну валідацію, якщо потрібно
      }

      const newOrder = {
          id: generateUniqueId(),
          userId: currentUser.id,
          userName: name,
          userPhone: phone,
          deviceType: selectedService.deviceType,
          brand: selectedService.brand,
          problem: selectedService.problemType,
          imageUrl: imageUrl || selectedService.imageUrl,
          orderTime: new Date().toLocaleString('uk-UA'),
          status: 'Принято в обробку',
          price: selectedService.price,
          repairTerm: selectedService.repairTerm,
      };

      const currentOrders = getFromLocalStorage('orders');
      currentOrders.push(newOrder);
      saveToLocalStorage('orders', currentOrders);

      alert('Ваше замовлення успішно підтверджено!');
      toggleModal('serviceOrderModal', false);
      document.getElementById('serviceOrderForm').reset();
  });

  // Функція рендерингу модального вікна "Мої замовлення"
  function renderMyOrdersModal() {
      const userOrdersList = document.getElementById('userOrdersList');
      userOrdersList.innerHTML = '';

      if (!currentUser) {
          userOrdersList.innerHTML = '<p>Будь ласка, увійдіть, щоб переглянути ваші замовлення.</p>';
          return;
      }

      const allOrders = getFromLocalStorage('orders');
      const userSpecificOrders = allOrders.filter(order => order.userId === currentUser.id);

      if (userSpecificOrders.length === 0) {
          userOrdersList.innerHTML = '<p>У вас ще немає замовлень.</p>';
          return;
      }

      userSpecificOrders.forEach(order => {
          const orderCard = document.createElement('div');
          orderCard.classList.add('user-order-card');
          orderCard.innerHTML = `
              <img src="${order.imageUrl}" alt="${order.deviceType} ${order.brand}">
              <div class="user-order-details">
                  <p><strong>Тип пристрою:</strong> ${order.deviceType}</p>
                  <p><strong>Бренд:</strong> ${order.brand}</p>
                  <p><strong>Проблема:</strong> ${order.problem}</p>
                  <p><strong>Час замовлення:</strong> ${order.orderTime}</p>
                  <p><strong>Статус:</strong> <span class="status">${order.status}</span></p>
                  <p><strong>Ціна:</strong> ${order.price} UAH</p>
                  <p><strong>Термін ремонту:</strong> ${order.repairTerm} днів</p> 
                  <p><strong>Час замовлення:</strong> <span class="math-inline">${order.orderTime}</span></p>
              </div>
          `;
          userOrdersList.appendChild(orderCard);
      });
  }

});
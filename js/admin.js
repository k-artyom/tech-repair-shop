document.addEventListener('DOMContentLoaded', () => {
  const servicesBtn = document.getElementById('servicesBtn');
  const ordersBtn = document.getElementById('ordersBtn');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const servicesSection = document.getElementById('servicesSection');
  const ordersSection = document.getElementById('ordersSection');
  const addNewServiceBtn = document.getElementById('addNewServiceBtn');
  const serviceModal = document.getElementById('serviceModal');
  const serviceForm = document.getElementById('serviceForm');
  const serviceModalTitle = document.getElementById('serviceModalTitle');

  let currentServiceId = null; // Для збереження ID послуги при редагуванні

  // Заповнення випадаючих списків для модального вікна послуг
  populateSelect('serviceDeviceType', deviceTypes);
  populateSelect('serviceBrand', brands);
  populateSelect('serviceProblem', problemTypes);

  // Функція для перемикання розділів адмін-панелі
  function switchAdminSection(sectionId) {
      document.querySelectorAll('.admin-section').forEach(section => {
          section.style.display = 'none';
      });
      document.querySelectorAll('.sidebar nav button').forEach(button => {
          button.classList.remove('active');
      });

      document.getElementById(sectionId).style.display = 'block';
      if (sectionId === 'servicesSection') {
          servicesBtn.classList.add('active');
          renderServicesTable();
      } else if (sectionId === 'ordersSection') {
          ordersBtn.classList.add('active');
          renderOrdersTable();
      }
  }

  // Початкове відображення розділу "Послуги"
  switchAdminSection('servicesSection');

  // Обробники подій для кнопок бічної панелі
  servicesBtn.addEventListener('click', () => switchAdminSection('servicesSection'));
  ordersBtn.addEventListener('click', () => switchAdminSection('ordersSection'));
  // Обробник для нової кнопки "Повернутись на головну"
  backToHomeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
  });


  // Модальні вікна - обробники закриття
  document.querySelectorAll('.modal .close-button').forEach(button => {
      button.addEventListener('click', (event) => {
          toggleModal(event.target.closest('.modal').id, false);
          serviceForm.reset(); // Очищаємо форму при закритті
          currentServiceId = null; // Скидаємо ID
      });
  });

  window.addEventListener('click', (event) => {
      document.querySelectorAll('.modal').forEach(modal => {
          if (event.target === modal) {
              toggleModal(modal.id, false);
              serviceForm.reset();
              currentServiceId = null;
          }
      });
  });

  // Функція рендерингу таблиці послуг
  function renderServicesTable() {
      const services = getFromLocalStorage('services', initialServices);
      const servicesTableBody = document.querySelector('#servicesTable tbody');
      servicesTableBody.innerHTML = '';

      services.forEach(service => {
          const row = servicesTableBody.insertRow();
          row.innerHTML = `
              <td><img src="${service.imageUrl}" alt="${service.deviceType}"></td>
              <td>${service.deviceType}</td>
              <td>${service.brand}</td>
              <td>${service.problemType}</td>
              <td>${service.price} UAH</td>
              <td>${service.repairTerm} Днів</td>
              <td class="actions">
                  <button class="btn edit-service-btn" data-id="${service.id}">Редагувати</button>
                  <button class="btn delete-service-btn" data-id="${service.id}">Видалити</button>
              </td>
          `;
      });

      // Додаємо обробники для кнопок редагування та видалення
      document.querySelectorAll('.edit-service-btn').forEach(button => {
          button.addEventListener('click', (event) => {
              const serviceId = event.target.dataset.id;
              const serviceToEdit = services.find(s => s.id === serviceId);
              if (serviceToEdit) {
                  currentServiceId = serviceId;
                  serviceModalTitle.textContent = 'Редагувати послугу';
                  document.getElementById('serviceImageUrl').value = serviceToEdit.imageUrl;
                  document.getElementById('serviceDeviceType').value = serviceToEdit.deviceType;
                  document.getElementById('serviceBrand').value = serviceToEdit.brand;
                  document.getElementById('serviceProblem').value = serviceToEdit.problemType;
                  document.getElementById('servicePrice').value = serviceToEdit.price;
                  document.getElementById('serviceRepairTerm').value = serviceToEdit.repairTerm;
                  toggleModal('serviceModal', true);
              }
          });
      });

      document.querySelectorAll('.delete-service-btn').forEach(button => {
          button.addEventListener('click', (event) => {
              const serviceId = event.target.dataset.id;
              if (confirm('Ви впевнені, що хочете видалити цю послугу?')) {
                  let updatedServices = services.filter(s => s.id !== serviceId);
                  saveToLocalStorage('services', updatedServices);
                  renderServicesTable(); // Оновлюємо таблицю
                  alert('Послугу успішно видалено.');
              }
          });
      });
  }

  // Обробка форми додавання/редагування послуги
  addNewServiceBtn.addEventListener('click', () => {
      serviceModalTitle.textContent = 'Додати нову послугу';
      serviceForm.reset(); // Очищаємо форму для нової послуги
      currentServiceId = null; // Скидаємо ID
      toggleModal('serviceModal', true);
  });

  serviceForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const imageUrl = document.getElementById('serviceImageUrl').value.trim();
      const deviceType = document.getElementById('serviceDeviceType').value;
      const brand = document.getElementById('serviceBrand').value;
      const problemType = document.getElementById('serviceProblem').value;
      const price = parseFloat(document.getElementById('servicePrice').value);
      const repairTerm = parseInt(document.getElementById('serviceRepairTerm').value);

      const fieldsToValidate = ['serviceImageUrl', 'serviceDeviceType', 'serviceBrand', 'serviceProblem', 'servicePrice', 'serviceRepairTerm'];
      if (!validateForm(fieldsToValidate)) {
          return;
      }

      let services = getFromLocalStorage('services', initialServices);

      if (currentServiceId) {
          // Редагування існуючої послуги
          services = services.map(service =>
              service.id === currentServiceId
                  ? { ...service, imageUrl, deviceType, brand, problemType, price, repairTerm}
                  : service
          );
          alert('Послугу успішно оновлено!');
      } else {
          // Додавання нової послуги
          const newService = {
              id: generateUniqueId(),
              imageUrl,
              deviceType,
              brand,
              problemType,
              price,
              repairTerm
          };
          services.push(newService);
          alert('Нову послугу успішно додано!');
      }

      saveToLocalStorage('services', services);
      renderServicesTable(); // Оновлюємо таблицю послуг
      toggleModal('serviceModal', false);
      serviceForm.reset();
      currentServiceId = null;
  });

  // Функція рендерингу таблиці замовлень
  function renderOrdersTable() {
      const orders = getFromLocalStorage('orders');
      const ordersTableBody = document.querySelector('#ordersTable tbody');
      ordersTableBody.innerHTML = '';

      if (orders.length === 0) {
          ordersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Замовлень поки що немає.</td></tr>'; // Збільшили colspan
          return;
      }

      orders.forEach(order => {
          const row = ordersTableBody.insertRow();
          row.innerHTML = `
              <td>${order.userName}</td>
              <td>${order.userPhone}</td> <td><img src="${order.imageUrl}" alt="${order.deviceType}"></td>
              <td>${order.deviceType}</td>
              <td>${order.brand}</td>
              <td>${order.problem}</td>
              <td>${order.orderTime}</td>
              <td>${order.repairTerm} днів</td> 
              <td>
                  <select class="order-status-select" data-id="${order.id}">
                      ${orderStatuses.map(status => `
                          <option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>
                      `).join('')}
                  </select>
              </td>
          `;
      });

      // Додаємо обробники для зміни статусу замовлення
      document.querySelectorAll('.order-status-select').forEach(select => {
          select.addEventListener('change', (event) => {
              const orderId = event.target.dataset.id;
              const newStatus = event.target.value;

              let currentOrders = getFromLocalStorage('orders');
              currentOrders = currentOrders.map(order =>
                  order.id === orderId ? { ...order, status: newStatus } : order
              );
              saveToLocalStorage('orders', currentOrders);
              alert(`Статус замовлення ${orderId} змінено на "${newStatus}"`);
              // Опціонально можна оновити всю таблицю, якщо є потреба, але для зміни статусу це не критично
          });
      });
  }

});
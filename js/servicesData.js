// Цей файл містить початкові дані для послуг
// Вони будуть завантажуватися в LocalStorage, якщо їх там немає

const initialServices = [
  {
      id: 's1',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstatic4.businessinsider.com%2Fimage%2F54de262eecad047c084ca01c-909-681%2Fcracked-iphone-2.jpg&f=1&nofb=1&ipt=b09a39205340729b578ce6b62f2d8b959fecd4d5c2cbb87e74304623ae196bf2',
      deviceType: 'Смартфон',
      brand: 'Apple',
      problemType: 'Екран',
      price: 1500,
      repairTerm: 3
  },
  {
      id: 's2',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bhphotovideo.com%2Fimages%2Fimages2500x2500%2Facer_nx_mfqaa_004_aspire_v5_123_3634_11_6_notebook_1004355.jpg&f=1&nofb=1&ipt=65472ed5c10242bccf3b1d21997efc37418c65c127a84fbcba2685aadd1f892a',
      deviceType: 'Ноутбук',
      brand: 'acer',
      problemType: 'Батарея',
      price: 2000,
      repairTerm: 5
  },
  {
      id: 's3',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FzzL42QF9YQQ%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=7136c763ab069aecd0512d347effd332c974a2948e99fdca92c9ce0485d64a21',
      deviceType: 'Планшет',
      brand: 'samsung',
      problemType: 'Корпус',
      price: 800,
      repairTerm: 2
  },
  {
      id: 's4',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnwkrP2jhfks%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=f3b95a66390e4d6dcb26508cfffe2589e3f8f0eae69caafe8c1cf553ab8fec48',
      deviceType: 'Смартфон',
      brand: 'xiaomi',
      problemType: 'Не вмикаєтся',
      price: 1200,
      repairTerm: 6
  },
  {
      id: 's5',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.technewstoday.com%2Fwp-content%2Fuploads%2F2023%2F02%2Fbroken-screen-dell-laptop.webp&f=1&nofb=1&ipt=3d40e5ddda2d99abf4dd467e2713a19e89b458aa46f747fdce564df1e8be391a',
      deviceType: 'Ноутбук',
      brand: 'dell',
      problemType: 'Екран',
      price: 2500,
      repairTerm: 9
  },
  {
      id: 's6',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.technewstoday.com%2Fwp-content%2Fuploads%2F2023%2F02%2Fbroken-screen-dell-laptop.webp&f=1&nofb=1&ipt=3d40e5ddda2d99abf4dd467e2713a19e89b458aa46f747fdce564df1e8be391a',
      deviceType: 'Ноутбук',
      brand: 'dell',
      problemType: 'Екран',
      price: 2500,
      repairTerm: 9
  },
  {
      id: 's7',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.technewstoday.com%2Fwp-content%2Fuploads%2F2023%2F02%2Fbroken-screen-dell-laptop.webp&f=1&nofb=1&ipt=3d40e5ddda2d99abf4dd467e2713a19e89b458aa46f747fdce564df1e8be391a',
      deviceType: 'Ноутбук',
      brand: 'dell',
      problemType: 'Екран',
      price: 2500,
      repairTerm: 9
  },
  {
      id: 's8',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.technewstoday.com%2Fwp-content%2Fuploads%2F2023%2F02%2Fbroken-screen-dell-laptop.webp&f=1&nofb=1&ipt=3d40e5ddda2d99abf4dd467e2713a19e89b458aa46f747fdce564df1e8be391a',
      deviceType: 'Ноутбук',
      brand: 'dell',
      problemType: 'Екран',
      price: 2500,
      repairTerm: 9
  },
  {
      id: 's9',
      imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.technewstoday.com%2Fwp-content%2Fuploads%2F2023%2F02%2Fbroken-screen-dell-laptop.webp&f=1&nofb=1&ipt=3d40e5ddda2d99abf4dd467e2713a19e89b458aa46f747fdce564df1e8be391a',
      deviceType: 'Ноутбук',
      brand: 'dell',
      problemType: 'Екран',
      price: 2500,
      repairTerm: 9
  }
];

// Цей масив буде використовуватися для динамічного створення опцій у випадаючих меню
const deviceTypes = ["Смартфон", "Ноутбук", "Планшет", "Інше"];
const brands = ["Apple", "xiaomi", "samsung", "oppo", "vivo", "asus", "acer", "dell", "Інше"];
const problemTypes = ["Екран", "Батарея", "Корпус", "Не вмикаєтся", "Інше"];
const orderStatuses = ["Прийнято в обробку", "Ремонтуєтся", "Відремонтовано"];
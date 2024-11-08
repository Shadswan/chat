 // сокет
 const socket = io();
 // элементы на странице чтобы производить действия над ними
 const messagesList = document.getElementById('messages');
 const nicknameInput = document.getElementById('nickname');
 const findPartnerBtn = document.getElementById('findPartner');
 const msgInput = document.getElementById('msgInput');
 const sendMsgBtn = document.getElementById('sendMsg');
 //обработка нажатия кнопки "Найти собеседника"
 findPartnerBtn.addEventListener('click', () => {
     const nickname = nicknameInput.value;
     if (nickname) {
         socket.emit('find partner', nickname);
     }
 });
 //Обработка события, когда собеседник найден
 socket.on('partner found', (data) => {
     messagesList.appendChild(createMessageElement(`Вы подключены к ${data.nickname}`));
 });
 //Обработка входящих сообщений
 socket.on('chat message', (data) => {
     messagesList.appendChild(createMessageElement(`${data.nickname}: ${data.msg}`));
     messagesList.scrollTop = messagesList.scrollHeight; // Прокрутка вниз
 });
 //Обработка события нажатия на кнопку "Отправить сообщение"
 sendMsgBtn.addEventListener('click', () => {
     const msg = msgInput.value;
     if (msg) {
         socket.emit('chat message', msg);
         messagesList.appendChild(createMessageElement(`Вы: ${msg}`));
         messagesList.scrollTop = messagesList.scrollHeight; // Прокрутка вниз
         msgInput.value = '';
     }
 });
 //Функция для создания элементов сообщений
 function createMessageElement(msg) {
     const li = document.createElement('li');
     li.textContent = msg;
     return li;
 }
 // Обработчик для события "partner found"
socket.on('partner found', (data) => {
    console.log(`${data.nickname} найден!`);  // Правильное использование шаблонной строки
    document.querySelector('.sendMsg').style.display = 'flex';  // Изменяем свойство display
});
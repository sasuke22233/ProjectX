// Слова для слот-машины
const items = ["банан", "говно", "жопа", "очко"];

// Эмодзи для каждого слова
const itemEmojis = {
    "банан": "🍌",
    "говно": "💩",
    "жопа": "🍑",
    "очко": "🕳️"
};

// Цвета для каждого слова
const itemColors = {
    "банан": "banana",
    "говно": "poop",
    "жопа": "ass",
    "очко": "hole"
};

// Элементы DOM
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spinButton');
const resultMessage = document.getElementById('resultMessage');
const mainContainer = document.getElementById('mainContainer');
const fireworksCanvas = document.getElementById('fireworksCanvas');
const starsContainer = document.getElementById('starsContainer');

// Настройка canvas для фейерверков
const ctx = fireworksCanvas.getContext('2d');
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Массив частиц фейерверков
let fireworks = [];
let particles = [];

// Инициализация
window.addEventListener('resize', () => {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
});

// Функция для получения случайного элемента
function getRandomItem() {
    return items[Math.floor(Math.random() * items.length)];
}

// Функция для отображения элемента в слоте
function displaySlotItem(slotElement, item, index) {
    return new Promise((resolve) => {
        const slotInner = slotElement.querySelector('.slot-inner');
        const delay = index * 200; // Задержка для каждого слота
        
        setTimeout(() => {
            // Добавляем класс spinning для анимации
            slotElement.classList.add('spinning');
            
            // Создаем эффект прокрутки
            let scrollCount = 0;
            const scrollInterval = setInterval(() => {
                const randomItem = getRandomItem();
                slotInner.innerHTML = `<div class="slot-item ${itemColors[randomItem]}">${itemEmojis[randomItem]}</div>`;
                scrollCount++;
                
                if (scrollCount > 10) {
                    clearInterval(scrollInterval);
                    slotElement.classList.remove('spinning');
                    
                    // Показываем финальный результат с fade эффектом
                    slotInner.innerHTML = `<div class="slot-item ${itemColors[item]}">${itemEmojis[item]}</div>`;
                    resolve();
                }
            }, 50);
        }, delay);
    });
}

// Функция для создания фейерверка
function createFirework(x, y) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff0088'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 8 + 3;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.008,
            size: Math.random() * 4 + 2
        });
    }
}

// Функция для анимации фейерверков
function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Гравитация
        p.life -= p.decay;
        
        if (p.life > 0) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            particles.splice(i, 1);
        }
    }
    
    ctx.globalAlpha = 1.0;
    
    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        // Очищаем canvas когда все частицы исчезли
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
}

// Функция для создания звезд
function createStars() {
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 30 + '%';
        star.style.animationDelay = Math.random() * 0.5 + 's';
        star.style.width = (Math.random() * 20 + 10) + 'px';
        star.style.height = star.style.width;
        star.style.background = `hsl(${Math.random() * 60 + 40}, 100%, ${Math.random() * 30 + 70}%)`;
        starsContainer.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 2000);
    }
}

// Функция для вращения контейнера
function rotateContainer() {
    let rotations = 0;
    const maxRotations = 4;
    
    const rotate = () => {
        mainContainer.classList.add('rotate');
        rotations++;
        
        setTimeout(() => {
            mainContainer.classList.remove('rotate');
            
            if (rotations < maxRotations) {
                setTimeout(rotate, 200);
            }
        }, 800);
    };
    
    rotate();
}

// Функция для запуска эффектов победы
function triggerWinEffects() {
    // Фейерверки
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Больше фейерверков для более впечатляющего эффекта
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 200 + Math.random() * 200;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            createFirework(x, y);
        }, i * 200);
    }
    
    // Дополнительные фейерверки в центре
    setTimeout(() => {
        createFirework(centerX, centerY);
    }, 1000);
    
    animateFireworks();
    
    // Звезды
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createStars();
        }, i * 400);
    }
    
    // Вращение контейнера
    rotateContainer();
}

// Функция для отображения результата
function showResult(slot1Item, slot2Item, slot3Item) {
    resultMessage.classList.remove('show', 'jackpot', 'almost', 'lose');
    
    setTimeout(() => {
        if (slot1Item === slot2Item && slot2Item === slot3Item) {
            resultMessage.textContent = `🔥🔥🔥 ДЖЕКПОТ! ТРОЙНОЕ ${slot1Item.toUpperCase()}! 🔥🔥🔥`;
            resultMessage.classList.add('show', 'jackpot');
            triggerWinEffects();
        } else if (slot1Item === slot2Item || slot2Item === slot3Item || slot1Item === slot3Item) {
            resultMessage.textContent = 'Почти получилось! Два совпадения.';
            resultMessage.classList.add('show', 'almost');
        } else {
            resultMessage.textContent = 'Эх, не повезло. Попробуй еще раз.';
            resultMessage.classList.add('show', 'lose');
        }
    }, 1500);
}

// Основная функция запуска слот-машины
async function spinSlots() {
    // Блокируем кнопку
    spinButton.disabled = true;
    spinButton.querySelector('.button-text').textContent = '🎰 КРУТИТСЯ...';
    
    // Очищаем предыдущий результат
    resultMessage.classList.remove('show');
    
    // Генерируем случайные элементы
    const item1 = getRandomItem();
    const item2 = getRandomItem();
    const item3 = getRandomItem();
    
    // Анимируем слоты
    await Promise.all([
        displaySlotItem(slot1, item1, 0),
        displaySlotItem(slot2, item2, 1),
        displaySlotItem(slot3, item3, 2)
    ]);
    
    // Показываем результат
    showResult(item1, item2, item3);
    
    // Разблокируем кнопку
    spinButton.disabled = false;
    spinButton.querySelector('.button-text').textContent = '🎲 КРУТИТЬ';
}

// Обработчик клика на кнопку
spinButton.addEventListener('click', spinSlots);

// Обработчик нажатия Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !spinButton.disabled) {
        spinSlots();
    }
});


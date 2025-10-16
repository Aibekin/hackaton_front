document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://hackaton-backend-r2a2.onrender.com";
    const menu = document.getElementById("hamburger");
    const menu_icon = document.getElementById("menu_icon");
    const header = document.querySelector(".header");
    const progressElement = document.getElementById('progress');
    const token = localStorage.getItem("token");

    let menu_active = false;
    let userRole = "worker";
    let currentProgress = 0;
    const maxHeight = 300;

    // Меню
    menu.addEventListener('click', () => {
        menu_active = !menu_active;
        menu_icon.src = menu_active ? "icons/close.svg" : "icons/menu.svg";
        header.classList.toggle("header-active", menu_active);
    });

    // Прогресс
    function increaseProgress() {
        if (currentProgress >= 100) return;
        currentProgress += 10;
        if (currentProgress > 100) currentProgress = 100;
        progressElement.style.height = (currentProgress / 100) * maxHeight + 'px';
    }

    // Создание карточек вакансий / резюме
    async function createCard() {
        const container = document.querySelector('.job__list');
        container.innerHTML = '';

        const endpoint = userRole === "worker" ? "/jobs" : "/resumes";

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
            const data = await response.json();
            console.log("Полученные данные:", data);

            data.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');

                if (userRole === "worker") {
                    card.innerHTML = `
                        <div class="card__info">
                            <div class="card__title">${item.position}</div>
                            <div class="card__pos">${item.organizationName}</div>
                            <div class="card__pay">${item.payment} тг/мес</div>
                            <div class="card__exp">Стаж: ${item.experience}</div>
                            <div class="card__group">Групповой набор: ${item.group ? "Да" : "Нет"}</div>
                            <div class="card__country">${item.country}</div>
                            <div class="card__descr">${item.description}</div>
                        </div>
                        <button class="card__submit">Подать заявку</button>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="card__info">
                            <div class="card__title">${item.position}</div>
                            <div class="card__pos">${item.userName}</div>
                            <div class="card__exp">Опыт: ${item.experience} лет</div>
                            <div class="card__country">${item.country}</div>
                            <div class="card__descr">${item.description}</div>
                        </div>
                        <button class="card__submit">Просмотреть</button>
                    `;
                }

                container.appendChild(card);
            });

            document.querySelectorAll(".card__submit").forEach(btn => {
                btn.addEventListener("click", increaseProgress);
            });

        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    }

    // Авторизация и определение роли
    async function initUser() {
        const switcher = document.querySelector("#list");
        const auth = document.querySelector("#auth");
        const avatar = document.querySelector("#avatar");
        const create = document.getElementById("create");

        if (!token) {
            auth.style.display = "flex";
            avatar.style.display = "none";
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Ошибка авторизации");
            const userData = await res.json();
            console.log("Пользователь:", userData);

            avatar.style.display = "block";
            auth.style.display = "none";

            if (userData.role === "worker") {
                switcher.textContent = "Jobs";
                create.textContent = "Добавить Резюме";
                userRole = "worker";
            } else {
                switcher.textContent = "Resumes";
                create.textContent = "Добавить Вакансию";
                userRole = "employer";
            }

            // загружаем карточки после определения роли
            await createCard();

        } catch (err) {
            console.error(err);
        }
    }

    initUser();
});

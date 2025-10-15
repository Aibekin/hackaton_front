let currentProgress = 0; // В процентах
const progressElement = document.getElementById('progress');
const maxHeight = 300; // Высота контейнера в пикселях

function increaseProgress() {
    if (currentProgress >= 100) return; // Не превышать 100%
    currentProgress += 10;
    if (currentProgress > 100) currentProgress = 100;

    const newHeight = (currentProgress / 100) * maxHeight;
    progressElement.style.height = newHeight + 'px';
}

let userRole = "worker";
const token = localStorage.getItem("token");

const createCard = async () => {
    if (userRole === "worker") {
        await fetch("https://hackaton-backend-r2a2.onrender.com/jobs", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(jobData => {
                const container = document.querySelector('.job__list');
                console.log(jobData);

                jobData.forEach(job => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    card.innerHTML = `
                <div class="card__info">
                    <div class="card__title">${job.position}</div>
                    <div class="card__pos"> ${job.organizationName}</div>
                    <div class="card__pay"> ${job.payment} тг/мес</div>
                    <div class="card__exp">Стаж: ${job.experience}</div>
                    <div class="card__group">Групповой набор: ${job.group ? "Да" : "Нет"}</div>
                    <div class="card__country">${job.country}</div>
                    <div class="card__descr"> ${job.description}</div>
                </div>
                <button class="card__submit">Подать заявку</button>
            `;

                    container.appendChild(card);
                });
            })
            .catch(error => console.error('Ошибка загрузки JSON:', error));

        const buttons = document.querySelectorAll(".card__submit");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                increaseProgress();
            });
        });

    } else if (userRole === "employer") {
        await fetch("https://hackaton-backend-r2a2.onrender.com/resumes", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(jobData => {
                console.log(jobData);
                const container = document.querySelector('.job__list');

                jobData.forEach(job => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    card.innerHTML = `
                    <div class="card__info">
                        <div class="card__title">${job.position}</div>
                        <div class="card__pos">${job.userName}</div>
                        <div class="card__exp">Опыт: ${job.experience} лет</div>
                        <div class="card__country">${job.country}</div>
                        <div class="card__descr"> ${job.description}</div>
                    </div>
                    <button class="card__submit">Подать заявку</button>
                `;

                    container.appendChild(card);
                });
            })
            .catch(error => console.error('Ошибка загрузки JSON:', error));

        const buttons = document.querySelectorAll(".card__submit");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                increaseProgress();
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const switcher = document.querySelector("#list");
    const auth = document.querySelector("#auth");
    const avatar = document.querySelector("#avatar");
    const create = document.getElementById("create");

    if (!token) {
        auth.style.display = "flex";
        avatar.style.display = "none";
    } else {
        avatar.style.display = "block";
        auth.style.display = "none";
    }

    fetch("https://hackaton-backend-r2a2.onrender.com/auth/me", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка авторизации');
            }
            return response.json();
        })
        .then(userData => {
            console.log(userData);
            if (userData.role === "worker") {
                switcher.textContent = "Jobs";
                create.textContent = "Добавить Резюме";
                userRole = "worker";
            } else if (userData.role === "employer") {
                switcher.textContent = "Resumes";
                create.textContent = "Добавить Вакансию";
                userRole = "employer";
            }
            createCard();
        });
});
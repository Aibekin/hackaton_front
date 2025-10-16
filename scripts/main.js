document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.querySelector(".main__textinput");
    const searchButton = document.querySelector(".main__submit");
    const jobList = document.querySelector(".overlay");
    const menu = document.getElementById("hamburger");
    const menu_icon = document.getElementById("menu_icon");
    const header = document.querySelector(".header");

    let menu_active = false;
    menu.addEventListener('click', () => {
        if (!menu_active) {
            menu_icon.src = "icons/close.svg";
            header.classList.add("header-active");
            menu_active = true;
        } else {
            menu_icon.src = "icons/menu.svg";
            header.classList.remove("header-active");
            menu_active = false;
        }
    });

    let allJobs = [];

    fetch("scripts/vacancies.json")
        .then(response => response.json())
        .then(jobData => {
            allJobs = jobData;
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));

    function renderJobs(job) {
        jobList.innerHTML = "";

        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
                <button class="close">
                    <img src="icons/close.svg" alt="">
                </button>
                <div class="card__info">
                    <div class="card__title">${job.name}</div>
                    <div class="card__pos"> ${job.pos}</div>
                    <div class="card__pay"> ${job.pay} тг/мес</div>
                    <div class="card__exp">Стаж: ${job.exp}</div>
                    <div class="card__country">${job.country}</div>
                    <div class="card__descr"> ${job.descr}</div>
                </div>
                <button class="card__submit">Подать заявку</button>
            `;

        jobList.appendChild(card);
        jobList.classList.add("overlay-active");
    }

    searchButton.addEventListener("click", () => {
        const keyword = searchInput.value.trim().toLowerCase();

        const filteredJobs = allJobs.filter(job => job.name.toLowerCase().includes(keyword));

        if (filteredJobs.length > 0) {
            filteredJobs.forEach(job => {
                renderJobs(job);
            });
            jobList.classList.add("overlay-active");
            document.querySelector(".close").addEventListener("click", () => {
                if (jobList.classList.contains("overlay-active")) {
                    jobList.classList.remove("overlay-active");
                }
            });
        } else {
            jobList.innerHTML = `<div class='no-results'>Ничего не найдено</div>`;
            jobList.classList.add("overlay-active");
        }
    });
});
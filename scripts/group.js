document.addEventListener("DOMContentLoaded", () => {

    const job_list = document.querySelector(".job__list");
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

    fetch("scripts/vacancies.json")
        .then(response => response.json())
        .then(jobData => {
            const container = document.querySelector('.job__list');

            jobData.forEach(job => {
                if (job.group == "Да") {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    card.innerHTML = `
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

                    container.appendChild(card);
                }
            });
        })
        .catch(error => console.error('Ошибка загрузки JSON:', error));
});
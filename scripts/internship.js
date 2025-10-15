const job_list = document.querySelector(".job__list");

fetch("scripts/vacancies.json")
    .then(response => response.json())
    .then(jobData => {
        const container = document.querySelector('.job__list');

        jobData.forEach(job => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <div class="card__info">
                    <div class="card__title">${job.name}</div>
                    <div class="card__pos"> ${job.pos}</div>
                    <div class="card__group">Групповой набор: ${job.group}</div>
                    <div class="card__country">${job.country}</div>
                    <div class="card__descr"> ${job.descr}</div>
                </div>
                <button class="card__submit">Подать заявку</button>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error('Ошибка загрузки JSON:', error));
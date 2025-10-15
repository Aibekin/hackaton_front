// const token = localStorage.getItem('token');

if (!token) {
    console.log('Пользователь не авторизован');
} else {
    fetch('https://hackaton-backend-r2a2.onrender.com/auth/me', {
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
            console.log('Данные пользователя:', userData);
            const worker = document.querySelector(".worker");
            const employer = document.querySelector(".employer");
            if (userData.role === "worker") {
                worker.classList.remove("user__role-hidden");
                employer.classList.add("user__role-hidden");
            } else {
                employer.classList.remove("user__role-hidden");
                worker.classList.add("user__role-hidden");
            }
            const role = userData.role;
            document.querySelector(".user__name").textContent = userData.userName;
            role === "worker" ? "asd" : document.querySelector(".user__org").innerHTML = `Организация: <b>${userData.organizationName}</b>`;
            role === "worker" ? document.querySelector(".user__spec").innerHTML = `Специальность: <b>${userData.specialization}</b>` : "asd";
            role === "worker" ? document.querySelector(".user__age").innerHTML = `Возраст: <b>${userData.age}</b>` : "asd";
            role === "worker" ? document.querySelector(".user__sex").innerHTML = `Пол: <b>${userData.gender === "male" ? "Мужчина" : "Женщина"}</b>` : "asd";
            document.querySelector(".user__country").innerHTML = `Country: <b>${userData.country}</b>`;
        });
}
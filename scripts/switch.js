let userRole = "worker";
const token = localStorage.getItem("token");

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

    fetch("http://localhost:5000/auth/me", {
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
        });
});


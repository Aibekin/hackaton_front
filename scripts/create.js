document.addEventListener('DOMContentLoaded', async () => {
    const vacancyBlock = document.getElementById('vacancy');
    const resumeBlock = document.getElementById('resume');
    const vacancyForm = document.getElementById('vacancyForm');
    const resumeForm = document.getElementById('resumeForm');
    const token = localStorage.getItem("token");

    let userRole = null;

    try {
        const response = await fetch("https://hackaton-backend-r2a2.onrender.com/auth/me", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Ошибка авторизации');
        const userData = await response.json();

        userRole = userData.role;
        console.log("Роль пользователя:", userRole);

        // Показываем нужную форму
        if (userRole === "employer") {
            vacancyBlock.classList.remove("auth-hidden");
            resumeBlock.classList.add("auth-hidden");
        } else if (userRole === "worker") {
            resumeBlock.classList.remove("auth-hidden");
            vacancyBlock.classList.add("auth-hidden");
        }
    } catch (err) {
        console.error(err);
        alert("Ошибка авторизации. Войдите снова.");
        window.location.href = "login.html";
        return;
    }

    async function handleSubmit(e, endpoint, roleRequired, form) {
        e.preventDefault();

        if (userRole !== roleRequired) {
            alert(`Только ${roleRequired === "employer" ? "работодатели" : "работники"} могут использовать эту форму.`);
            return;
        }

        const formData = new FormData(form);
        const createData = {
            position: formData.get("position"),
            payment: formData.get("payment"),
            experience: formData.get("exp"),
            group: formData.get("group") === "Да",
            description: formData.get("descr")
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Успешно добавлено!");
                window.location.href = 'job.html';
            } else {
                alert(data.message || 'Ошибка загрузки');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения');
        }
    }

    vacancyForm.addEventListener('submit', e =>
        handleSubmit(e, 'https://hackaton-backend-r2a2.onrender.com/jobs', 'employer', vacancyForm)
    );

    resumeForm.addEventListener('submit', e =>
        handleSubmit(e, 'https://hackaton-backend-r2a2.onrender.com/resumes', 'worker', resumeForm)
    );
});

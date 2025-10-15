document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('createForm');
    const token = localStorage.getItem("token");
    console.log(token);
    let userRole = "worker";

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
                userRole = "worker";
            } else if (userData.role === "employer") {
                userRole = "employer";
            }
        });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const createData = {
            position: document.getElementById("position").value,
            payment: document.getElementById("payment").value,
            experience: document.getElementById("exp").value,
            group: document.getElementById("group").value === "Да" ? true : false,
            description: document.getElementById("descr").value
        };
        console.log('Отправка данных:', createData);

        try {
            const response = await fetch('https://hackaton-backend-r2a2.onrender.com/jobs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createData)
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = 'job.html';
            } else {
                alert(data.message || 'Ошибка загрузки');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения');
        }
    });
});
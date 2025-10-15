document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role');
    const workerFields = document.querySelector('.worker');
    const employerFields = document.querySelector('.employer');

    const registerForm = document.getElementById('registerForm');

    roleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'worker') {
            workerFields.classList.remove("auth__info-hidden");
            employerFields.classList.add("auth__info-hidden");
        } else {
            employerFields.classList.remove("auth__info-hidden");
            workerFields.classList.add("auth__info-hidden");
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            email: roleSelect.value === "worker" ? document.getElementById('email').value : document.getElementById('email-employer').value,
            password: roleSelect.value === "worker" ? document.getElementById('password').value : document.getElementById('password-employer').value,
            role: roleSelect.value,
            userName: roleSelect.value === "worker" ? document.getElementById('userName').value : document.getElementById('userName-employer').value,
            organizationName: roleSelect.value === "employer" ? document.getElementById('organizationName').value : undefined,
            specialization: roleSelect.value === "worker" ? document.getElementById('spec').value : undefined,
            gender: roleSelect.value === "worker" ? document.querySelector('input[name="gender"]:checked').value : undefined,
            age: roleSelect.value === "worker" ? document.getElementById('age').value : undefined,
            experience: roleSelect.value === "worker" ? document.getElementById('experience').value : undefined,
            country: roleSelect.value === "worker" ? document.getElementById('country').value : document.getElementById('country-employer').value,
        };
        console.log('Отправка данных:', userData);

        try {
            const response = await fetch('https://hackaton-backend-r2a2.onrender.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'user.html';
            } else {
                alert(data.message || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения');
        }
    });
});

// const protectedPages = ['dashboard.html', 'create-resume.html'];
// if (protectedPages.some(page => window.location.pathname.endsWith(page))) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         window.location.href = 'login.html';
//     }
// }
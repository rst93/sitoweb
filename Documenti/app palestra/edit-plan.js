document.addEventListener('DOMContentLoaded', () => {
    const planNameInput = document.getElementById('plan-name');
    const dayList = document.getElementById('day-list');
    const addDayBtn = document.getElementById('add-day-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const planNameToEdit = urlParams.get('plan');
    let dayCounter = 1;

    if (planNameToEdit) {
        fetch(`/get-plans`)
            .then(response => response.json())
            .then(plans => {
                const plan = plans.find(p => p.name.replace(/\s+/g, '-').toLowerCase() === planNameToEdit);
                if (plan) {
                    planNameInput.value = plan.name;
                    plan.days.forEach((day, index) => {
                        const dayElement = createDayElement(index + 1);
                        dayList.appendChild(dayElement);
                        localStorage.setItem(`day-${index + 1}`, JSON.stringify(day));
                    });
                    dayCounter = plan.days.length + 1;
                }
            });
    }

    addDayBtn.addEventListener('click', () => {
        const dayElement = createDayElement(dayCounter);
        dayList.appendChild(dayElement);
        dayCounter++;
    });

    savePlanBtn.addEventListener('click', () => {
        const plan = {
            name: planNameInput.value,
            days: []
        };

        for (let i = 1; i < dayCounter; i++) {
            const dayData = localStorage.getItem(`day-${i}`);
            if (dayData) {
                plan.days.push(JSON.parse(dayData));
            }
        }

        fetch('/save-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            for (let i = 1; i < dayCounter; i++) {
                localStorage.removeItem(`day-${i}`);
            }
            window.location.href = 'create-plan.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save plan');
        });
    });

    function createDayElement(day) {
        const dayElement = document.createElement('a');
        dayElement.href = `day.html?day=${day}`;
        dayElement.classList.add('day');
        dayElement.innerHTML = `<h3>Day ${day}</h3>`;
        return dayElement;
    }
});
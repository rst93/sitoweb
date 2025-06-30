document.addEventListener('DOMContentLoaded', () => {
    const addDayBtn = document.getElementById('add-day-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const dayList = document.getElementById('day-list');
    let dayCounter = 1;

    addDayBtn.addEventListener('click', () => {
        console.log(`Add Day ${dayCounter}`);
        const dayElement = document.createElement('a');
        dayElement.href = `day.html?day=${dayCounter}`;
        dayElement.classList.add('day');
        dayElement.innerHTML = `<h3>Day ${dayCounter}</h3>`;
        dayList.appendChild(dayElement);
        dayCounter++;
    });

    savePlanBtn.addEventListener('click', () => {
        const planName = prompt('Enter a name for your plan:');
        if (!planName) return;

        const plan = {
            name: planName,
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
});
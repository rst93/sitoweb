document.addEventListener('DOMContentLoaded', () => {
    const newPlanBtn = document.getElementById('new-plan-btn');
    const planList = document.getElementById('plan-list');

    newPlanBtn.addEventListener('click', () => {
        window.location.href = 'new-plan.html';
    });

    fetch('/get-plans')
        .then(response => response.json())
        .then(plans => {
            plans.forEach(plan => {
                const planElement = document.createElement('div');
                planElement.classList.add('plan');
                planElement.innerHTML = `<h3>${plan.name}</h3>`;
                planElement.addEventListener('click', () => {
                    window.location.href = `edit-plan.html?plan=${plan.name.replace(/\s+/g, '-').toLowerCase()}`;
                });
                planList.appendChild(planElement);
            });
        })
        .catch(error => console.error('Error:', error));
});
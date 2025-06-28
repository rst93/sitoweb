document.addEventListener('DOMContentLoaded', () => {
    const trainBtn = document.getElementById('train-btn');
    const createPlanBtn = document.getElementById('create-plan-btn');
    const statisticsBtn = document.getElementById('statistics-btn');

    trainBtn.addEventListener('click', () => {
        console.log('Navigate to Train section');
    });

    createPlanBtn.addEventListener('click', () => {
        window.location.href = 'create-plan.html';
    });

    statisticsBtn.addEventListener('click', () => {
        console.log('Navigate to Statistics section');
    });
});
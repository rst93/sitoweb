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
                planElement.innerHTML = `
                    <h3>${plan.name}</h3>
                    <button class="delete-plan-btn" data-plan-name="${plan.name.replace(/\s+/g, '-').toLowerCase()}">Delete</button>
                `;
                planElement.querySelector('.delete-plan-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const planName = e.target.dataset.planName;
                    console.log('Delete button clicked for plan:', planName);
                    if (confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
                        console.log('Sending delete request for:', planName);
                        fetch(`/delete-plan/${planName}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            console.log('Received response from server:', response);
                            return response.json().then(data => ({ ok: response.ok, data }));
                        })
                        .then(({ ok, data }) => {
                            console.log('Parsed response data:', data);
                            alert(data.message);
                            if (ok) {
                                planElement.remove();
                            }
                        })
                        .catch(error => {
                            console.error('Fetch error:', error);
                            alert('Failed to delete plan. See console for details.');
                        });
                    }
                });

                planElement.addEventListener('click', () => {
                    window.location.href = `edit-plan.html?plan=${plan.name.replace(/\s+/g, '-').toLowerCase()}`;
                });
                planList.appendChild(planElement);
            });
        })
        .catch(error => console.error('Error:', error));
});
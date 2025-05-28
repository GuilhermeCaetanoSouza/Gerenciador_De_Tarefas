document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Carregar tarefas ao iniciar
    loadTasks();

    // Adicionar nova tarefa
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        
        if (title) {
            try {
                const response = await fetch('/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title })
                });
                
                const newTask = await response.json();
                addTaskToDOM(newTask);
                taskInput.value = '';
            } catch (error) {
                console.error('Erro ao adicionar tarefa:', error);
            }
        }
    });

    // Carregar tarefas do servidor
    async function loadTasks() {
        try {
            const response = await fetch('/tasks');
            const tasks = await response.json();
            tasks.forEach(task => addTaskToDOM(task));
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    // Adicionar tarefa ao DOM
    function addTaskToDOM(task) {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-title">${task.title}</span>
            <button class="delete-btn">Excluir</button>
        `;
        
        // Concluidas
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked));
        
        // Excluir tarefa
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(taskItem);
    }

    // Alternar status da tarefa
    async function toggleTaskCompletion(taskId, completed) {
        try {
            await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });
            
            const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
            if (completed) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    }

    // Excluir tarefa
    async function deleteTask(taskId) {
        try {
            await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
            taskItem.remove();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
});
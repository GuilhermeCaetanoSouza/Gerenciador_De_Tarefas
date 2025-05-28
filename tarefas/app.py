from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Banco de dados simples em memória
tasks = [
    {"id": 1, "title": "Estudar Python", "completed": False},
    {"id": 2, "title": "Fazer compras", "completed": True},
    {"id": 3, "title": "Ler livro", "completed": False}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    new_task = request.json
    new_id = max(task['id'] for task in tasks) + 1 if tasks else 1
    new_task['id'] = new_id
    new_task['completed'] = False
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task = request.json
    for task in tasks:
        if task['id'] == task_id:
            task.update(updated_task)
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({"result": "Task deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
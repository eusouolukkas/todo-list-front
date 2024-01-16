import React, { useState } from 'react';
import axios from './Api';
import TaskList from './components/TaskList';

export const App: React.FC = () => {
  const [newTask, setNewTask] = useState('');

  const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/tasks', {
        description: newTask,
      })

      console.log('Tarefa criada com sucesso:', response.data);

      setNewTask('');
      location.reload();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <div className='App'>
      <TaskList />
      <h2>Adicionar nova tarefa</h2>
      <div className='tasks'>
        <input type="text" value={newTask} onChange={handleTaskDescriptionChange} placeholder='Escreva sua tarefa' />
      </div>
      <button onClick={handleCreateTask}>Criar Tarefa</button>
    </div>
  );
};

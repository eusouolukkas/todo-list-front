import React, { useState, useEffect } from 'react';
import axios from '../Api';

interface Task {
  _id: string;
  description: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Erro ao obter tarefas:', error);
      }
  };

  const handleDeleteTask = async (_id: string) => {
      try {
        await axios.delete(`/api/tasks/${_id}`);
        console.log('Tarefa excluída com sucesso!');
        location.reload();
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
  };

  if (!tasks) {
    return <p>Carregando descrição da tarefa...</p>;
  }

  return (
      <div>
        <h1>Lista de Tarefas</h1>
        <div className='tasks'>
          {
          tasks.length === 0 ?
          <div><h2>Sem Tarefas Cadastradas</h2></div>
          :
          tasks.map((task, index) => (
            <div key={index} className='task'>
                <p key={task._id} className='text'>{task.description} </p>
              <div>
                <button className='icon' onClick={() => handleDeleteTask(task._id)}>x</button>
                
              </div>
            </div>
            ))}
        </div>
      </div>
  );
};

export default TaskList;

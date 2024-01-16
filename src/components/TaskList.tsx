import React, { useState, useEffect } from 'react';
import axios from '../Api';
import Modal from 'react-modal';

interface Task {
  _id: string;
  description: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editedDescription, setEditedDescription] = useState<string>('');


  useEffect(() => {
    getTasks();
  }, []);

  const handleGetTaskIdAndEdit = (id: string) => {
    setTaskId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditTask = async () => {
    if (taskId) {
      try {
        await axios.put(`/api/tasks/${taskId}`, { description: editedDescription });
        console.log('Tarefa editada com sucesso!');

        setTaskId(null);
        setTasks([]);
        setEditedDescription('');
        setIsModalOpen(false);
        location.reload();
      } catch (error) {
        console.error('Erro ao editar tarefa:', error);
      }
    }
  };

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
                <button onClick={() => handleGetTaskIdAndEdit(task._id)}>Editar</button>
              </div>
            </div>
            ))}
        </div>

        <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        ariaHideApp={false}
        contentLabel="Editar Tarefa"
      >
        <h2>Editar Tarefa</h2>
        {tasks && (
          <div>
            <label>
              Nova Descrição:
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </label>
            <button onClick={handleEditTask}>Confirmar Edição</button>
            <button onClick={handleModalClose}>Fechar Modal</button>
          </div>
        )}
      </Modal>

      </div>
  );
};

export default TaskList;

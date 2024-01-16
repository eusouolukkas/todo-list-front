import React, { useState, useEffect } from 'react';
import axios from '../Api';
import Modal from 'react-modal';

interface Task {
  _id: string;
  description: string;
}

const EditTaskModal: React.FC = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (taskId) {
        try {
          const response = await axios.get(`/api/tasks/${taskId}`);
          setTasks(response.data.tasks);
          setEditedDescription(response.data.description);
          setIsModalOpen(true);
        } catch (error) {
          console.error('Erro ao buscar detalhes da tarefa:', error);
        }
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleGetTaskIdAndEdit = (id: string) => {
    setTaskId(id);
  };

  const handleEditTask = async () => {
    if (taskId) {
      try {
        // Envia a solicitação de edição para o backend
        await axios.put(`/api/task/${taskId}`, { description: editedDescription });
        console.log('Tarefa editada com sucesso!');
        // Limpa o estado para evitar renderizações desnecessárias
        setTaskId(null);
        setTasks([]);
        setEditedDescription('');
        setIsModalOpen(false);
      } catch (error) {
        console.error('Erro ao editar tarefa:', error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Editar Tarefa</h2>
      <ul>
        {/* Lista de tarefas com botão para obter o ID e editar */}
        {tasks.map((task) => (
          <li key={task._id}>
            {task.description}
            <button onClick={() => handleGetTaskIdAndEdit(task._id)}>Editar</button>
          </li>
        ))}
      </ul>

      {/* Modal de Edição */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Editar Tarefa"
      >
        <h2>Editar Tarefa</h2>
        {tasks && (
          <div>
            {/* Formulário de edição */}
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

export default EditTaskModal;

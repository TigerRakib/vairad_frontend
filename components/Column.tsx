'use client';

import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: number) => void;
}

const statusConfig: Record<
  TaskStatus,
  { color: string; icon: string }
> = {
  todo: { color: 'bg-gray-100', icon: '📋' },
  in_progress: { color: 'bg-blue-100', icon: '⚙️' },
  done: { color: 'bg-green-100', icon: '✅' },
};

export function Column({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ColumnProps) {
  const config = statusConfig[status];

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 rounded-lg p-4 min-h-96 ${
            snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'
          } transition-all`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span>{config.icon}</span>
              {title}
              <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-sm rounded-full">
                {tasks.length}
              </span>
            </h2>
            {onAddTask && (
              <button
                onClick={() => onAddTask(status)}
                className="p-1.5 hover:bg-white rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                title="Add task"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

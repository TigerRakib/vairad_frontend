'use client';

import { Task, TaskStatus } from '@/types';
import { Column } from './Column';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

interface BoardProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onAddTask?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: number) => void;
  onViewTask?: (task: Task) => void;
}

const statuses: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'Todo' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

export function Board({
  tasks,
  onDragEnd,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
}: BoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {statuses.map(({ status, label }) => (
          <Column
            key={status}
            title={label}
            status={status}
            tasks={getTasksByStatus(status)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onViewTask={onViewTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

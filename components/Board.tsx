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
}

const statuses: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

export function Board({
  tasks,
  onDragEnd,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: BoardProps) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {statuses.map(({ status, label }) => (
          <Column
            key={status}
            title={label}
            status={status}
            tasks={getTasksByStatus(status)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

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
  onViewTask?: (task: Task) => void;
}

export function Column({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
}: ColumnProps) {
  return (
    <div className="flex flex-col bg-white rounded-card border border-border overflow-hidden">
      {/* Column Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-sm text-text-primary">{title}</h3>
          <span className="bg-slate-100 text-text-secondary text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-button text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
            title="Add task"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[400px] transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset' : 'bg-surface-bg'
            }`}
          >
            <div className="space-y-3">
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
                        onView={onViewTask}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            {/* Add Task Button */}
            {onAddTask && (
              <button
                onClick={() => onAddTask(status)}
                className="w-full mt-3 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-white rounded-button transition-colors flex items-center justify-center gap-1.5 border border-dashed border-border hover:border-primary/30"
              >
                <PlusIcon className="w-4 h-4" />
                Add Task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

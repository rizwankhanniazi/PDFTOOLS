import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ListTodo } from 'lucide-react';
import type { TaskStats } from '../types';

interface TaskStatsProps {
  stats: TaskStats;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <ListTodo className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold">{stats.highPriority}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-2xl font-bold">{stats.overdue}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
}
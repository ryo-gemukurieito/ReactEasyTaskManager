import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList.tsx';
import TaskForm from './components/TaskForm.tsx';
import { Task } from './types/task.ts';

const App: React.FC = () => {
  //const [変数, 状態変化関数] = useState<変数の型（option）>(変数の初期値);
  //状態変化関数（変数の状態を変化させる関数であるべき：推奨されていて、そうでないコードはバグの原因になる）
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterCondition, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  // ローカルストレージからタスクを取得
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);//初回レンダリング時に呼び出される。

  // タスクをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);//taskに変化があった場合に呼び出される。

  // タスクを追加
  const addTask = (title: string) => {
    const newTask: Task = { id: tasks.length + 1, title, completed: false };
    setTasks([...tasks, newTask]);
  };

  // タスクの完了状態を切り替え
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  // タスクを削除
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // フィルタリングされたタスク
  const filteredTasks = tasks.filter(task => {
    if (filterCondition === 'completed') return task.completed;
    if (filterCondition === 'incomplete') return !task.completed;
    return true; // 'all'
  });

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} />

      {/* フィルターボタン */}
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      {/* フィルタリングされたタスクを表示 */}
      <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
};

export default App;

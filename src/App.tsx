/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ViewState } from './types';
import { Dashboard } from './views/Dashboard';
import { CreateAnimation } from './views/CreateAnimation';
import { Characters } from './views/Characters';
import { Backgrounds } from './views/Backgrounds';
import { HistoryView } from './views/History';
import { Behaviors } from './views/Behaviors';
import { Scenes } from './views/Scenes';
import { Templates } from './views/Templates';
import { useStore } from './store';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [directorInput, setDirectorInput] = useState<string>('');
  
  const store = useStore();

  const handleNavigate = (view: ViewState, aiPrompt?: string) => {
    if (aiPrompt) {
      setDirectorInput(aiPrompt);
    } else {
      setDirectorInput('');
    }
    setCurrentView(view);
  };

  const renderView = () => {
    if (!store.isLoaded) return <div>Carregando...</div>;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} store={store} />;
      case 'create':
        return <CreateAnimation onNavigate={handleNavigate} initialPrompt={directorInput} store={store} />;
      case 'characters':
        return <Characters onNavigate={handleNavigate} store={store} />;
      case 'backgrounds':
        return <Backgrounds />;
      case 'history':
        return <HistoryView store={store} />;
      case 'behaviors':
        return <Behaviors />;
      case 'scenes':
        return <Scenes />;
      case 'templates':
        return <Templates />;
      default:
        return <Dashboard onNavigate={handleNavigate} store={store} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header currentView={currentView} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto w-full relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

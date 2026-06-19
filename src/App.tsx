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
import { History } from './views/History';
import { Behaviors } from './views/Behaviors';
import { Scenes } from './views/Scenes';
import { Templates } from './views/Templates';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'create':
        return <CreateAnimation onNavigate={setCurrentView} />;
      case 'characters':
        return <Characters onNavigate={setCurrentView} />;
      case 'backgrounds':
        return <Backgrounds />;
      case 'history':
        return <History />;
      case 'behaviors':
        return <Behaviors />;
      case 'scenes':
        return <Scenes />;
      case 'templates':
        return <Templates />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-y-auto w-full relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

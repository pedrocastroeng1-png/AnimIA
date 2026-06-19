/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home } from './views/Home';
import { CreateMascot } from './views/CreateMascot';
import { WorkspaceSidebar } from './components/WorkspaceSidebar';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { AiDirector } from './views/workspace/AiDirector';
import { SceneGenerator } from './views/workspace/SceneGenerator';
import { Backgrounds } from './views/Backgrounds';
import { HistoryView } from './views/History';

import { useStore } from './store';
import { AppState, WorkspaceView, Character } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('director');
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  
  const store = useStore();

  if (!store.isLoaded) return <div className="h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-800">Carregando IA...</div>;

  const handleSelectCharacter = (char: Character) => {
     setActiveCharacterId(char.id);
     setWorkspaceView('director');
     setAppState('workspace');
  };

  const activeCharacter = store.characters.find(c => c.id === activeCharacterId);

  // Render for Workspace Mode
  const renderWorkspaceView = () => {
     switch (workspaceView) {
        case 'director':
           return <AiDirector activeCharacter={activeCharacter!} store={store} onNavigate={setWorkspaceView} />;
        case 'scenes':
           return <SceneGenerator activeCharacter={activeCharacter!} store={store} />;
        case 'backgrounds':
           return <Backgrounds />;
        case 'projects':
           return <HistoryView store={store} />;
        default:
           return (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <h2 className="text-xl font-bold mb-2">Em Construção</h2>
                 <p>Esta funcionalidade será disponibilizada em breve.</p>
              </div>
           );
     }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
       {appState === 'home' && (
         <Home 
           store={store} 
           onNavigateToCreate={() => setAppState('create_mascot')} 
           onSelectCharacter={handleSelectCharacter} 
         />
       )}

       {appState === 'create_mascot' && (
         <CreateMascot 
           onFinish={(char) => {
             store.addCharacter(char);
             setActiveCharacterId(char.id);
             setWorkspaceView('director');
             setAppState('workspace');
           }}
           onCancel={() => setAppState('home')}
         />
       )}

       {appState === 'workspace' && activeCharacter && (
         <>
           <WorkspaceSidebar currentView={workspaceView} onNavigate={setWorkspaceView} />
           <div className="flex-1 flex flex-col h-full overflow-hidden relative">
             <WorkspaceHeader 
               activeCharacter={activeCharacter} 
               onChangeMascot={() => {
                 setActiveCharacterId(null);
                 setAppState('home');
               }} 
             />
             <main className="flex-1 overflow-y-auto w-full relative">
               {renderWorkspaceView()}
             </main>
           </div>
         </>
       )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Search, Loader2 } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import { Application, ApplicationStatus } from './types';
import { generateDummyApplications } from './dummyData';

export default function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    const loadInitialData = async () => {      
      await new Promise(resolve => setTimeout(resolve, 800));
      setApplications(generateDummyApplications(40));
      setIsLoading(false);
    };
    
    loadInitialData();
  }, []);
  
  const filteredApplications = useMemo(() => {
    if (!searchTerm) return applications;
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return applications.filter(app => 
      app.job.title.toLowerCase().includes(lowercaseSearchTerm) ||
      app.job.company.name.toLowerCase().includes(lowercaseSearchTerm)
    );
  }, [applications, searchTerm]);
  
  const applicationsByStatus = useMemo(() => {    
    if (filteredApplications.length === 0) {
      return {
        applied: [],
        under_review: [],
        inprogress: [],
        rejected: [],
        closed: []
      };
    }
        
    const statusMap: Record<ApplicationStatus, Application[]> = {
      applied: [],
      under_review: [],
      inprogress: [],
      rejected: [],
      closed: []
    };
        
    for (let i = 0; i < filteredApplications.length; i++) {
      const app = filteredApplications[i];      
      statusMap[app.status].push(app);
    }
    
    return statusMap;
  }, [filteredApplications]);
  
  const handleStatusChange = useCallback((applicationId: string, newStatus: ApplicationStatus) => {
    setApplications(prevApplications => {      
      const appIndex = prevApplications.findIndex(app => app.id === applicationId);
      if (appIndex === -1) return prevApplications;
            
      if (prevApplications[appIndex].status === newStatus) return prevApplications;
            
      const newApplications = [...prevApplications];
      newApplications[appIndex] = {
        ...newApplications[appIndex],
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      return newApplications;
    });
  }, []);
  
  const handleDelete = useCallback((applicationId: string) => {
    setApplications(prevApplications => 
      prevApplications.filter(app => app.id !== applicationId)
    );
  }, []);
  
  const loadMore = useCallback(async () => {
    setIsLoading(true);
    try {      
      await new Promise(resolve => setTimeout(resolve, 1000));
            
      const newApplications = generateDummyApplications(10);
      
      setApplications(prev => [...prev, ...newApplications]);
      setPage(prevPage => prevPage + 1);
            
      if (page >= 3) {
        setHasMore(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const columnStatuses: {status: ApplicationStatus, title: string}[] = [
    { status: 'applied', title: 'Applied' },
    { status: 'under_review', title: 'Under Review' },
    { status: 'inprogress', title: 'In Progress' },
    { status: 'rejected', title: 'Rejected' },
    { status: 'closed', title: 'Closed' }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col w-full">
        <div className="p-4 border-b border-gray-200">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md block w-full pl-10 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {isLoading && applications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-200 animate-spin mb-3"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4">
              <div className="flex gap-4 pb-4 px-1 overflow-x-auto">
                {columnStatuses.map(col => (
                  <KanbanColumn
                    key={col.status}
                    title={col.title}
                    status={col.status}
                    applications={applicationsByStatus[col.status]}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
            
            {hasMore && (
              <div className="border-t border-gray-200 p-4 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className={`py-2 px-6 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    transition-colors duration-200 ease-in-out
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading more applications...
                    </div>
                  ) : (
                    'Load more applications'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DndProvider>
  );
}
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Users, FileText, Calendar, DollarSign, FolderOpen, Command } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'member' | 'task' | 'document' | 'transaction' | 'programme';
  path: string;
  icon: React.ReactNode;
  matchedField?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { members, tasks, documents, transactions, programmes } = useAppContext();
  const navigate = useNavigate();

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search members
    members.forEach(member => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = member.email?.toLowerCase() || '';
      const phone = member.phone?.toLowerCase() || '';
      
      if (fullName.includes(lowerQuery) || email.includes(lowerQuery) || phone.includes(lowerQuery)) {
        searchResults.push({
          id: member.id,
          title: `${member.firstName} ${member.lastName}`,
          subtitle: member.email || 'No email',
          type: 'member',
          path: `/members/${member.id}`,
          icon: <Users className="h-4 w-4" />,
          matchedField: fullName.includes(lowerQuery) ? 'name' : email.includes(lowerQuery) ? 'email' : 'phone'
        });
      }
    });

    // Search tasks
    tasks.forEach(task => {
      const title = task.title.toLowerCase();
      const description = task.description?.toLowerCase() || '';
      
      if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
        searchResults.push({
          id: task.id,
          title: task.title,
          subtitle: task.description || 'No description',
          type: 'task',
          path: `/tasks/${task.id}`,
          icon: <FileText className="h-4 w-4" />,
          matchedField: title.includes(lowerQuery) ? 'title' : 'description'
        });
      }
    });

    // Search documents
    documents.forEach(doc => {
      const name = doc.name.toLowerCase();
      const description = doc.description?.toLowerCase() || '';
      
      if (name.includes(lowerQuery) || description.includes(lowerQuery)) {
        searchResults.push({
          id: doc.id,
          title: doc.name,
          subtitle: doc.description || 'No description',
          type: 'document',
          path: '/documents',
          icon: <FolderOpen className="h-4 w-4" />,
          matchedField: name.includes(lowerQuery) ? 'name' : 'description'
        });
      }
    });

    // Search transactions
    transactions.forEach(transaction => {
      const description = transaction.description.toLowerCase();
      
      if (description.includes(lowerQuery)) {
        searchResults.push({
          id: transaction.id,
          title: transaction.description,
          subtitle: `${transaction.type} - R${transaction.amount.toLocaleString()}`,
          type: 'transaction',
          path: '/finance',
          icon: <DollarSign className="h-4 w-4" />,
          matchedField: 'description'
        });
      }
    });

    // Search programmes
    programmes.forEach(programme => {
      const name = programme.name.toLowerCase();
      const description = programme.description?.toLowerCase() || '';
      
      if (name.includes(lowerQuery) || description.includes(lowerQuery)) {
        searchResults.push({
          id: programme.id,
          title: programme.name,
          subtitle: programme.description || 'No description',
          type: 'programme',
          path: '/programmes',
          icon: <Calendar className="h-4 w-4" />,
          matchedField: name.includes(lowerQuery) ? 'name' : 'description'
        });
      }
    });

    // Sort results by relevance (exact matches first)
    searchResults.sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(lowerQuery);
      const bExact = b.title.toLowerCase().startsWith(lowerQuery);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  };

  // Handle search input changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, members, tasks, documents, transactions, programmes]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      }
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    onOpenChange(false);
    setSearchTerm('');
    setResults([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'transaction': return 'bg-yellow-100 text-yellow-800';
      case 'programme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members, tasks, documents, transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchTerm && (
            <div className="mt-4 space-y-1 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{searchTerm}"</p>
                </div>
              ) : (
                results.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {result.icon}
                        <div>
                          <p className="font-medium text-sm">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(result.type)}>
                        {result.type}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="mt-4 text-center text-muted-foreground">
              <Command className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Start typing to search across all your church data
              </p>
              <p className="text-xs mt-1">
                Use ↑↓ to navigate and Enter to select
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
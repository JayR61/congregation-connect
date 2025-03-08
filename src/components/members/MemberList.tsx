
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Users, Edit, Trash } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Member } from '@/types';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onEdit }) => {
  const navigate = useNavigate();
  const { deleteMember } = useAppContext();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'prospect':
        return 'bg-blue-500';
      case 'visitor':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this member?')) {
      deleteMember(id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border rounded-md divide-y">
      {members.map((member) => (
        <div 
          key={member.id} 
          className="p-4 hover:bg-muted/50 flex items-center"
          onClick={() => navigate(`/members/${member.id}`)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1">
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(member.status)} mr-2`} />
              <h3 className="font-medium">
                {member.firstName} {member.lastName}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {member.email && (
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span>Joined: {formatDate(member.joinDate)}</span>
              </div>
              
              {member.familyIds && member.familyIds.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span>Family members: {member.familyIds.length}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(member);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => handleDelete(member.id, e)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      
      {members.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No members found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberList;

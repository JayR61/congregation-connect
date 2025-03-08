
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types';
import { Mail, Phone, Calendar, Users, Award, Crown } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const getStatusColor = (status: string | undefined) => {
    if (!status) {
      return member.isActive ? 'bg-green-500' : 'bg-gray-500';
    }
    
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

  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getPositionBadge = () => {
    if (!member.positions || member.positions.length === 0) return null;
    
    const positionTexts = member.positions.map(p => {
      const structureName = p.structure.replace('_', ' ');
      return `${p.title} (${structureName})`;
    });
    
    return (
      <div className="mt-1 flex flex-wrap gap-1">
        {positionTexts.map((text, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            <Crown className="h-3 w-3 mr-1" />
            {text}
          </Badge>
        ))}
      </div>
    );
  };

  const getCategoryBadge = () => {
    if (!member.category) return null;
    
    const getVariant = (category: string) => {
      switch (category) {
        case 'elder':
        case 'pastor':
          return 'secondary';
        case 'youth':
          return 'info';
        case 'child':
          return 'warning';
        case 'visitor':
          return 'destructive';
        case 'new':
          return 'success';
        default:
          return 'outline';
      }
    };
    
    return (
      <Badge variant={getVariant(member.category)} className="ml-2">
        {member.category}
      </Badge>
    );
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold">
            {member.firstName.charAt(0)}
            {member.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-base truncate">
                {member.firstName} {member.lastName}
                {getCategoryBadge()}
              </h3>
              <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(member.status)}`} />
            </div>
            
            {getPositionBadge()}
            
            <div className="space-y-1 text-sm mt-2">
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
              
              {((member.familyIds && member.familyIds.length > 0) || member.familyId) && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span>Family members: {member.familyIds ? member.familyIds.length : (member.familyId ? '1' : '0')}</span>
                </div>
              )}
              
              {member.structures && member.structures.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <Award className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span>{member.structures.map(s => s.replace('_', ' ')).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;

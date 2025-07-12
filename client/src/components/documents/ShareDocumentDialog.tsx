import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Document, Member } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Share, Copy, Check, Mail, Link, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const ShareDocumentDialog = ({ open, onOpenChange, document }: ShareDocumentDialogProps) => {
  const { members, shareDocument } = useAppContext();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareByEmail, setShareByEmail] = useState(false);
  const [customEmails, setCustomEmails] = useState('');

  // Generate share link when document changes
  React.useEffect(() => {
    if (document) {
      const baseUrl = window.location.origin;
      const generatedLink = `${baseUrl}/documents/shared/${document.id}`;
      setShareLink(generatedLink);
    }
  }, [document]);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedMembers([]);
      setCustomEmails('');
      setShareByEmail(false);
      setLinkCopied(false);
    }
  }, [open]);

  if (!document) return null;

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard"
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const allSharedUsers = [...selectedMembers];
    
    // Add custom email recipients (in a real app, these would be handled differently)
    if (shareByEmail && customEmails.trim()) {
      const emails = customEmails.split(',').map(email => email.trim());
      console.log('Sharing with external emails:', emails);
    }

    const success = shareDocument(document.id, allSharedUsers);
    
    if (success) {
      toast({
        title: "Document shared",
        description: `"${document.name}" has been shared with ${allSharedUsers.length} ${allSharedUsers.length === 1 ? 'person' : 'people'}`
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to share document",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share className="h-5 w-5 mr-2" />
            Share "{document.name}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Link Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4" />
              <Label className="font-medium">Share Link</Label>
            </div>
            <div className="flex space-x-2">
              <Input 
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center space-x-1"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{linkCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view the document
            </p>
          </div>

          {/* Share with Members */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <Label className="font-medium">Share with Church Members</Label>
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members available</p>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleMemberToggle(member.id)}
                    />
                    <Label htmlFor={member.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span>{member.firstName} {member.lastName}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </div>
                    </Label>
                  </div>
                ))
              )}
            </div>
            {selectedMembers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Email Sharing */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="share-by-email"
                checked={shareByEmail}
                onCheckedChange={setShareByEmail}
              />
              <Label htmlFor="share-by-email" className="flex items-center space-x-2 cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>Share via Email</span>
              </Label>
            </div>
            {shareByEmail && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter email addresses separated by commas"
                  value={customEmails}
                  onChange={(e) => setCustomEmails(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple email addresses with commas
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={selectedMembers.length === 0 && (!shareByEmail || !customEmails.trim())}
          >
            Share Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentDialog;
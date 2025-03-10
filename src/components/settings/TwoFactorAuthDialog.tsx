
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from '@/lib/toast';
import { QrCode } from 'lucide-react';

interface TwoFactorAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoFactorAuthDialog({ open, onOpenChange }: TwoFactorAuthDialogProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would verify the 2FA code
      
      toast.success("Two-factor authentication enabled successfully");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('setup');
    setVerificationCode('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {step === 'setup' 
              ? "Scan the QR code with your authenticator app to set up 2FA."
              : "Enter the 6-digit verification code from your authenticator app."}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'setup' ? (
          <div className="flex flex-col items-center py-6">
            <div className="bg-secondary border border-border p-4 rounded-lg mb-4">
              <div className="w-48 h-48 bg-muted flex items-center justify-center">
                <QrCode size={120} className="text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Can't scan the QR code? Use this secret key instead:
            </p>
            <code className="bg-muted px-3 py-1 rounded text-sm font-mono select-all">
              ABCD EFGH IJKL MNOP
            </code>
            <Button 
              className="mt-6" 
              onClick={() => setStep('verify')}
            >
              I've scanned the QR code
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  value={verificationCode}
                  onChange={setVerificationCode}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('setup')}
              >
                Back
              </Button>
              <Button 
                type="button" 
                onClick={handleVerify} 
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Copy, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

const TwoFactorAuthDialog = () => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState("");
  const [open, setOpen] = useState(false);
  const [recoveryKeys, setRecoveryKeys] = useState<string[]>([]);
  
  // This would be provided by the backend in a real app
  const mockQrCodeUrl = "data:image/png;base64,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";
  
  // Generate mock recovery keys
  const generateRecoveryKeys = () => {
    const keys = [];
    for (let i = 0; i < 10; i++) {
      keys.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return keys;
  };
  
  const handleSetup = () => {
    setRecoveryKeys(generateRecoveryKeys());
    setStep('verify');
  };
  
  const handleVerify = () => {
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    
    // In a real app, this would validate with the backend
    toast.success("Two-factor authentication enabled successfully");
    setOpen(false);
    resetForm();
  };
  
  const handleCopyRecoveryKeys = () => {
    navigator.clipboard.writeText(recoveryKeys.join('\n'))
      .then(() => toast.success("Recovery keys copied to clipboard"))
      .catch(() => toast.error("Failed to copy recovery keys"));
  };
  
  const resetForm = () => {
    setStep('setup');
    setVerificationCode("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Shield className="mr-2 h-4 w-4" /> Enable Two-Factor Authentication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account
          </DialogDescription>
        </DialogHeader>
        
        {step === 'setup' ? (
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).
            </p>
            <div className="flex justify-center">
              <img src={mockQrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-sm text-muted-foreground">
              If you can't scan the QR code, you can manually enter this code into your app:
            </p>
            <div className="bg-muted p-2 rounded text-center font-mono">
              HDYT72JSLA89POW3
            </div>
            <Button onClick={handleSetup} className="w-full">Continue</Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Enter the 6-digit code from your app</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                placeholder="000000"
                className="text-center text-xl tracking-widest"
              />
            </div>
            
            <div className="border p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Recovery Keys</h4>
                <Button variant="ghost" size="sm" onClick={handleCopyRecoveryKeys}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Save these recovery keys in a secure place. You'll need them if you lose access to your device.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {recoveryKeys.map((key, index) => (
                  <div key={index} className="font-mono text-xs bg-background p-1 rounded border">
                    {key}
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('setup')} type="button">
                <RefreshCw className="mr-2 h-4 w-4" /> Generate New QR
              </Button>
              <Button onClick={handleVerify}>Verify & Enable</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthDialog;

import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { Card } from "@/components/ui";

export default function ProfileSetupPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <ProfileForm />
      </Card>
    </div>
  );
}

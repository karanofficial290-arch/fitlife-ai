import { ComingSoon } from '@/components/ui/ComingSoon';
import { Screen } from '@/components/ui/Screen';

export default function ProgressScreen() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ComingSoon
        icon="stats-chart-outline"
        title="Progress tracking jald aa raha hai"
        description="Weight history, goals aur weekly/monthly charts milestone M4 mein bante hain."
      />
    </Screen>
  );
}

import { ComingSoon } from '@/components/ui/ComingSoon';
import { Screen } from '@/components/ui/Screen';

export default function DietScreen() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ComingSoon
        icon="nutrition-outline"
        title="Diet tracking jald aa raha hai"
        description="Food search, meal logging, calories aur macros milestone M3 mein bante hain."
      />
    </Screen>
  );
}

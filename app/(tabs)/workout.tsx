import { ComingSoon } from '@/components/ui/ComingSoon';
import { Screen } from '@/components/ui/Screen';

export default function WorkoutScreen() {
  return (
    <Screen edges={['top', 'left', 'right']}>
      <ComingSoon
        icon="barbell-outline"
        title="Workouts jald aa rahe hain"
        description="Exercise library, workout plans, timer aur history milestone M2 mein bante hain."
      />
    </Screen>
  );
}

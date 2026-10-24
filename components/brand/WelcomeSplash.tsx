import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

// Owner-supplied launch artwork (cropped from their design, static bar removed).
const ART = require('../../assets/splash/welcome.jpg');
const ART_ASPECT = 730 / 1354;

// Position of the loading bar inside the artwork, measured from the design.
const BAR = { left: '32.05%', width: '36.03%', top: '87.52%' } as const;
const LIME = '#BAF750';
const TRACK = '#272D31';
export const SPLASH_BACKGROUND = '#030604';

type Props = {
  /** When true the bar completes, then `onDone` is called. */
  ready: boolean;
  onDone: () => void;
};

/** Full-screen FITMXO welcome shown while the saved session is restored. */
export function WelcomeSplash({ ready, onDone }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Fill most of the bar while loading.
  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 0.85,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [progress]);

  // Finish the bar and fade out once the app is ready.
  useEffect(() => {
    if (!ready) return;
    const anim = Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: false }),
    ]);
    anim.start(({ finished }) => {
      if (finished) doneRef.current();
    });
    return () => anim.stop();
  }, [ready, progress, opacity]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View
      style={[styles.root, { opacity }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="FITMXO. Build your best self. Loading"
    >
      <View style={styles.art}>
        <Image source={ART} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
        <View style={[styles.track, { left: BAR.left, width: BAR.width, top: BAR.top }]}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: SPLASH_BACKGROUND, justifyContent: 'center' },
  art: { width: '100%', aspectRatio: ART_ASPECT, maxHeight: '100%', alignSelf: 'center' },
  track: { position: 'absolute', height: 5, borderRadius: 3, backgroundColor: TRACK, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: LIME },
});

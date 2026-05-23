import { useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, Spacing } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PHASE_COLS = 3;
const PHASE_ITEM_WIDTH = (SCREEN_WIDTH - Spacing.four * 2) / PHASE_COLS;
const CIRCLE_SIZE = 68;

const PHASES = [
  { id: '1', label: 'Phase 1', emoji: '🌱' },
  { id: '2', label: 'Phase 2', emoji: '🌿' },
  { id: '3', label: 'Phase 3', emoji: '🌸' },
  { id: '4', label: 'Phase 4', emoji: '💊' },
  { id: '5', label: 'Phase 5', emoji: '💪' },
  { id: '6', label: 'Phase 6', emoji: '🌟' },
];

function SingpassButton() {
  return (
    <TouchableOpacity style={styles.singpassButton} activeOpacity={0.7}>
      <Image
        source={require('@/assets/images/singpass-logo.png')}
        style={styles.singpassImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

function PhaseGrid() {
  return (
    <View style={styles.phaseGrid}>
      {PHASES.map((phase) => (
        <TouchableOpacity
          key={phase.id}
          style={styles.phaseItem}
          activeOpacity={0.75}
          onPress={() =>
            Alert.alert('Coming Soon', `${phase.label} is on its way! Stay tuned.`)
          }>
          <View style={styles.phaseCircle}>
            <Text style={styles.phaseEmoji}>{phase.emoji}</Text>
          </View>
          <Text style={styles.phaseLabel}>{phase.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const EVENTS = [
  {
    id: '1',
    title: 'Tee for Pink Charity Golf & Dinner',
    date: 'May 8, 2026',
    description:
      "The 12th edition of this flagship golf charity event was held recently. Golfers teed off and raised vital funds to support BCF's community programmes at Tanah Merah Country Club (Tampines Course).",
    emoji: '⛳',
    color: '#FDE8EE',
  },
];

function UpcomingEvents() {
  const router = useRouter();
  return (
    <View style={styles.eventsSection}>
      <View style={styles.eventsSectionHeader}>
        <Text style={styles.eventsSectionTitle}>Upcoming Events</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/events')}>
          <Text style={styles.eventsSeeAll}>See all →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsScroll}>
        {EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            activeOpacity={0.85}
            onPress={() => Alert.alert(event.title, event.description)}>
            <View style={[styles.eventImageBox, { backgroundColor: event.color }]}>
              <Text style={styles.eventEmoji}>{event.emoji}</Text>
            </View>
            <View style={styles.eventBody}>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.eventDescription} numberOfLines={3}>
                {event.description}
              </Text>
            </View>
            <Text style={styles.eventArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function AudioButton() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.audioSection}>
      <Text style={styles.sectionLabel}>How are you feeling today?</Text>
      <View style={styles.audioWrapper}>
        <Animated.View style={[styles.pulseRing, ringStyle]} />
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            style={styles.audioButton}
            activeOpacity={0.85}
            onPress={() => Alert.alert('Voice Check-in', 'Your voice agent is on its way!')}
          />
        </Animated.View>
      </View>
      <Text style={styles.audioStatus}>Tap to speak</Text>
    </View>
  );
}

function DoctorButton() {
  return (
    <TouchableOpacity
      style={styles.doctorButton}
      activeOpacity={0.85}
      onPress={() =>
        Alert.alert('Sent!', 'Your update has been sent to Dr. May.')
      }>
      <View style={styles.doctorAvatar}>
        <Text style={styles.doctorAvatarText}>M</Text>
      </View>
      <View style={styles.doctorTextGroup}>
        <Text style={styles.doctorSendLabel}>Send update to</Text>
        <Text style={styles.doctorName}>Doctor May</Text>
      </View>
      <Text style={styles.doctorArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.appName}>betwin</Text>
            <Text style={styles.tagline}>navigate the moments between care</Text>
          </View>
          <SingpassButton />
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Welcome Back Sam!</Text>

        {/* Phase grid */}
        <PhaseGrid />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Audio */}
        <AudioButton />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Doctor */}
        <DoctorButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.blush,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  singpassButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  singpassImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: BrandColors.hotPink,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: BrandColors.charcoal,
    opacity: 0.6,
    fontWeight: '500',
    marginTop: -2,
  },

  // Greeting
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },

  // Phase grid
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  phaseItem: {
    width: PHASE_ITEM_WIDTH,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: 6,
  },
  phaseCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 118, 138, 0.18)',
  },
  phaseEmoji: {
    fontSize: 30,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.charcoal,
    textAlign: 'center',
    marginTop: 2,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(201, 64, 96, 0.1)',
    marginHorizontal: -Spacing.four,
  },

  // Audio
  audioSection: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.charcoal,
  },
  audioWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BrandColors.softRose,
    opacity: 0.4,
  },
  audioButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: BrandColors.softRose,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.hotPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  audioStatus: {
    fontSize: 13,
    fontWeight: '500',
    color: BrandColors.charcoal,
    opacity: 0.6,
  },

  // Doctor button
  doctorButton: {
    backgroundColor: BrandColors.deepRose,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: BrandColors.deepRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  doctorTextGroup: {
    flex: 1,
  },
  doctorSendLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '500',
  },
  doctorName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  doctorArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 26,
    fontWeight: '400',
  },

  // Upcoming Events
  eventsSection: {
    gap: Spacing.two,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventsSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },
  eventsSeeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.deepRose,
  },
  eventsScroll: {
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  eventCard: {
    width: SCREEN_WIDTH - Spacing.four * 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  eventImageBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventEmoji: {
    fontSize: 30,
  },
  eventBody: {
    flex: 1,
    gap: 3,
  },
  eventDate: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.deepRose,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.charcoal,
    lineHeight: 19,
  },
  eventDescription: {
    fontSize: 12,
    color: BrandColors.charcoal,
    opacity: 0.6,
    lineHeight: 17,
  },
  eventArrow: {
    fontSize: 22,
    color: BrandColors.softRose,
    alignSelf: 'center',
    fontWeight: '400',
  },
});

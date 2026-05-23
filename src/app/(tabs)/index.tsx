import { useEffect } from 'react';
import {
  Alert,
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
import useProfile, { VOICE_STATE_COLORS, VoiceState } from '@/hooks/useProfile';

const CIRCLE_SIZE = 68;

const PHASE_EMOJIS = ['🌱', '🌿', '🌸', '💊', '💪', '🌟', '💆', '🌺', '🤝'];

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

// ─── Singpass Button ──────────────────────────────────────────────────────────

function SingpassButton({ initials }: { initials: string }) {
  return (
    <TouchableOpacity style={styles.singpassButton} activeOpacity={0.7}>
      <Image
        source={require('@/assets/images/singpass-logo.png')}
        style={styles.singpassImage}
        resizeMode="cover"
      />
      {/* Initials badge overlaid at bottom-right of button */}
      <View style={styles.singpassBadge}>
        <Text style={styles.singpassBadgeText}>{initials.charAt(0)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Phase Grid ───────────────────────────────────────────────────────────────

type Phase = { id: string; moduleKey: string; label: string; score: number };

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const scoreColor =
    phase.score >= 75 ? '#00e676'
    : phase.score >= 40 ? BrandColors.softRose
    : 'rgba(201,64,96,0.18)';

  return (
    <TouchableOpacity
      style={styles.phaseItem}
      activeOpacity={0.75}
      onPress={() =>
        Alert.alert(
          `Phase ${phase.id} — ${phase.label}`,
          `Your progress: ${phase.score}%\n\nFull feature coming soon!`,
        )
      }>
      <View style={styles.phaseCircle}>
        <Text style={styles.phaseEmoji}>{PHASE_EMOJIS[index]}</Text>
        {/* Score bar along bottom edge */}
        <View style={styles.scoreBarTrack}>
          <View
            style={[
              styles.scoreBarFill,
              { width: `${phase.score}%` as any, backgroundColor: scoreColor },
            ]}
          />
        </View>
      </View>
      <Text style={styles.phaseLabel}>{phase.label}</Text>
    </TouchableOpacity>
  );
}

// ─── Upcoming Events ──────────────────────────────────────────────────────────

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

// ─── Audio / Voice Button ─────────────────────────────────────────────────────

function AudioButton({
  voiceState,
  subtitles,
  onPress,
}: {
  voiceState: VoiceState;
  subtitles: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);
  const orbColor = VOICE_STATE_COLORS[voiceState];
  const isActive = voiceState !== 'idle';

  // Breathing pulse — always running; amplitude grows when active
  useEffect(() => {
    const expandTo = isActive ? 1.2 : 1.12;
    const shrinkTo = isActive ? 0.92 : 0.9;
    const dur = isActive ? 700 : 900;

    scale.value = withRepeat(
      withSequence(
        withTiming(expandTo, { duration: dur, easing: Easing.inOut(Easing.ease) }),
        withTiming(shrinkTo, { duration: dur, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(isActive ? 0.55 : 0.35, { duration: dur }),
        withTiming(isActive ? 0.2 : 0.15, { duration: dur }),
      ),
      -1,
      false,
    );
  }, [isActive]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.audioSection}>
      <Text style={styles.sectionLabel}>Empathetic Dialogue Connection</Text>
      <View style={styles.audioWrapper}>
        <Animated.View style={[styles.pulseRing, ringStyle, { backgroundColor: orbColor }]} />
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            style={[
              styles.audioButton,
              {
                backgroundColor: orbColor,
                shadowColor: orbColor,
                position: 'relative',
                overflow: 'hidden',
              },
            ]}
            activeOpacity={0.85}
            onPress={onPress}
          >
            {/* Glossy reflection lens to give it 3D spherical depth */}
            <View
              style={{
                position: 'absolute',
                top: 6,
                left: 12,
                width: 24,
                height: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.42)',
                borderRadius: 12,
                transform: [{ rotate: '-15deg' }],
              }}
            />
            {/* Concentric glowing inner core overlay for high quality styling */}
            <View
              style={{
                position: 'absolute',
                width: '60%',
                height: '60%',
                borderRadius: 37,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                top: '20%',
                left: '20%',
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Text style={styles.audioStatus} numberOfLines={2}>
        {subtitles}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: BrandColors.charcoal,
          opacity: 0.55,
          textAlign: 'center',
          marginTop: Spacing.one,
          fontWeight: '600',
          fontStyle: 'italic',
          paddingHorizontal: Spacing.four,
          lineHeight: 15,
        }}
      >
        ✨ Real-time telemetry: parsed voices are dynamically scoring the 5 Core Pillars on your Patient Profile dashboard.
      </Text>
    </View>
  );
}


// ─── Doctor Button ────────────────────────────────────────────────────────────

function DoctorButton({
  name,
  title,
  onPress,
}: {
  name: string;
  title: string;
  onPress: () => void;
}) {
  const initial = name.replace('Dr. ', '').charAt(0);
  return (
    <TouchableOpacity style={styles.doctorButton} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.doctorAvatar}>
        <Text style={styles.doctorAvatarText}>{initial}</Text>
      </View>
      <View style={styles.doctorTextGroup}>
        <Text style={styles.doctorSendLabel}>Send update to</Text>
        <Text style={styles.doctorName}>{name}</Text>
        <Text style={styles.doctorTitle} numberOfLines={1}>{title}</Text>
      </View>
      <Text style={styles.doctorArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { user, phases, voiceState, subtitles, toggleVoiceSession, doctor, elo } =
    useProfile();

  const firstName = user.displayName.split(' ')[0];

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
          <SingpassButton initials={user.photoInitials} />
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Welcome Back, {firstName}!</Text>
          <View style={styles.eloBadge}>
            <Text style={styles.eloText}>⭐ {elo}</Text>
          </View>
        </View>

        {/* Phase grid */}
        <View style={styles.phaseGrid}>
          {phases.map((phase, i) => (
            <PhaseCard key={phase.id} phase={phase} index={i} />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Audio / Voice */}
        <AudioButton
          voiceState={voiceState}
          subtitles={subtitles}
          onPress={toggleVoiceSession}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Doctor */}
        <DoctorButton
          name={doctor.name}
          title={doctor.title}
          onPress={() =>
            Alert.alert(
              `Send to ${doctor.name}`,
              `${doctor.title}\n${doctor.hospital}\n\nYour update will be sent to ${doctor.email}.`,
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.blush,
  },
  scroll: { flex: 1 },
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
  singpassBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BrandColors.deepRose,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  singpassBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  headerText: { flex: 1 },
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
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },
  eloBadge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  eloText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },

  // Phase grid
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  phaseItem: {
    width: '33.33%',
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
    overflow: 'hidden',
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 118, 138, 0.18)',
  },
  phaseEmoji: { fontSize: 30 },
  scoreBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(201,64,96,0.08)',
  },
  scoreBarFill: {
    height: 4,
    borderRadius: 2,
  },
  phaseLabel: {
    fontSize: 11,
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

  // Upcoming Events
  eventsSection: { gap: Spacing.two },
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
  eventsScroll: { gap: Spacing.three, paddingVertical: Spacing.one },
  eventCard: {
    width: '100%',
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
  eventEmoji: { fontSize: 30 },
  eventBody: { flex: 1, gap: 3 },
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

  // Audio section
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
    opacity: 0.4,
  },
  audioButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    shadowColor: BrandColors.hotPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  audioStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
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
  doctorTextGroup: { flex: 1 },
  doctorSendLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '500',
  },
  doctorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  doctorTitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  doctorArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 26,
    fontWeight: '400',
  },
});

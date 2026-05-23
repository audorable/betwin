import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { BrandColors, Spacing } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = (SCREEN_WIDTH - Spacing.four * 2) / 7;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CalEvent = {
  id: string;
  title: string;
  day: number;
  month: number;
  year: number;
  description: string;
  emoji: string;
  color: string;
};

const ALL_EVENTS: CalEvent[] = [
  {
    id: '1',
    title: 'Tee for Pink Charity Golf & Dinner',
    day: 8,
    month: 4,
    year: 2026,
    description: "The 12th edition of this flagship golf charity event. Golfers teed off and raised vital funds to support BCF's community programmes at Tanah Merah Country Club (Tampines Course).",
    emoji: '⛳',
    color: '#FDE8EE',
  },
  {
    id: '2',
    title: 'Survivor Support Group',
    day: 15,
    month: 4,
    year: 2026,
    description: 'Monthly gathering for breast cancer survivors to share experiences, find support, and connect with BCF counsellors in a warm, safe space.',
    emoji: '🎀',
    color: '#FCE4EC',
  },
  {
    id: '3',
    title: 'Oncology Wellness Workshop',
    day: 22,
    month: 4,
    year: 2026,
    description: 'A half-day workshop covering nutrition, mindfulness, and gentle movement — designed for patients currently in treatment.',
    emoji: '🌸',
    color: '#FDE8EE',
  },
  {
    id: '4',
    title: 'Pink Ribbon Survivor Walk',
    day: 29,
    month: 4,
    year: 2026,
    description: 'Join survivors and supporters for a 3km walk around the Bay. Free to register, all fitness levels welcome.',
    emoji: '🎗',
    color: '#FCE4EC',
  },
];

function eventsForDay(day: number, month: number, year: number) {
  return ALL_EVENTS.filter(e => e.day === day && e.month === month && e.year === year);
}

function eventsForMonth(month: number, year: number) {
  return ALL_EVENTS.filter(e => e.month === month && e.year === year);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function Calendar({
  year,
  month,
  onMonthChange,
}: {
  year: number;
  month: number;
  onMonthChange: (y: number, m: number) => void;
}) {
  const today = new Date();
  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const goBack = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };
  const goForward = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  return (
    <View style={styles.calendar}>
      {/* Month nav */}
      <View style={styles.calNav}>
        <TouchableOpacity onPress={goBack} style={styles.navBtn}>
          <Text style={styles.navChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.calMonthLabel}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={goForward} style={styles.navBtn}>
          <Text style={styles.navChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View style={styles.dayHeaderRow}>
        {DAY_LABELS.map((l, i) => (
          <View key={i} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{l}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.daysGrid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e${i}`} style={styles.dayCell} />;

          const dayEvents = eventsForDay(day, month, year);
          const hasEvent = dayEvents.length > 0;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <View key={`d${day}`} style={styles.dayCell}>
              <View style={[styles.dayNumWrap, isToday && styles.todayCircle]}>
                <Text style={[styles.dayNumText, isToday && styles.todayNumText]}>
                  {day}
                </Text>
              </View>
              {hasEvent && (
                <Text style={styles.sticker}>{dayEvents[0].emoji}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function EventBanner({ event }: { event: CalEvent }) {
  return (
    <TouchableOpacity
      style={styles.banner}
      activeOpacity={0.85}
      onPress={() => Alert.alert(event.title, event.description)}>
      <View style={[styles.bannerIconBox, { backgroundColor: event.color }]}>
        <Text style={styles.bannerEmoji}>{event.emoji}</Text>
      </View>
      <View style={styles.bannerBody}>
        <Text style={styles.bannerDate}>
          {MONTH_NAMES[event.month].slice(0, 3).toUpperCase()} {event.day}
        </Text>
        <Text style={styles.bannerTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.bannerDesc} numberOfLines={2}>
          {event.description}
        </Text>
      </View>
      <Text style={styles.bannerArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4);

  const monthEvents = eventsForMonth(calMonth, calYear);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
        </View>

        {/* Calendar card */}
        <View style={styles.calendarCard}>
          <Calendar
            year={calYear}
            month={calMonth}
            onMonthChange={(y, m) => {
              setCalYear(y);
              setCalMonth(m);
            }}
          />
        </View>

        {/* This month's events */}
        <Text style={styles.sectionTitle}>
          {MONTH_NAMES[calMonth]} {calYear}
        </Text>

        {monthEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events this month.</Text>
        ) : (
          <View style={styles.bannerList}>
            {monthEvents.map(event => (
              <EventBanner key={event.id} event={event} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.blush,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  backChevron: {
    fontSize: 22,
    color: BrandColors.deepRose,
    lineHeight: 26,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },

  // Calendar card
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Spacing.three,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  calendar: {
    gap: Spacing.two,
  },

  // Month navigation
  calNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navChevron: {
    fontSize: 24,
    color: BrandColors.deepRose,
    fontWeight: '400',
  },
  calMonthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },

  // Day headers
  dayHeaderRow: {
    flexDirection: 'row',
  },
  dayHeaderCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.softRose,
    textTransform: 'uppercase',
  },

  // Day grid
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 5,
    gap: 2,
  },
  dayNumWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: BrandColors.deepRose,
  },
  dayNumText: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.charcoal,
  },
  todayNumText: {
    color: '#fff',
    fontWeight: '700',
  },
  sticker: {
    fontSize: 13,
    lineHeight: 15,
  },

  // Section title
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },

  emptyText: {
    fontSize: 14,
    color: BrandColors.charcoal,
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },

  // Event banners
  bannerList: {
    gap: Spacing.three,
  },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerEmoji: {
    fontSize: 26,
  },
  bannerBody: {
    flex: 1,
    gap: 3,
  },
  bannerDate: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.deepRose,
    letterSpacing: 0.6,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.charcoal,
    lineHeight: 19,
  },
  bannerDesc: {
    fontSize: 12,
    color: BrandColors.charcoal,
    opacity: 0.55,
    lineHeight: 17,
  },
  bannerArrow: {
    fontSize: 22,
    color: BrandColors.softRose,
    fontWeight: '300',
  },
});

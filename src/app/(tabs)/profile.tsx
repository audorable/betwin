import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, Spacing } from '@/constants/theme';
import useProfile from '@/hooks/useProfile';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Premium clinical Python/NLP scripting bank for each of the 5 Core Pillars
const CLINICAL_CODE_BANK: Record<string, string> = {
  cognitive: `# Outpatient Cognitive Processing & Jargon NLP Parser
import clinical_nlp as nlp

reflection = nlp.ingest(patient_vocal_logs)
overload_score = nlp.sentiment.vader(reflection)["compound"]

# Map medical jargon against information overload index
cognitive_clarity = nlp.metrics.cognitive_pacing(reflection)
print(f"Cognitive Clarity Status: STABLE (Quotient: {cognitive_clarity:.2f})")`,
  body: `# Body Self-Compassion & Surgical Recovery Analysis
import body_nlp as nlp

grief_indices = nlp.extract_emotions(mastectomy_reflection)["grief"]
pacing_factor = nlp.pacing.calculate_diaphragmatic_rate()

# Model self-compassion against surgical body changes
compassion_score = sum(grief_indices) * pacing_factor
print(f"Body Image Recovery Efficacy: OPTIMAL ({compassion_score:.2f})")`,
  distress: `# Chemotherapy Side Effect & Distress Tolerances
from clinical_diagnostics import SomaticMonitor

somatic = SomaticMonitor(fatigue_level, nausea_level)
calming_pacing = somatic.measure_paced_breathing()

# Calculate physical distress mitigation threshold
mitigation_quotient = somatic.integrate_comfort(calming_pacing)
print(f"Somatic Comfort Buffer: ACTIVE (Mitigation: {mitigation_quotient:.2f})")`,
  caregiver: `# Encrypted Caregiver WhatsApp Dispatch Pipeline
from secure_sync import WhatsAppGateway, aes_256

payload = aes_256.encrypt(patient_telemetry_scores)
gateway = WhatsAppGateway(authorized=True, caregiver="David Lim")

# Dispatch secure SMS notification to spouse/family
gateway.dispatch(payload)
print("Caregiver WhatsApp Update Sync: COMPILING & SENT SUCCESSFULLY")`,
  safety: `# Trauma-Informed Clinical Safety Guardrail
from safety_guardrails import RiskAnalyzer, EmergencyRouter

analyzer = RiskAnalyzer(vocal_reflection_logs)
risk_factor = analyzer.score_suicide_ideation()

if risk_factor > 0.75:
    EmergencyRouter.route_to_helpline("SOS_1767")
print("Safety Escalation Gateways: STANDBY (No immediate risk detected)")`,
};

export default function ProfileScreen() {
  const {
    user,
    elo,
    pillars,
    voiceState,
    doctor,
    selectedPersonaId,
    setSelectedPersonaId,
    allPersonas
  } = useProfile();
  
  const [activePillarKey, setActivePillarKey] = useState('cognitive');
  const [typedCode, setTypedCode] = useState('');
  
  const activePillar = pillars.find(p => p.key === activePillarKey) || pillars[0];
  const clinicalCode = CLINICAL_CODE_BANK[activePillarKey] || '';

  // Typewriter effect inside the Clinical NLP Console
  useEffect(() => {
    setTypedCode('');
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < clinicalCode.length) {
        setTypedCode(prev => prev + clinicalCode.charAt(idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [activePillarKey]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Horizontal Persona Selector Row */}
        <View style={styles.personaSelectorContainer}>
          <Text style={styles.selectorLabel}>🔬 TARGET PATIENT & CAREGIVER PROFILE (PERSONA SELECTOR):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personaSelectorScroll}>
            {allPersonas.map((p) => {
              const isActive = p.id === selectedPersonaId;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.personaBadge, isActive && styles.activePersonaBadge]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedPersonaId(p.id);
                    setActivePillarKey(p.activePersonaKey);
                  }}
                >
                  <Text style={[styles.personaBadgeText, isActive && styles.activePersonaBadgeText]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Clinician Header Stats Dock */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileMetaRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user.displayName.split(' ').map(n=>n[0]).join('')}</Text>
            </View>
            <View style={styles.metaGroup}>
              <View style={styles.nameRow}>
                <Text style={styles.patientName}>{user.displayName}</Text>
                <View style={styles.singpassGovBadge}>
                  <Text style={styles.singpassGovText}>🇸🇬 GovTech Sync</Text>
                </View>
              </View>
              <Text style={styles.patientSubInfo}>{user.ethnicity} | {user.stage}</Text>
              <Text style={styles.patientNotesText}>{user.notes}</Text>
            </View>
          </View>
          
          <View style={styles.dividerLight} />
          
          <View style={styles.statsMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>⭐ {elo}</Text>
              <Text style={styles.metricLabel}>Resilience Quotient</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>AES-256</Text>
              <Text style={styles.metricLabel}>Security Protocol</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue} style={{ color: '#00e676', fontWeight: '800' }}>Active</Text>
              <Text style={styles.metricLabel}>Dialogue Pipeline</Text>
            </View>
          </View>
        </View>

        {/* Telemetry Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>📊 CLINICIAN OUTPATIENT TELEMETRY</Text>
          <Text style={styles.sectionSubtitle}>5 Core Clinical Literature Pillars</Text>
        </View>

        {/* 5-Pillar Diagnostics Telemetry Grid */}
        <View style={styles.pillarsGrid}>
          {pillars.map((pillar) => {
            const isActive = pillar.key === activePillarKey;
            const isExcellent = pillar.score >= 75;
            const isWarning = pillar.score > 0 && pillar.score < 45;
            
            let barColor = BrandColors.hotPink;
            if (isExcellent) barColor = '#00e676';
            else if (isWarning) barColor = '#f59e0b';
            
            return (
              <TouchableOpacity
                key={pillar.id}
                style={[
                  styles.pillarCard,
                  isActive && styles.activePillarCard,
                ]}
                activeOpacity={0.8}
                onPress={() => setActivePillarKey(pillar.key)}
              >
                <View style={styles.pillarCardHeader}>
                  <Text style={styles.pillarIcon}>{pillar.icon}</Text>
                  <Text style={[styles.pillarScoreText, isActive && { color: BrandColors.hotPink }]}>
                    {pillar.score}%
                  </Text>
                </View>
                
                <Text style={[styles.pillarLabel, isActive && styles.activePillarLabel]} numberOfLines={1}>
                  {pillar.label.split(': ')[1]}
                </Text>
                
                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pillar.score}%` as any, backgroundColor: barColor },
                    ]}
                  />
                </View>
                
                {isActive && <View style={styles.activePulsingIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed Information & Math Console for the Active Pillar */}
        <View style={styles.activePillarDetailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsIcon}>{activePillar.icon}</Text>
            <View style={styles.detailsHeaderTexts}>
              <Text style={styles.detailsTitle}>{activePillar.label.toUpperCase()}</Text>
              <Text style={styles.detailsSubtitle}>{activePillar.description}</Text>
            </View>
          </View>
          
          <View style={styles.dividerLight} />

          {/* Research Integration Notice Panel (Wolfram, SingHealth, Johns Hopkins) */}
          <View style={styles.integrationNoticeBox}>
            <Text style={styles.integrationLabel}>🔬 RESEARCH PIPELINE EXPORT GATE</Text>
            <Text style={styles.integrationText}>
              This clinical machine learning pipeline can be securely exported and fed directly into leading international research institutions—including <Text style={{ fontWeight: '700', color: BrandColors.hotPink }}>Wolfram Research</Text>, <Text style={{ fontWeight: '700', color: BrandColors.hotPink }}>SingHealth (Singapore)</Text>, and <Text style={{ fontWeight: '700', color: BrandColors.hotPink }}>Johns Hopkins Medicine</Text>—to study patient recovery trends and optimize outpatient care pacing.
            </Text>
          </View>

          {/* Dynamic Clinical NLP Code Console */}
          <View style={styles.wolframConsoleBox}>
            <View style={styles.consoleHeaderBar}>
              <View style={styles.windowControls}>
                <View style={[styles.winDot, { backgroundColor: '#ef4444' }]} />
                <View style={[styles.winDot, { backgroundColor: '#f59e0b' }]} />
                <View style={[styles.winDot, { backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.consoleTitle}>CLINICAL NLP SYMPTOM PARSER // MACHINE LEARNING PIPELINE</Text>
            </View>
            <View style={styles.consoleBody}>
              <Text style={styles.consoleCodeText}>
                {typedCode}
                <Text style={styles.terminalCursor}>█</Text>
              </Text>
            </View>
          </View>

          {/* Derived Scientific Formula */}
          <View style={styles.formulaSection}>
            <Text style={styles.formulaLabel}>SYSTEMIC ALGORITHMIC FORMULA:</Text>
            <View style={styles.formulaCodeBox}>
              <Text style={styles.formulaText}>{activePillar.formula}</Text>
            </View>
            <Text style={styles.formulaBounds}>
              🎯 ESCALATION BOUNDS: {activePillar.bounds}
            </Text>
          </View>
        </View>

        {/* Simulated Live Secure Transmission Terminal Feed */}
        <View style={styles.terminalFeedCard}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>🔒 SECURE TRANSMISSION CHANNEL DIALOG LOGS</Text>
            <View style={styles.onlineBadgeRow}>
              <View style={styles.onlineCircle} />
              <Text style={styles.onlineText}>ONLINE</Text>
            </View>
          </View>
          
          <View style={styles.feedBody}>
            <Text style={styles.feedLogLine}>[08:44:12] [SYSTEM] Secure local Pacing and Diaphragm calibrator complete (0.88x speed).</Text>
            <Text style={styles.feedLogLine}>[08:44:15] [SYSTEM] Handshaking with Singapore GovTech OAuth Gateway...</Text>
            <Text style={styles.feedLogLine}>[08:44:16] [SECURITY] AES-256 Military Encryption layer injected successfully.</Text>
            <Text style={styles.feedLogLine} style={{ color: '#00e676' }}>[08:45:01] [TELEMETRY] Securing EHR diagnostics updates for {doctor.name}...</Text>
            <Text style={styles.feedLogLine} style={{ color: '#00b8d4' }}>[08:45:03] [TELEMETRY] Syncing outpatient companion cards to Cloud Firestore.</Text>
            {voiceState === 'listening' && (
              <Text style={styles.feedLogLine} style={{ color: '#26a69a' }}>[08:45:10] [VOICE] Dialogue channel active. Listening for physical symptoms...</Text>
            )}
            {voiceState === 'speaking' && (
              <Text style={styles.feedLogLine} style={{ color: BrandColors.hotPink }}>[08:45:12] [VOICE] Streaming empathetic speech synthesis directly to patient.</Text>
            )}
          </View>
        </View>

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
    paddingBottom: Spacing.five,
    gap: 16,
  },

  // Horizontal Persona Selector
  personaSelectorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginTop: Spacing.two,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    gap: 6,
  },
  selectorLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: BrandColors.deepRose,
    letterSpacing: 0.5,
  },
  personaSelectorScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  personaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FAF5F7',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 64, 96, 0.08)',
  },
  activePersonaBadge: {
    backgroundColor: BrandColors.hotPink,
    borderColor: BrandColors.hotPink,
  },
  personaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.charcoal,
  },
  activePersonaBadgeText: {
    color: '#ffffff',
  },

  // Profile Header Card
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BrandColors.blush,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.softRose,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.hotPink,
    letterSpacing: -0.5,
  },
  metaGroup: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  patientName: {
    fontSize: 19,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  singpassGovBadge: {
    backgroundColor: 'rgba(201,64,96,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(201,64,96,0.18)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  singpassGovText: {
    fontSize: 10,
    color: BrandColors.deepRose,
    fontWeight: '700',
  },
  patientSubInfo: {
    fontSize: 12,
    color: BrandColors.charcoal,
    opacity: 0.6,
    fontWeight: '600',
  },
  patientNotesText: {
    fontSize: 11,
    color: BrandColors.charcoal,
    opacity: 0.5,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 14,
  },
  dividerLight: {
    height: 1,
    backgroundColor: 'rgba(201, 64, 96, 0.08)',
    marginVertical: 14,
  },
  statsMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  metricLabel: {
    fontSize: 10,
    color: BrandColors.charcoal,
    opacity: 0.5,
    fontWeight: '600',
    marginTop: 3,
  },

  // Section Header
  sectionHeaderRow: {
    marginTop: Spacing.one,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BrandColors.hotPink,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: BrandColors.charcoal,
    opacity: 0.6,
    fontWeight: '600',
  },

  // Pillars Grid
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  pillarCard: {
    width: (SCREEN_WIDTH - Spacing.four * 2 - 8) / 2 - 2,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 64, 96, 0.08)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  activePillarCard: {
    borderColor: BrandColors.hotPink,
    backgroundColor: '#FFF5F8',
    shadowColor: BrandColors.hotPink,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  pillarCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillarIcon: {
    fontSize: 20,
  },
  pillarScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: BrandColors.charcoal,
  },
  pillarLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.charcoal,
    opacity: 0.8,
  },
  activePillarLabel: {
    color: BrandColors.hotPink,
    opacity: 1,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  activePulsingIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.hotPink,
  },

  // Active Pillar Details Card
  activePillarDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: BrandColors.softRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailsIcon: {
    fontSize: 32,
    marginTop: 2,
  },
  detailsHeaderTexts: {
    flex: 1,
    gap: 3,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: BrandColors.hotPink,
    letterSpacing: 0.3,
  },
  detailsSubtitle: {
    fontSize: 12,
    color: BrandColors.charcoal,
    opacity: 0.65,
    lineHeight: 16,
    fontWeight: '500',
  },

  // Integration Notice Box
  integrationNoticeBox: {
    backgroundColor: '#FAF5F7',
    borderWidth: 1,
    borderColor: 'rgba(201, 64, 96, 0.12)',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    gap: 4,
  },
  integrationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: BrandColors.hotPink,
    letterSpacing: 0.5,
  },
  integrationText: {
    fontSize: 11,
    color: BrandColors.charcoal,
    opacity: 0.7,
    lineHeight: 15,
    fontWeight: '500',
  },

  // Wolfram Console Box
  wolframConsoleBox: {
    backgroundColor: '#0a101d',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  consoleHeaderBar: {
    backgroundColor: '#11192a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  windowControls: {
    flexDirection: 'row',
    gap: 4,
  },
  winDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  consoleTitle: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    color: '#889eb5',
    fontWeight: '700',
  },
  consoleBody: {
    padding: 12,
    minHeight: 100,
  },
  consoleCodeText: {
    fontFamily: 'monospace',
    fontSize: 9.5,
    color: '#38bdf8',
    lineHeight: 14,
  },
  terminalCursor: {
    color: BrandColors.hotPink,
  },

  // Formula Section
  formulaSection: {
    marginTop: 14,
    gap: 6,
  },
  formulaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00e5ff',
    letterSpacing: 0.5,
  },
  formulaCodeBox: {
    backgroundColor: 'rgba(201, 64, 96, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(201, 64, 96, 0.08)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: BrandColors.charcoal,
    fontWeight: '700',
  },
  formulaBounds: {
    fontSize: 10,
    fontWeight: '800',
    color: BrandColors.hotPink,
    marginTop: 2,
  },

  // Terminal Feed Card
  terminalFeedCard: {
    backgroundColor: '#060b13',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 8,
    marginBottom: 10,
  },
  feedTitle: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#ff80ab',
    fontWeight: '700',
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00e676',
  },
  onlineText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#00e676',
    fontWeight: '700',
  },
  feedBody: {
    gap: 6,
  },
  feedLogLine: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#a0aec0',
    lineHeight: 13,
  },
});

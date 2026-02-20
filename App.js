import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Animated, Dimensions, StatusBar,
  Platform, Alert, Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();

// ─────────────────────────────────────────────
// 🎨 THEME
// ─────────────────────────────────────────────
const C = {
  bgDeep: '#0A0800',
  bgCard: '#1F1800',
  bgCardLight: '#2A2100',
  goldBright: '#FFD700',
  goldPrimary: '#F0B400',
  goldSecondary: '#C8860A',
  goldLight: '#FFE566',
  ivory: '#FFF8E7',
  ivoryDim: '#D4C090',
  textPrimary: '#FFF8E7',
  textSecondary: '#C8A84B',
  textMuted: '#7A6030',
  textDim: '#4A3A18',
  inactive: '#3A3020',
  danger: '#FF6B4A',
};

// ─────────────────────────────────────────────
// 📖 CSI TAMIL BIBLE VERSES
// ─────────────────────────────────────────────
const VERSES = [
  {
    id: 1,
    tamil: 'கர்த்தர் உங்களை ஆசீர்வதிப்பாராக; கர்த்தர் தம்முடைய முகத்தை உங்கள்மேல் பிரகாசிக்கப்பண்ணி, உங்களுக்கு அருள்புரிவாராக.',
    reference: 'எண்ணாகமம் 6:24-25',
    theme: 'ஆசீர்வாதம்',
    color: '#FFD700',
  },
  {
    id: 2,
    tamil: 'என் தேவன் தமது ஐசுவரியத்தின்படியே கிறிஸ்து இயேசுவிலுள்ள மகிமையிலே உங்கள் குறைவையெல்லாம் நிறைவாக்குவார்.',
    reference: 'பிலிப்பியர் 4:19',
    theme: 'போஷிப்பு',
    color: '#FFA500',
  },
  {
    id: 3,
    tamil: 'உன் இருதயப்பூர்வமாய்க் கர்த்தரில் நம்பிக்கையாயிரு; உன் சொந்த விவேகத்தின்மேல் சாயாதே. உன் வழிகளிலெல்லாம் அவரை நினை; அவர் உன் பாதைகளை செவ்வைப்படுத்துவார்.',
    reference: 'நீதிமொழிகள் 3:5-6',
    theme: 'வழிநடத்துதல்',
    color: '#FFB347',
  },
  {
    id: 4,
    tamil: 'தேவன் நமக்கு அடைக்கலமும் பலமுமாயிருக்கிறார்; இக்கட்டான காலங்களில் அவர் உதவி என்றும் கிடைக்கும்.',
    reference: 'சங்கீதம் 46:1',
    theme: 'பாதுகாப்பு',
    color: '#DAA520',
  },
  {
    id: 5,
    tamil: 'கர்த்தர் என் மேய்ப்பர்; எனக்கு குறைவுண்டாகாது. அவர் என்னை பசும்புல் வெளிகளில் படுக்கப்பண்ணுகிறார்; அமர்ந்த தண்ணீர்களண்டையில் என்னை நடத்துகிறார்.',
    reference: 'சங்கீதம் 23:1-2',
    theme: 'ஆறுதல்',
    color: '#C5A028',
  },
  {
    id: 6,
    tamil: 'இதோ, நான் உன்னோடிருக்கிறேன்; நீ போகிற இடமெங்கும் உன்னைக் காப்பாற்றி, இந்தத் தேசத்திற்கு உன்னை மறுபடியும் திரும்பி வரப்பண்ணுவேன்.',
    reference: 'ஆதியாகமம் 28:15',
    theme: 'தேவசாட்சி',
    color: '#E8C84A',
  },
  {
    id: 7,
    tamil: 'என்னிடத்தில் வருகிற எவனையும் நான் புறம்பே தள்ளுவதில்லை.',
    reference: 'யோவான் 6:37',
    theme: 'ஏற்றுக்கொள்ளுதல்',
    color: '#F4C430',
  },
  {
    id: 8,
    tamil: 'என்னைப் பலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்யக்கூடும்.',
    reference: 'பிலிப்பியர் 4:13',
    theme: 'வல்லமை',
    color: '#FFD700',
  },
  {
    id: 9,
    tamil: 'அவர் நம்முடைய எல்லா அக்கிரமங்களையும் மன்னித்து, நம்முடைய எல்லா வியாதிகளையும் சொஸ்தமாக்குகிறவர்.',
    reference: 'சங்கீதம் 103:3',
    theme: 'சுகமளிப்பு',
    color: '#FFA040',
  },
  {
    id: 10,
    tamil: 'கர்த்தர் சொல்லுகிறார்: நான் உங்களுக்கு நினைத்திருக்கிற நினைவுகள் நலமான நினைவுகளே, தீமையான நினைவுகளல்ல; உங்களுக்கு முன்னும் நம்பிக்கையும் கொடுக்கும்படி நினைத்திருக்கிறேன்.',
    reference: 'எரேமியா 29:11',
    theme: 'நம்பிக்கை',
    color: '#FFCC44',
  },
];

const DAYS = ['ஞா', 'தி', 'ஸோ', 'செ', 'பு', 'வி', 'ச'];
const ALARMS_KEY = '@csi_alarms_v1';

// ─────────────────────────────────────────────
// 🔔 NOTIFICATIONS SETUP
// ─────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

async function setupNotifications() {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('verse-alarm', {
      name: 'Tamil Verse Alarm',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 300, 500, 300, 500],
      lightColor: '#FFD700',
      bypassDnd: true,
    });
  }
  return true;
}

async function scheduleAlarm(alarm) {
  const [hStr, mStr] = alarm.time.split(':');
  const hour = parseInt(hStr);
  const minute = parseInt(mStr);
  const ids = [];
  const dayMap = { ஞா: 1, தி: 2, ஸோ: 3, செ: 4, பு: 5, வி: 6, ச: 7 };

  if (alarm.days.length === 0) {
    const now = new Date();
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    if (d <= now) d.setDate(d.getDate() + 1);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `✝ ${alarm.label}`,
        body: alarm.verse.tamil,
        data: { alarmId: alarm.id, verseId: alarm.verse.id, type: 'alarm', label: alarm.label },
        color: '#FFD700',
        priority: 'max',
      },
      trigger: { date: d, channelId: 'verse-alarm' },
    });
    ids.push(id);
  } else {
    for (const day of alarm.days) {
      const weekday = dayMap[day];
      if (!weekday) continue;
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `✝ ${alarm.label}`,
          body: alarm.verse.tamil,
          data: { alarmId: alarm.id, verseId: alarm.verse.id, type: 'alarm', label: alarm.label },
          color: '#FFD700',
          priority: 'max',
        },
        trigger: { weekday, hour, minute, repeats: true, channelId: 'verse-alarm' },
      });
      ids.push(id);
    }
  }
  return ids;
}

async function cancelAlarm(notifIds = []) {
  for (const id of notifIds) {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
  }
}

async function loadAlarms() {
  try {
    const raw = await AsyncStorage.getItem(ALARMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveAlarms(alarms) {
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}

// ─────────────────────────────────────────────
// ✨ HEAVENLY UI COMPONENTS
// ─────────────────────────────────────────────

function TwinkleStar({ size = 10, delay = 0 }) {
  const op = useRef(new Animated.Value(0.1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(op, { toValue: 1, duration: 700 + Math.random() * 700, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.1, duration: 700 + Math.random() * 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: C.goldLight, opacity: op,
      shadowColor: C.goldBright, shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1, shadowRadius: size,
    }} />
  );
}

function GlowCross({ size = 40 }) {
  const glow = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const bar = size * 0.12;
  return (
    <Animated.View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', opacity: glow }}>
      {/* vertical */}
      <View style={{ position: 'absolute', width: bar, height: size, borderRadius: bar / 2, backgroundColor: C.goldBright,
        shadowColor: C.goldBright, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8 }} />
      {/* horizontal */}
      <View style={{ position: 'absolute', width: size, height: bar, top: size * 0.28, borderRadius: bar / 2, backgroundColor: C.goldBright,
        shadowColor: C.goldBright, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8 }} />
    </Animated.View>
  );
}

function GoldDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: C.goldSecondary, opacity: 0.3 }} />
      <GlowCross size={14} />
      <View style={{ flex: 1, height: 1, backgroundColor: C.goldSecondary, opacity: 0.3 }} />
    </View>
  );
}

// Floating background stars layout
const BG_STARS = [
  { x: 30, y: 90, s: 7, d: 0 }, { x: 330, y: 130, s: 5, d: 400 },
  { x: 70, y: 220, s: 4, d: 900 }, { x: 350, y: 310, s: 9, d: 600 },
  { x: 15, y: 420, s: 5, d: 200 }, { x: 355, y: 490, s: 6, d: 1100 },
  { x: 160, y: 55, s: 4, d: 700 }, { x: 290, y: 170, s: 7, d: 300 },
  { x: 110, y: 580, s: 5, d: 1300 }, { x: 320, y: 620, s: 4, d: 800 },
];

function StarField() {
  return (
    <>
      {BG_STARS.map((s, i) => (
        <View key={i} style={{ position: 'absolute', left: s.x, top: s.y }}>
          <TwinkleStar size={s.s} delay={s.d} />
        </View>
      ))}
    </>
  );
}

// Gold dust particles
function GoldDust() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      x: 20 + Math.random() * (width - 60),
      y: 100 + Math.random() * (height - 200),
      size: 2 + Math.random() * 3,
      anim: new Animated.Value(0),
      op: new Animated.Value(0),
      delay: i * 400,
    }))
  ).current;

  useEffect(() => {
    particles.forEach((p) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.anim, { toValue: -60, duration: 3000 + Math.random() * 2000, useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(p.op, { toValue: 0.9, duration: 1000, useNativeDriver: true }),
              Animated.timing(p.op, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(p.anim, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(p.op, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: p.size / 2,
          backgroundColor: C.goldBright, opacity: p.op,
          transform: [{ translateY: p.anim }],
        }} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// 🏠 HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ navigation }) {
  const [alarms, setAlarms] = useState([]);
  const [now, setNow] = useState(new Date());
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    setupNotifications();
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useFocusEffect(useCallback(() => { loadAlarms().then(setAlarms); }, []));

  const toggle = async (id) => {
    const updated = await Promise.all(
      alarms.map(async (a) => {
        if (a.id !== id) return a;
        if (!a.active) {
          const ids = await scheduleAlarm({ ...a, active: true });
          return { ...a, active: true, notifIds: ids };
        } else {
          await cancelAlarm(a.notifIds);
          return { ...a, active: false };
        }
      })
    );
    setAlarms(updated);
    await saveAlarms(updated);
  };

  const del = (id) => {
    Alert.alert('அலாரம் நீக்கவும்', 'இந்த அலாரத்தை நீக்க வேண்டுமா?', [
      { text: 'இல்லை', style: 'cancel' },
      {
        text: 'ஆம்', style: 'destructive', onPress: async () => {
          const a = alarms.find((x) => x.id === id);
          if (a) await cancelAlarm(a.notifIds);
          const upd = alarms.filter((x) => x.id !== id);
          setAlarms(upd);
          await saveAlarms(upd);
        },
      },
    ]);
  };

  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'மாலை' : 'காலை';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;

  const fmtTime = (t) => {
    const [hh, mm] = t.split(':');
    const hr = parseInt(hh);
    const ap = hr >= 12 ? 'மாலை' : 'காலை';
    const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return `${String(h12).padStart(2, '0')}:${mm} ${ap}`;
  };

  return (
    <View style={s_.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgDeep} />
      <LinearGradient colors={['#0A0800', '#130D00', '#1C1500']} style={StyleSheet.absoluteFill} />
      <StarField />
      <GoldDust />
      <Animated.View style={{ flex: 1, opacity: fadeIn }}>

        {/* Header */}
        <LinearGradient colors={['rgba(20,15,0,0.98)', 'rgba(10,8,0,0.85)']} style={s_.header}>
          <View style={{ flex: 1 }}>
            <Text style={s_.appSub}>✝ சர்ச் ஆஃப் சவுத் இந்தியா</Text>
            <Text style={s_.appTitle}>வேத வசன அலாரம்</Text>
            <Text style={s_.dateText}>
              {now.toLocaleDateString('ta-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={s_.clockTime}>{h12}:{m}</Text>
              <Text style={s_.clockSec}>:{s}</Text>
            </View>
            <Text style={s_.clockAmPm}>{ampm}</Text>
          </View>
        </LinearGradient>

        <GoldDivider />

        {/* Alarm list */}
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {alarms.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 70, gap: 14 }}>
              <GlowCross size={60} />
              <Text style={{ fontSize: 20, color: C.goldBright, fontWeight: '700', marginTop: 10 }}>
                அமைதியான காலை...
              </Text>
              <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 22 }}>
                கீழுள்ள + பொத்தானை அழுத்தி{'\n'}ஒரு வேத வசன அலாரம் சேர்க்கவும்
              </Text>
            </View>
          )}

          {alarms.map((alarm) => (
            <TouchableOpacity key={alarm.id} onPress={() => navigation.navigate('Add', { alarm })} activeOpacity={0.85}>
              <LinearGradient
                colors={alarm.active ? ['#2D2300', '#1F1800'] : ['#181200', '#100D00']}
                style={[s_.alarmCard, { borderColor: alarm.active ? 'rgba(200,134,10,0.45)' : 'rgba(200,134,10,0.1)' }]}
              >
                <View style={[s_.cardBar, { backgroundColor: alarm.active ? C.goldPrimary : C.textDim }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[s_.alarmTime, !alarm.active && { color: C.textMuted }]}>
                    {fmtTime(alarm.time)}
                  </Text>
                  <Text style={[s_.alarmLabel, !alarm.active && { color: C.textDim }]}>
                    {alarm.label || 'வேத வசன அலாரம்'}
                  </Text>
                  <Text style={s_.alarmDays}>
                    {alarm.days.length > 0 ? alarm.days.join(' · ') : 'ஒரு முறை'}
                  </Text>
                  <Text style={s_.alarmRef} numberOfLines={1}>📖 {alarm.verse?.reference}</Text>
                </View>
                <View style={{ gap: 10, alignItems: 'center' }}>
                  <Switch
                    value={alarm.active}
                    onValueChange={() => toggle(alarm.id)}
                    trackColor={{ false: C.inactive, true: C.goldSecondary }}
                    thumbColor={alarm.active ? C.goldBright : '#666'}
                  />
                  <TouchableOpacity style={s_.delBtn} onPress={() => del(alarm.id)}>
                    <Ionicons name="trash-outline" size={16} color={C.danger} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom bar */}
        <LinearGradient colors={['rgba(10,8,0,0)', 'rgba(10,8,0,0.98)']} style={s_.bottomBar}>
          <TouchableOpacity style={s_.tabItem}>
            <Ionicons name="alarm" size={26} color={C.goldPrimary} />
            <Text style={[s_.tabLabel, { color: C.goldPrimary }]}>அலாரம்</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s_.fab} onPress={() => navigation.navigate('Add', { alarm: null })} activeOpacity={0.8}>
            <LinearGradient colors={[C.goldLight, C.goldPrimary, C.goldSecondary]} style={s_.fabInner}>
              <Ionicons name="add" size={34} color={C.bgDeep} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={s_.tabItem} onPress={() => navigation.navigate('Verses')}>
            <Ionicons name="book-outline" size={26} color={C.textSecondary} />
            <Text style={[s_.tabLabel, { color: C.textSecondary }]}>வசனங்கள்</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────
// ➕ ADD / EDIT ALARM SCREEN
// ─────────────────────────────────────────────
function AddScreen({ navigation, route }) {
  const existing = route?.params?.alarm || null;
  const initTime = () => {
    const d = new Date();
    if (existing?.time) {
      const [h, m] = existing.time.split(':');
      d.setHours(parseInt(h), parseInt(m), 0, 0);
    } else d.setHours(6, 0, 0, 0);
    return d;
  };
  const [time, setTime] = useState(initTime);
  const [showPicker, setShowPicker] = useState(false);
  const [label, setLabel] = useState(existing?.label || '');
  const [days, setDays] = useState(existing?.days || []);
  const [verse, setVerse] = useState(existing?.verse || VERSES[0]);
  const [snooze, setSnooze] = useState(existing?.snooze ?? true);
  const [vibrate, setVibrate] = useState(existing?.vibrate ?? true);
  const [showVerses, setShowVerses] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }).start(); }, []);

  const toggleDay = (d) => setDays((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);

  const h = time.getHours(), m = String(time.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'மாலை' : 'காலை';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;

  const save = async () => {
    const alarms = await loadAlarms();
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
    const alarm = {
      id: existing?.id || Date.now(),
      time: timeStr, label: label || 'வேத வசன அலாரம்',
      days, verse, snooze, vibrate, active: true,
    };
    const ids = await scheduleAlarm(alarm);
    alarm.notifIds = ids;
    const updated = existing ? alarms.map((a) => a.id === existing.id ? alarm : a) : [...alarms, alarm];
    await saveAlarms(updated);
    navigation.goBack();
  };

  return (
    <View style={s_.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgDeep} />
      <LinearGradient colors={['#0A0800', '#130D00', '#1C1500']} style={StyleSheet.absoluteFill} />
      <StarField />
      <Animated.View style={{ flex: 1, opacity: fadeIn }}>

        {/* Header */}
        <LinearGradient colors={['rgba(20,15,0,0.98)', 'rgba(10,8,0,0.9)']} style={[s_.header, { flexDirection: 'row', alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40 }}>
            <Ionicons name="arrow-back" size={22} color={C.goldBright} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            <GlowCross size={22} />
            <Text style={s_.appTitle}>{existing ? 'திருத்து' : 'புதிய அலாரம்'}</Text>
          </View>
          <TouchableOpacity onPress={save} style={s_.saveChip}>
            <Text style={{ color: C.goldBright, fontWeight: '700', fontSize: 14 }}>சேமி ✓</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

          {/* Time card */}
          <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.85}>
            <LinearGradient colors={['#2A2100', '#1A1300']} style={s_.timeCard}>
              <Text style={s_.bigTime}>{String(h12).padStart(2, '0')}:{m}</Text>
              <Text style={s_.bigAmPm}>{ampm}</Text>
              <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 4, letterSpacing: 1 }}>தொட்டு நேரம் மாற்றவும்</Text>
            </LinearGradient>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={time} mode="time" is24Hour={false}
              display={Platform.OS === 'android' ? 'clock' : 'spinner'}
              onChange={(e, t) => { setShowPicker(Platform.OS === 'ios'); if (t) setTime(t); }}
              themeVariant="dark"
            />
          )}

          <GoldDivider />

          {/* Label */}
          <Text style={s_.secLabel}>அலாரம் பெயர்</Text>
          <TextInput
            value={label} onChangeText={setLabel}
            placeholder="காலை வணக்கம்..." placeholderTextColor={C.textDim}
            style={s_.input}
          />

          {/* Days */}
          <Text style={[s_.secLabel, { marginTop: 16 }]}>மறுபடியும் இயக்கும் நாட்கள்</Text>
          <View style={{ flexDirection: 'row', gap: 7 }}>
            {DAYS.map((d) => (
              <TouchableOpacity
                key={d} onPress={() => toggleDay(d)}
                style={[s_.dayBtn, days.includes(d) && s_.dayBtnOn]}
              >
                {days.includes(d) && (
                  <LinearGradient colors={[C.goldLight, C.goldSecondary]} style={StyleSheet.absoluteFill} borderRadius={11} />
                )}
                <Text style={[s_.dayTxt, days.includes(d) && { color: C.bgDeep, fontWeight: '800' }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {days.length === 0 && <Text style={{ color: C.textDim, fontSize: 11, marginTop: 6, fontStyle: 'italic' }}>✦ தேர்வு இல்லை = ஒரே முறை</Text>}

          <GoldDivider />

          {/* Verse selector */}
          <Text style={s_.secLabel}>வேத வசனம் தேர்வு</Text>
          <TouchableOpacity onPress={() => setShowVerses(!showVerses)} activeOpacity={0.85}>
            <LinearGradient colors={['#2D2300', '#1F1800']} style={s_.versePreview}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <View style={[s_.chip, { backgroundColor: verse.color + '22', borderColor: verse.color + '55' }]}>
                  <Text style={[s_.chipTxt, { color: verse.color }]}>{verse.theme}</Text>
                </View>
                <Ionicons name={showVerses ? 'chevron-up' : 'chevron-down'} size={18} color={C.goldSecondary} />
              </View>
              <Text style={{ fontSize: 13, color: C.textPrimary, lineHeight: 20 }} numberOfLines={2}>{verse.tamil}</Text>
              <Text style={{ fontSize: 11, color: C.goldSecondary, marginTop: 6, fontStyle: 'italic' }}>— {verse.reference}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {showVerses && (
            <View style={{ gap: 7, marginTop: 8 }}>
              {VERSES.map((v) => (
                <TouchableOpacity
                  key={v.id} onPress={() => { setVerse(v); setShowVerses(false); }}
                  style={[s_.verseItem, verse.id === v.id && { borderColor: 'rgba(200,134,10,0.5)' }]}
                >
                  {verse.id === v.id && (
                    <LinearGradient colors={['rgba(45,35,0,0.95)', 'rgba(30,23,0,0.9)']} style={StyleSheet.absoluteFill} borderRadius={11} />
                  )}
                  <View style={[s_.vNum, { backgroundColor: v.color + '22' }]}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: v.color }}>{v.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: verse.id === v.id ? C.goldBright : C.textSecondary, fontWeight: '600' }}>{v.reference}</Text>
                    <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }} numberOfLines={1}>{v.tamil}</Text>
                  </View>
                  {verse.id === v.id && <Ionicons name="checkmark-circle" size={18} color={C.goldBright} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <GoldDivider />

          {/* Settings */}
          <Text style={s_.secLabel}>அமைவுகள்</Text>

          {[
            { icon: 'time-outline', title: 'தூக்கம் (Snooze)', desc: '5 நிமிட இடைவேளை', val: snooze, set: setSnooze },
            { icon: 'phone-portrait-outline', title: 'அதிர்வு (Vibrate)', desc: 'அலாரம் அதிரும்', val: vibrate, set: setVibrate },
          ].map((item) => (
            <View key={item.title} style={s_.settingRow}>
              <Ionicons name={item.icon} size={20} color={C.goldSecondary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, color: C.textPrimary, fontWeight: '600' }}>{item.title}</Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>{item.desc}</Text>
              </View>
              <Switch
                value={item.val} onValueChange={item.set}
                trackColor={{ false: C.inactive, true: C.goldSecondary }}
                thumbColor={item.val ? C.goldBright : '#666'}
              />
            </View>
          ))}

          {/* Audio note */}
          <View style={s_.audioNote}>
            <Ionicons name="musical-notes-outline" size={16} color={C.goldSecondary} />
            <Text style={{ fontSize: 12, color: C.textSecondary, flex: 1 }}>
              வசனம் தமிழில் எதிரொலி (echo) விளைவுடன் வான்சீர் பின்னணி இசையுடன் ஒலிக்கும்
            </Text>
          </View>

          {/* Save button */}
          <TouchableOpacity onPress={save} activeOpacity={0.85} style={{ marginTop: 20 }}>
            <LinearGradient colors={[C.goldLight, C.goldPrimary, C.goldSecondary]} style={s_.bigSaveBtn}>
              <GlowCross size={20} />
              <Text style={{ fontSize: 16, fontWeight: '800', color: C.bgDeep }}>அலாரம் சேமிக்கவும்</Text>
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────
// 📖 VERSES SCREEN
// ─────────────────────────────────────────────
function VersesScreen({ navigation }) {
  const [open, setOpen] = useState(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeIn, { toValue: 1, duration: 900, useNativeDriver: true }).start(); }, []);

  return (
    <View style={s_.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgDeep} />
      <LinearGradient colors={['#0A0800', '#130D00', '#1C1500']} style={StyleSheet.absoluteFill} />
      <StarField />
      <GoldDust />
      <Animated.View style={{ flex: 1, opacity: fadeIn }}>

        <LinearGradient colors={['rgba(20,15,0,0.98)', 'rgba(10,8,0,0.9)']} style={[s_.header, { alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 52 }}>
            <Ionicons name="arrow-back" size={22} color={C.goldBright} />
          </TouchableOpacity>
          <Text style={{ fontSize: 10, color: C.goldSecondary, letterSpacing: 2, marginTop: 10 }}>சர்ச் ஆஃப் சவுத் இந்தியா — தமிழ் பைபிள்</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <GlowCross size={20} />
            <Text style={s_.appTitle}>ஆசீர்வாத வசனங்கள்</Text>
            <GlowCross size={20} />
          </View>
        </LinearGradient>

        <GoldDivider />

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center', marginBottom: 14 }}>
            தேவனின் ஆசீர்வாதங்களும் வாக்குத்தத்தங்களும் — 10 வேத வசனங்கள்
          </Text>

          {VERSES.map((v, idx) => {
            const isOpen = open === v.id;
            return (
              <TouchableOpacity key={v.id} onPress={() => setOpen(isOpen ? null : v.id)} activeOpacity={0.85}>
                <LinearGradient
                  colors={isOpen ? ['#2D2300', '#1F1800'] : ['#1F1800', '#150F00']}
                  style={[s_.vCard, { borderLeftColor: v.color, borderColor: isOpen ? 'rgba(200,134,10,0.4)' : 'rgba(200,134,10,0.12)' }]}
                >
                  <View style={[s_.vNum, { backgroundColor: v.color + '22', borderColor: v.color + '44', borderWidth: 1, marginRight: 12 }]}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: v.color }}>{String(idx + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={[s_.chip, { backgroundColor: v.color + '18', borderColor: v.color + '44' }]}>
                        <Text style={[s_.chipTxt, { color: v.color }]}>{v.theme}</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: C.goldSecondary, fontWeight: '600' }}>{v.reference}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: isOpen ? C.textPrimary : C.ivoryDim, lineHeight: 21 }} numberOfLines={isOpen ? undefined : 2}>
                      "{v.tamil}"
                    </Text>
                    {isOpen && (
                      <View style={{ marginTop: 12 }}>
                        <GoldDivider />
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Add', { alarm: { verse: v, label: v.theme + ' அலாரம்' } })}
                          activeOpacity={0.85}
                        >
                          <LinearGradient colors={[C.goldLight, C.goldSecondary]} style={s_.useAlarmBtn}>
                            <Ionicons name="alarm-outline" size={16} color={C.bgDeep} />
                            <Text style={{ fontSize: 13, fontWeight: '800', color: C.bgDeep }}>இந்த வசனத்தை அலாரமாக சேர்</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} color={C.goldSecondary} style={{ marginLeft: 6, alignSelf: 'flex-start', marginTop: 2 }} />
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          <View style={{ alignItems: 'center', paddingTop: 20, gap: 10 }}>
            <GlowCross size={28} />
            <Text style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center', fontStyle: 'italic' }}>
              "வேதவாக்கியங்களெல்லாம் தேவஆவியினால் அருளப்பட்டவைகள்"
            </Text>
            <Text style={{ fontSize: 11, color: C.goldSecondary }}>2 தீமோத்தேயு 3:16</Text>
          </View>
        </ScrollView>

        <LinearGradient colors={['rgba(10,8,0,0)', 'rgba(10,8,0,0.98)']} style={s_.bottomBar}>
          <TouchableOpacity style={s_.tabItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="alarm-outline" size={26} color={C.textSecondary} />
            <Text style={[s_.tabLabel, { color: C.textSecondary }]}>அலாரம்</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s_.tabItem}>
            <Ionicons name="book" size={26} color={C.goldPrimary} />
            <Text style={[s_.tabLabel, { color: C.goldPrimary }]}>வசனங்கள்</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────
// 🔔 ALARM RING SCREEN
// ─────────────────────────────────────────────
function RingScreen({ navigation, route }) {
  const verse = route?.params?.verse || VERSES[0];
  const label = route?.params?.label || 'வேத வசன அலாரம்';
  const canSnooze = route?.params?.snooze ?? true;
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.3)).current;
  const slideUp = useRef(new Animated.Value(80)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.18, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.2, duration: 1500, useNativeDriver: true }),
    ])).start();
    Vibration.vibrate([0, 600, 300, 600, 300, 800], true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(t); Vibration.cancel(); };
  }, []);

  const dismiss = () => { Vibration.cancel(); navigation.goBack(); };
  const snoozeIt = () => { Vibration.cancel(); navigation.goBack(); };

  const h = now.getHours(), m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'மாலை' : 'காலை';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;

  return (
    <View style={s_.container}>
      <StatusBar hidden />
      <LinearGradient colors={['#0A0800', '#1C1200', '#2A1800']} style={StyleSheet.absoluteFill} />
      <StarField />
      <GoldDust />

      {/* Central glow halo */}
      <Animated.View style={[s_.halo, { opacity: glow }]} />

      <Animated.View style={{ flex: 1, opacity: fadeIn }}>
        {/* Time */}
        <View style={{ alignItems: 'center', paddingTop: 70 }}>
          <Text style={s_.ringTime}>{String(h12).padStart(2, '0')}:{m}</Text>
          <Text style={{ fontSize: 16, color: C.goldSecondary, letterSpacing: 3, marginTop: -4 }}>{ampm}</Text>
        </View>

        {/* Pulsing cross */}
        <Animated.View style={{ alignItems: 'center', marginVertical: 18, transform: [{ scale: pulse }] }}>
          <GlowCross size={72} />
        </Animated.View>

        {/* Label */}
        <Text style={{ textAlign: 'center', fontSize: 14, color: C.textSecondary, letterSpacing: 2, fontWeight: '600' }}>
          {label}
        </Text>

        {/* Verse card */}
        <Animated.View style={{ transform: [{ translateY: slideUp }], marginTop: 18 }}>
          <LinearGradient colors={['rgba(45,35,0,0.97)', 'rgba(18,13,0,0.98)']} style={s_.ringVerseCard}>
            <LinearGradient colors={[C.goldLight, C.goldSecondary]} style={{ height: 3 }} />
            <View style={[s_.chip, { alignSelf: 'center', marginTop: 14, backgroundColor: verse.color + '22', borderColor: verse.color + '55' }]}>
              <Text style={[s_.chipTxt, { color: verse.color }]}>✦ {verse.theme} ✦</Text>
            </View>
            <Text style={s_.ringVerseTamil}>"{verse.tamil}"</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(200,134,10,0.3)' }} />
              <Text style={{ fontSize: 12, color: C.goldSecondary, fontWeight: '700', marginHorizontal: 8 }}>{verse.reference}</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(200,134,10,0.3)' }} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 14, marginHorizontal: 24, marginTop: 22 }}>
          {canSnooze && (
            <TouchableOpacity onPress={snoozeIt} style={s_.snoozeBtn}>
              <LinearGradient colors={['rgba(255,215,0,0.12)', 'rgba(200,134,10,0.08)']} style={s_.snoozeBtnIn}>
                <Ionicons name="time-outline" size={22} color={C.goldSecondary} />
                <Text style={{ color: C.goldSecondary, fontWeight: '700', fontSize: 12 }}>5 நிமிடம்</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={dismiss} style={{ flex: 1.6 }} activeOpacity={0.85}>
            <LinearGradient colors={[C.goldLight, C.goldPrimary, C.goldSecondary]} style={s_.dismissBtn}>
              <Ionicons name="checkmark" size={26} color={C.bgDeep} />
              <Text style={{ color: C.bgDeep, fontWeight: '800', fontSize: 16 }}>நிறுத்து</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────
// 🗺️ APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const navRef = useRef(null);

  useEffect(() => {
    setupNotifications();

    const sub = Notifications.addNotificationReceivedListener((n) => {
      const data = n.request.content.data;
      if (data?.type === 'alarm') {
        const v = VERSES.find((x) => x.id === data.verseId) || VERSES[0];
        navRef.current?.navigate('Ring', { verse: v, label: data.label, snooze: true });
      }
    });
    const sub2 = Notifications.addNotificationResponseReceivedListener((r) => {
      const data = r.notification.request.content.data;
      if (data?.type === 'alarm') {
        const v = VERSES.find((x) => x.id === data.verseId) || VERSES[0];
        navRef.current?.navigate('Ring', { verse: v, label: data.label, snooze: true });
      }
    });
    return () => { sub.remove(); sub2.remove(); };
  }, []);

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Verses" component={VersesScreen} />
        <Stack.Screen name="Ring" component={RingScreen}
          options={{ animation: 'fade', presentation: 'fullScreenModal', gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────
// 💅 STYLES
// ─────────────────────────────────────────────
const s_ = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeep },
  header: {
    paddingTop: 52, paddingHorizontal: 22, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(200,134,10,0.2)',
    flexDirection: 'row', justifyContent: 'space-between',
  },
  appSub: { fontSize: 10, letterSpacing: 2, color: C.goldSecondary, fontWeight: '600', marginBottom: 3 },
  appTitle: { fontSize: 20, color: C.goldBright, fontWeight: '700', letterSpacing: 0.3 },
  dateText: { fontSize: 11, color: C.textSecondary, marginTop: 4 },
  clockTime: { fontSize: 36, color: C.goldBright, fontWeight: '800', letterSpacing: -1, lineHeight: 40 },
  clockSec: { fontSize: 18, color: C.goldSecondary, marginBottom: 3 },
  clockAmPm: { fontSize: 11, color: C.textSecondary, marginTop: 2, textAlign: 'right' },
  alarmCard: {
    borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, overflow: 'hidden',
  },
  cardBar: { width: 4, alignSelf: 'stretch', margin: 8, marginRight: 12, borderRadius: 2 },
  alarmTime: { fontSize: 36, color: C.goldBright, fontWeight: '800', letterSpacing: -1 },
  alarmLabel: { fontSize: 12, color: C.textSecondary, fontWeight: '600', marginTop: 2 },
  alarmDays: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  alarmRef: { fontSize: 11, color: C.goldSecondary, marginTop: 4, fontStyle: 'italic' },
  delBtn: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,107,74,0.1)', borderWidth: 1, borderColor: 'rgba(255,107,74,0.25)',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', paddingTop: 18, paddingBottom: 28,
  },
  tabItem: { alignItems: 'center', gap: 3 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  fab: { marginTop: -20 },
  fabInner: {
    width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.goldBright, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 12,
  },
  // Add screen
  saveChip: {
    backgroundColor: 'rgba(200,134,10,0.2)', borderWidth: 1,
    borderColor: C.goldSecondary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7,
  },
  timeCard: {
    borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(200,134,10,0.3)',
  },
  bigTime: {
    fontSize: 76, color: C.goldBright, fontWeight: '800', letterSpacing: -2, lineHeight: 84,
    textShadowColor: 'rgba(255,215,0,0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16,
  },
  bigAmPm: { fontSize: 18, color: C.goldSecondary },
  secLabel: { fontSize: 11, color: C.goldSecondary, fontWeight: '700', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  input: {
    backgroundColor: 'rgba(255,215,0,0.05)', borderWidth: 1,
    borderColor: 'rgba(200,134,10,0.25)', borderRadius: 12, padding: 13,
    color: C.textPrimary, fontSize: 14,
  },
  dayBtn: {
    flex: 1, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(200,134,10,0.2)', backgroundColor: 'rgba(255,215,0,0.04)', overflow: 'hidden',
  },
  dayBtnOn: { borderColor: C.goldPrimary },
  dayTxt: { fontSize: 11, color: C.textMuted, fontWeight: '600' },
  versePreview: {
    borderRadius: 14, padding: 15, marginBottom: 6,
    borderWidth: 1, borderColor: 'rgba(200,134,10,0.25)',
  },
  verseItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11,
    borderRadius: 11, borderWidth: 1, borderColor: 'rgba(200,134,10,0.15)',
    backgroundColor: 'rgba(255,215,0,0.03)', overflow: 'hidden',
  },
  vNum: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  chipTxt: { fontSize: 11, fontWeight: '700' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: 'rgba(200,134,10,0.1)',
  },
  audioNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(200,134,10,0.08)', borderRadius: 10, padding: 12,
    marginTop: 10, borderWidth: 1, borderColor: 'rgba(200,134,10,0.15)',
  },
  bigSaveBtn: {
    borderRadius: 16, padding: 17, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 12,
    shadowColor: C.goldBright, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  // Verses screen
  vCard: {
    borderRadius: 15, padding: 14, marginBottom: 11,
    flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 1, borderLeftWidth: 4,
  },
  useAlarmBtn: {
    borderRadius: 11, padding: 12, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  // Ring screen
  halo: {
    position: 'absolute', top: height * 0.18, left: width / 2 - 140,
    width: 280, height: 280, borderRadius: 140,
    shadowColor: C.goldBright, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 80, elevation: 20,
    backgroundColor: 'transparent',
  },
  ringTime: {
    fontSize: 96, color: C.goldBright, fontWeight: '800', letterSpacing: -3, lineHeight: 104,
    textShadowColor: C.goldBright, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 24,
  },
  ringVerseCard: {
    marginHorizontal: 22, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(200,134,10,0.4)',
  },
  ringVerseTamil: {
    fontSize: 15, color: C.ivory, lineHeight: 25, textAlign: 'center',
    paddingHorizontal: 20, paddingVertical: 14, fontStyle: 'italic',
    textShadowColor: 'rgba(255,215,0,0.2)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },
  snoozeBtn: {
    flex: 1, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(200,134,10,0.3)',
  },
  snoozeBtnIn: { alignItems: 'center', justifyContent: 'center', padding: 15, gap: 5 },
  dismissBtn: {
    borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: C.goldBright, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8,
  },
});

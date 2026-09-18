export const categoryOptions = [
  { value: '制冷', label: '制冷', tone: 'cyan' },
  { value: '制热', label: '制热', tone: 'orange' },
  { value: '厨房', label: '厨房', tone: 'yellow' },
  { value: '清洁', label: '清洁', tone: 'blue' },
  { value: '娱乐', label: '娱乐', tone: 'pink' },
  { value: '照明', label: '照明', tone: 'purple' },
  { value: '其他', label: '其他', tone: 'gray' },
]

export const defaultAppliances = [
  { id: 'air-conditioner', name: '客厅空调', category: '制冷', power: 1200, hours: 6, quantity: 1, year: 2021, note: '夏季每日使用', icon: '❄' },
  { id: 'fridge', name: '双开门冰箱', category: '制冷', power: 110, hours: 24, quantity: 1, year: 2020, note: '一级能效', icon: '▥' },
  { id: 'water-heater', name: '电热水器', category: '制热', power: 2000, hours: 1.5, quantity: 1, year: 2022, note: '晚间洗浴使用', icon: '♨' },
  { id: 'rice-cooker', name: '智能电饭煲', category: '厨房', power: 700, hours: 1, quantity: 1, year: 2023, note: '', icon: '◉' },
  { id: 'washer', name: '滚筒洗衣机', category: '清洁', power: 500, hours: 0.6, quantity: 1, year: 2019, note: '每周约 4 次', icon: '◌' },
  { id: 'tv', name: '客厅电视', category: '娱乐', power: 150, hours: 3, quantity: 1, year: 2021, note: '', icon: '▣' },
  { id: 'lamp', name: '卧室灯', category: '照明', power: 24, hours: 5, quantity: 3, year: 2022, note: 'LED 灯', icon: '✦' },
]

export const defaultDailyRecords = [
  { date: '2026-09-06', usage: 10.9 },
  { date: '2026-09-07', usage: 11.8 },
  { date: '2026-09-08', usage: 10.7 },
  { date: '2026-09-09', usage: 12.3 },
  { date: '2026-09-10', usage: 11.6 },
  { date: '2026-09-11', usage: 10.2 },
  { date: '2026-09-12', usage: 9.8 },
]

export const defaultChallenges = [
  { id: 'unplug', title: '一周不用的电器拔插头', description: '减少待机能耗，离家前检查插座。', days: 7, progress: 4, points: 120, joined: true, completed: false, accent: 'lime', icon: '⌁' },
  { id: 'summer-ac', title: '夏季空调不低于 26℃', description: '每一天都为家庭节省一度电。', days: 14, progress: 9, points: 240, joined: true, completed: false, accent: 'orange', icon: '☼' },
  { id: 'standby', title: '告别待机红点', description: '连续 3 天关闭不必要的待机设备。', days: 3, progress: 3, points: 80, joined: false, completed: true, accent: 'blue', icon: '✓' },
]

export const defaultBadges = [
  { id: 'beginner', name: '省电新手', description: '完成首次用电分析', icon: '✦', unlocked: true },
  { id: 'check-in', name: '坚持打卡', description: '连续打卡 7 天', icon: '♟', unlocked: true },
  { id: 'carbon', name: '碳足迹削减者', description: '累计节省 10 kg 碳排放', icon: '◒', unlocked: false },
  { id: 'master', name: '节能达人', description: '节能比例达到 15%', icon: '♛', unlocked: false },
]

export const defaultState = {
  electricityPrice: 0.58,
  monthlyGoal: 10,
  appliances: defaultAppliances,
  dailyRecords: defaultDailyRecords,
  challenges: defaultChallenges,
  badges: defaultBadges,
  profile: { name: '林小满', points: 680, streak: 7, avatar: 'LM' },
}

const shared = {
  en: { welcome: 'A table full of stories', intro: 'Filipino, Indian and taco dishes in Myoko.', menu: 'Menu', reserve: 'Reserve a table', events: 'Plan an event', visit: 'Visit us', order: 'Pickup order', freeCoffee: 'Coffee is on us for guests 65+.' },
  ja: { welcome: '物語が集まる食卓', intro: '妙高でフィリピン、インド、タコス料理を。', menu: 'メニュー', reserve: '席を予約', events: 'イベントを計画', visit: 'アクセス', order: 'テイクアウト注文', freeCoffee: '65歳以上のお客様はコーヒー無料です。' },
  es: { welcome: 'Una mesa llena de historias', intro: 'Platos filipinos, indios y tacos en Myoko.', menu: 'Menú', reserve: 'Reservar mesa', events: 'Planificar evento', visit: 'Visítanos', order: 'Pedido para recoger', freeCoffee: 'Café gratis para mayores de 65 años.' },
  zh: { welcome: '一张充满故事的餐桌', intro: '在妙高享用菲律宾、印度和塔可料理。', menu: '菜单', reserve: '预约座位', events: '策划活动', visit: '到访我们', order: '外带订单', freeCoffee: '65岁及以上客人免费咖啡。' },
  hi: { welcome: 'कहानियों से भरी मेज़', intro: 'म्योको में फिलिपिनो, भारतीय और टैको व्यंजन।', menu: 'मेनू', reserve: 'टेबल बुक करें', events: 'कार्यक्रम की योजना', visit: 'हमसे मिलें', order: 'पिकअप ऑर्डर', freeCoffee: '65+ अतिथियों के लिए कॉफी मुफ़्त है।' },
  pt: { welcome: 'Uma mesa cheia de histórias', intro: 'Pratos filipinos, indianos e tacos em Myoko.', menu: 'Menu', reserve: 'Reservar mesa', events: 'Planejar evento', visit: 'Visite-nos', order: 'Pedido para retirada', freeCoffee: 'Café grátis para hóspedes com 65+.' },
  tl: { welcome: 'Hapag na puno ng kuwento', intro: 'Pagkaing Pilipino, Indian at tacos sa Myoko.', menu: 'Menu', reserve: 'Magpareserba', events: 'Magplano ng event', visit: 'Bisitahin kami', order: 'Pickup order', freeCoffee: 'Libre ang kape para sa 65 pataas.' },
  ko: { welcome: '이야기로 가득한 식탁', intro: '묘코에서 필리핀, 인도, 타코 요리를 즐기세요.', menu: '메뉴', reserve: '테이블 예약', events: '이벤트 계획', visit: '방문하기', order: '포장 주문', freeCoffee: '65세 이상 고객에게 커피가 무료입니다.' },
}

export const locales = shared
export const languageNames = { en: 'English', ja: '日本語', es: 'Español', zh: '中文', hi: 'हिन्दी', pt: 'Português', tl: 'Tagalog', ko: '한국어' }
export function initialLanguage() {
  const saved = localStorage.getItem('mhc-language')
  const browser = navigator.language?.slice(0, 2)
  return shared[saved] ? saved : (shared[browser] ? browser : 'en')
}

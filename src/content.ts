// ─────────────────────────────────────────────────────────────
//  FOR RACHEAL — All copy lives here. Edit text without
//  touching any component file.
// ─────────────────────────────────────────────────────────────

export const meta = {
  title: "For Racheal 🎂",
  date: "21 November 2026",
  ogDescription: "A birthday gift from Abubakar to Racheal. 21 November 2026.",
};

// ── GATE ─────────────────────────────────────────────────────
export const gate = {
  intro: "Today is yours.",
  cta: "Begin",
  audioLabel: "Toggle ambient music",
};

// ── HERO (Chapter 1) ─────────────────────────────────────────
export const hero = {
  headline: "Happy Birthday, Racheal.",
  padi: "my padi",
  subline: "21 November 2026, a day made for you.",
  scrollCue: "scroll to explore",
};

// ── CHAPTER 2 — Our year in stars ────────────────────────────
export const stars = {
  heading: "Our year, one star at a time.",
  months: [
    { month: "January",   caption: "The year began quietly, but you were already making noise in the best way." },
    { month: "February",  caption: "You sent me food pics and I pretended not to be jealous. I was very jealous." },
    { month: "March",     caption: "Long voice notes that felt like being in the same room." },
    { month: "April",     caption: "You laughed at something I said and I felt like I had won something." },
    { month: "May",       caption: "\"Have you eaten?\" — you, every single day, without fail." },
    { month: "June",      caption: "Midyear check-in: still my favourite person to annoy." },
    { month: "July",      caption: "You were tired but you still showed up. That says everything." },
    { month: "August",    caption: "New recipes, new ambitions, same warmth. You were growing and glowing." },
    { month: "September", caption: "Late nights, big dreams, and voice notes I replayed more than once." },
    { month: "October",   caption: "You made something beautiful with your hands and called it ordinary. It wasn't." },
    { month: "November",  caption: "And now here we are. Your month. Your moment. Yours." },
  ],
};

// ── CHAPTER 3 — The Numbers ───────────────────────────────────
export const numbers = {
  heading: "Us, by the numbers.",
  stats: [
    { value: 9900,  suffix: "+", label: "messages" },
    { value: 312,   suffix: "",  label: "days of talking" },
    { value: 80,    suffix: "+", label: "\"Good morning\"s" },
    { value: 80,    suffix: "+", label: "\"Have you eaten?\"s" },
    { value: 73,    suffix: "",  label: "\"my love\"s" },
  ],
  closing: "And I would happily send them all again.",
};

// ── CHAPTER 4 — The Baker ─────────────────────────────────────
export const baker = {
  heading: "Racheal, who turns flour into joy.",
  body: "Cakes, shawarma, and a patience I will never have. You make people happy one bite at a time.",
  highlight: "One day there will be a bakery with your name on it, and I'll be the first one in line.",
  shopSign: "Racheal's Bakery",
  shopSignSub: "coming soon ✨",
};

// ── CHAPTER 5 — Racheal in Motion ────────────────────────────
export const videos = {
  heading: "Moments of you.",
  subheading: "I wish I could have kept more of them.",
  items: [
    { src: "/videos/racheal-1.mp4#t=0.5", caption: "You, in your element." },
    { src: "/videos/racheal-2.mp4#t=0.5", caption: "The smile that makes the room lighter." },
    { src: "/videos/racheal-3.mp4#t=0.5", caption: "Unbothered and glowing." },
    { src: "/videos/racheal-4.mp4#t=0.5", caption: "My favourite version of you — this one." },
    { src: "/videos/racheal-5.mp4#t=0.5", caption: "Still you, still magic." },
    { src: "/videos/racheal-6.mp4#t=0.5", caption: "Every frame, a good one." },
  ],
};

// ── CHAPTER 6 — Things only we understand ────────────────────
export const insideJokes = {
  heading: "Things only we understand.",
  cards: [
    {
      phrase: "Breakfast?",
      explanation: "The question I never stop asking. You have never once given a satisfying answer.",
    },
    {
      phrase: "Have you eaten?",
      explanation: "My daily mission. Your daily delay. We both know how this ends.",
    },
    {
      phrase: "Mr Rugged",
      explanation: "Your favourite nickname for my school-days hustle. I have accepted it.",
    },
    {
      phrase: "Good morning, padi",
      explanation: "How most of our days began. I still think it is the best way to start one.",
    },
    {
      phrase: "Abeg",
      explanation: "Your most powerful word. One syllable. Infinite leverage. I always cave.",
    },
  ],
};

// ── CHAPTER 7 — Make a wish ───────────────────────────────────
export const wish = {
  heading: "Make a wish.",
  hint: "Tap the flame.",
  hintHold: "Hold to blow it out.",
  afterText: "Whatever you wished for, I'm wishing it too.",
  keyboardHint: "Press Enter or Space",
};

// ── CHAPTER 8 — The Letter ────────────────────────────────────
export const letter = {
  sealLabel: "Open the letter",
  paragraphs: [
    "Racheal,",
    "Happy Birthday, my padi.",
    "You are really important to my life, and that has never been small to me. We did not get to build something together, and I will not pretend that does not sit in my heart sometimes. A part of me still holds some feelings for you, and I would rather say it honestly than hide it behind jokes. But what I want most is your happiness, so I am only wishing you the very best.",
    "So here is my prayer for your new year: that God gives you everything you have been praying for, and that before this year closes you meet someone who truly loves you the way you deserve. Someone who reminds you to eat on time, since it cannot always be me 😄",
    "Whatever happens, I got you always, today and forever.",
    "Your padi,",
    "Abubakar ❤️",
  ],
};

// ── PHOTOS ───────────────────────────────────────────────────
export const photos = [
  {
    // Baker portrait — beside the baker headline (DO NOT CHANGE)
    src:         "/images/optimized/racheal-1.webp",
    placeholder: "/images/optimized/racheal-1-placeholder.webp",
    srcFallback: "/images/racheal-1.jpeg",
    alt:         "Racheal smiling — the baker, the light",
    caption:     "The hands that make everything taste like love.",
    focalPoint:  "50% 20%",
    orientation: "landscape" as const,
  },
  {
    // Hero small circular portrait
    src:         "/images/optimized/racheal-2.webp",
    placeholder: "/images/optimized/racheal-2-placeholder.webp",
    srcFallback: "/images/racheal-2.jpeg",
    alt:         "Racheal",
    caption:     "",
    focalPoint:  "50% 20%",
    orientation: "portrait" as const,
  },
  {
    // Full-screen cinematic moment between videos and wish candle
    src:         "/images/optimized/racheal-3.webp",
    placeholder: "/images/optimized/racheal-3-placeholder.webp",
    srcFallback: "/images/racheal-3.jpeg",
    alt:         "Racheal — a moment of quiet joy",
    caption:     "Happy birthday, Racheal.",
    focalPoint:  "50% 20%",
    orientation: "portrait" as const,
  },
];

// ── FOOTER ───────────────────────────────────────────────────
export const footer = {
  credit: "Made with love, by Abubakar.",
  date: "21.11.2026",
  replay: "Replay from the beginning",
};

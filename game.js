import { drawPark } from './park.js';
import { drawStreet, drawRiver } from './places.js';
import { drawBird, variants } from './birds.js';

const WIDTH = 480;
const HEIGHT = 270;
const FAR = 160;
const NEAR = 254;
const landscapes = { park: drawPark, street: drawStreet, river: drawRiver };
const populations = {
  park: [0, 3, 2, 4, 1, 0, 7, 1],
  street: [2, 0, 6, 7, 11, 3, 0],
  river: [0, 4, 12, 13, 10, 14, 1, 5],
};
const positions = [
  [77, 197], [192, 172], [244, 215], [348, 186], [135, 238],
  [415, 227], [327, 246], [49, 161],
];
const idleActivity = 'のんびり散策中';
const rand = (low, high) => low + Math.random() * (high - low);
const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
const choose = (choices) => choices[Math.floor(Math.random() * choices.length)];

function savedRecord() {
  try {
    const data = JSON.parse(localStorage.getItem('hato-biyori.observations') || '{}');
    return {
      seen: new Set((Array.isArray(data?.seen) ? data.seen : []).filter(
        (item) => Number.isInteger(item) && item >= 0 && item < variants.length
      )),
      feedCount: Number.isSafeInteger(data?.feedCount) && data.feedCount >= 0 ? data.feedCount : 0,
    };
  } catch {
    return { seen: new Set(), feedCount: 0 };
  }
}

function makeBird(index, x, y) {
  return {
    index, x, y, dir: choose([-1, 1]), scale: rand(0.96, 1.04),
    pose: choose(['idle', 'idle', 'peck', 'walk']), clock: rand(0, 2),
    timer: rand(0.9, 3.5), speed: rand(3.2, 6), z: 0,
    tx: clamp(x + rand(-19, 19), 16, WIDTH-16), ty: clamp(y + rand(-7, 7), FAR, NEAR),
    reaction: rand(0.2, 1.2), target: null, flight: null,
  };
}

function flightTo(bird, x, y, arch, duration) {
  bird.pose = 'fly';
  bird.clock = 0;
  bird.target = null;
  bird.flight = { x0: bird.x, y0: bird.y, x, y, duration, elapsed: 0, arch };
  bird.dir = x < bird.x ? -1 : 1;
}

function pickBehavior(bird) {
  bird.clock = 0;
  const roll = Math.random();
  if (roll < 0.43) {
    bird.pose = 'walk';
    bird.tx = clamp(bird.x + rand(-40, 40), 16, WIDTH - 16);
    bird.ty = clamp(bird.y + rand(-14, 14), FAR, NEAR);
    bird.timer = rand(2, 5);
  } else {
    bird.pose = roll < 0.68 ? 'peck' : roll < 0.81 ? 'dig' : 'idle';
    bird.timer = rand(1.4, 4.5);
    if (Math.random() < 0.17) bird.dir *= -1;
  }
}

function approach(bird, x, y, speed, dt) {
  const dx = x - bird.x;
  const dy = y - bird.y;
  const distance = Math.hypot(dx, dy * 1.4);
  if (Math.abs(dx) > 0.5) bird.dir = Math.sign(dx);
  const fraction = distance < 0.001 ? 1 : Math.min(1, speed * dt / distance);
  bird.x += dx * fraction;
  bird.y += dy * fraction;
  return fraction === 1;
}

// Sound is generated locally. Each call has its own short envelope.
function makeSoundscape() {
  let audio = null;
  let gain = null;
  let enabled = false;
  let paused = false;
  function note(from, to, start, length, volume, type = 'sine') {
    if (!enabled || paused || !audio || audio.state !== 'running') return;
    const voice = audio.createOscillator();
    const envelope = audio.createGain();
    const now = audio.currentTime + start;
    voice.type = type;
    voice.frequency.setValueAtTime(from, now);
    voice.frequency.exponentialRampToValueAtTime(to, now + length);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(volume, now + length * 0.18);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    voice.connect(envelope);
    envelope.connect(gain);
    voice.start(now);
    voice.stop(now + length + 0.01);
    voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
  }
  function updateGain() {
    if (gain) gain.gain.setTargetAtTime(enabled && !paused ? 0.3 : 0, audio.currentTime, 0.025);
  }
  return {
    enable(value) {
      enabled = Boolean(value);
      if (enabled) {
        try {
          if (!audio) {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) return;
            audio = new Audio();
            gain = audio.createGain();
            gain.gain.value = 0;
            gain.connect(audio.destination);
          }
          if (audio.state === 'suspended') audio.resume().catch(() => {});
        } catch { return; }
      }
      updateGain();
    },
    pause(value) { paused = value; updateGain(); },
    coo() {
      const pitch = rand(260, 330);
      note(pitch, pitch * 0.92, 0, 0.24, 0.085);
      note(pitch * 1.1, pitch * 0.89, 0.31, 0.45, 0.1);
      note(pitch * 0.92, pitch * 0.86, 0.9, 0.28, 0.065);
    },
    flutter() {
      for (let i = 0; i < 5; i++) note(rand(420, 560), 145, i * 0.085, 0.085, 0.02, 'triangle');
    },
    scatter() {
      for (let i = 0; i < 5; i++) note(rand(720, 980), 480, i * 0.044, 0.035, 0.015, 'triangle');
    },
    close() { if (audio) audio.close().catch(() => {}); },
  };
}

export function createGame(canvas, onChange = () => {}) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const backgrounds = new Map();
  const flocks = new Map();
  const record = savedRecord();
  const sound = makeSoundscape();
  let place = 'park';
  let birds = [];
  let seeds = [];
  let flecks = [];
  let paused = false;
  let activity = idleActivity;
  let activityTime = 0;
  let arrivalTime = rand(20, 32);
  let alarmTime = rand(80, 140);
  let cooTime = rand(2, 5);
  let raf = 0;
  let lastTime = 0;
  let destroyed = false;

  function state() {
    return {
      count: birds.length, seen: [...record.seen].sort((a, b) => a - b),
      feedCount: record.feedCount, activity, place,
    };
  }
  function persist() {
    try {
      localStorage.setItem('hato-biyori.observations',
        JSON.stringify({ seen: [...record.seen], feedCount: record.feedCount }));
    } catch { /* The game also works without local storage. */ }
  }
  function notice(label, duration) {
    activityTime = duration;
    if (activity !== label) {
      activity = label;
      onChange(state());
    }
  }
  function background() {
    if (!backgrounds.has(place)) {
      const offscreen = document.createElement('canvas');
      offscreen.width = WIDTH;
      offscreen.height = HEIGHT;
      const painter = offscreen.getContext('2d');
      painter.imageSmoothingEnabled = false;
      landscapes[place](painter);
      backgrounds.set(place, offscreen);
    }
    return backgrounds.get(place);
  }
  function setPlace(next) {
    if (!Object.hasOwn(landscapes, next)) return;
    if (birds.length && next === place) return;
    place = next;
    if (!flocks.has(place)) {
      flocks.set(place, populations[place].map((index, i) =>
        makeBird(index, positions[i][0] + rand(-4, 4), clamp(positions[i][1] + rand(-3, 3), FAR, NEAR))
      ));
    }
    birds = flocks.get(place);
    seeds = [];
    flecks = [];
    for (const bird of birds) {
      bird.target = null;
      record.seen.add(bird.index);
    }
    activity = idleActivity;
    activityTime = 0;
    arrivalTime = rand(22, 37);
    alarmTime = rand(80, 140);
    persist();
    draw();
    onChange(state());
  }
  function feed(x = rand(150, 330), y = rand(194, 234)) {
    if (paused || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const cx = clamp(x, 13, WIDTH - 13);
    const cy = clamp(y, FAR, NEAR);
    for (let i = 0; i < 24; i++) {
      const theta = rand(0, 2*Math.PI);
      const radius = Math.sqrt(Math.random());
      seeds.push({
        x: clamp(cx + 26 * radius * Math.cos(theta), 10, WIDTH-10),
        y: clamp(cy + 13 * radius * Math.sin(theta), FAR, NEAR),
        age: 0, drop: rand(0.28, 0.55), eaten: false, light: Math.random() < 0.5,
      });
    }
    seeds = seeds.slice(-144);
    for (const bird of birds) {
      if (!bird.target) bird.reaction = rand(0.1, 1) + Math.hypot(bird.x-cx, bird.y-cy) / 210;
    }
    record.feedCount++;
    activity = '餌を見つけた';
    activityTime = 2;
    persist();
    onChange(state());
    sound.scatter();
  }

  function scare() {
    if (paused) return;
    const away = choose([-1, 1]);
    for (const bird of birds) {
      if (bird.flight) continue;
      const rawX = bird.x + away * rand(85, 230);
      const dest = rawX < 15 || rawX > WIDTH-15 ? bird.x - away * rand(45, 95) : rawX;
      flightTo(bird, clamp(dest, 15, WIDTH-15), rand(FAR, NEAR), rand(96, 175), rand(3.4, 5.2));
      bird.flight.elapsed = -rand(0, 0.3);
    }
    alarmTime = rand(85, 145);
    notice('いっせいに飛び立った', 5.3);
    sound.flutter();
  }
  function nearestSeed(bird) {
    let best = null;
    let near = Infinity;
    for (const item of seeds) {
      if (item.eaten || item.age < item.drop) continue;
      const d = (bird.x - item.x)**2 + (bird.y - item.y)**2;
      if (d < near) { near = d; best = item; }
    }
    return best;
  }
  function tickBird(bird, dt) {
    bird.clock += dt;
    if (bird.flight) {
      const f = bird.flight;
      f.elapsed += dt;
      const t = clamp(f.elapsed / f.duration, 0, 1);
      const mix = t*t*(3-2*t);
      bird.x = f.x0 + (f.x-f.x0)*mix;
      bird.y = f.y0 + (f.y-f.y0)*mix;
      bird.z = Math.sin(Math.PI*t)*f.arch;
      if (t >= 1) {
        bird.flight = null;
        bird.z = 0;
        bird.pose = 'idle';
        bird.clock = 0;
        bird.timer = rand(1, 2.5);
        bird.reaction = rand(0.3, 1.1);
      }
      return;
    }

    bird.reaction -= dt;
    if (seeds.length && bird.reaction <= 0) {
      if (!bird.target || bird.target.eaten || !seeds.includes(bird.target)) {
        bird.target = nearestSeed(bird);
        bird.clock = 0;
      }
      if (bird.target) {
        const item = bird.target;
        const reaches = Math.abs(bird.x - item.x) < 10 && Math.abs(bird.y - item.y) < 4;
        if (reaches) {
          bird.dir = item.x > bird.x ? 1 : -1;
          if (bird.pose !== 'peck') bird.clock = 0;
          bird.pose = 'peck';
          if (bird.clock > 0.48) {
            item.eaten = true;
            bird.target = null;
            bird.reaction = rand(0.1, 0.45);
            bird.timer = 0.65;
            notice('餌をついばみ中', 3);
          }
        } else {
          bird.pose = 'walk';
          approach(bird, item.x, item.y, bird.speed * 4.8, dt);
        }
        return;
      }
    }
    bird.timer -= dt;
    if (bird.timer <= 0) pickBehavior(bird);
    if (bird.pose === 'walk' && approach(bird, bird.tx, bird.ty, bird.speed, dt)) {
      bird.pose = 'idle';
      bird.timer = rand(0.6, 2.3);
    }
    if (bird.pose === 'dig' && Math.random() < dt * 1.7) {
      flecks.push({ x: bird.x + bird.dir*6, y: bird.y-2, vx: bird.dir*rand(4, 10),
        vy: -rand(10, 20), time: 0, color: choose(['#a38748', '#9b8e42', '#b79a57']) });
    }
  }

  function arrive() {
    if (birds.length >= 12) {
      // A departing bird leaves room for new visitors.
      const leaving = birds.find((b) => !b.flight && !b.target);
      if (leaving) {
        flightTo(leaving, leaving.x < WIDTH/2 ? -45 : WIDTH+45, FAR, 72, 2.8);
        leaving.departing = true;
      }
      return;
    }
    const rare = Array.from({ length: variants.length }, (_, i) => i).filter(i => !record.seen.has(i));
    const index = rare.length && Math.random() < 0.55 ? choose(rare) : Math.floor(rand(0, variants.length));
    const bird = makeBird(index, choose([-22, WIDTH+22]), FAR - 26);
    flightTo(bird, rand(30, WIDTH-30), rand(FAR, NEAR), rand(30, 65), rand(2.8, 4.1));
    birds.push(bird);
    record.seen.add(index);
    persist();
    activity = '新しい鳩がやってきた';
    activityTime = 4;
    onChange(state());
  }

  function update(dt) {
    for (const item of seeds) item.age += dt;
    seeds = seeds.filter(s => !s.eaten && s.age < 65);
    for (const bird of birds) tickBird(bird, dt);
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].departing && !birds[i].flight) {
        birds.splice(i, 1);
        onChange(state());
      }
    }
    for (const f of flecks) {
      f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 55 * dt; f.time += dt;
    }
    flecks = flecks.filter(f => f.time < 0.45);
    activityTime -= dt;
    if (activityTime <= 0 && activity !== idleActivity) notice(idleActivity, 0);
    cooTime -= dt;
    if (cooTime <= 0) { sound.coo(); cooTime = rand(9, 20); }
    arrivalTime -= dt;
    if (arrivalTime <= 0) { arrive(); arrivalTime = rand(24, 48); }
    alarmTime -= dt;
    if (alarmTime <= 0 && !seeds.length) scare();
  }
  function draw() {
    ctx.drawImage(background(), 0, 0);
    for (const item of seeds) {
      const fall = Math.max(0, 1-item.age/item.drop);
      const x = Math.round(item.x - 8*fall);
      const y = Math.round(item.y - 24*fall);
      ctx.fillStyle = '#a57537'; ctx.fillRect(x, y, 2, 1);
      ctx.fillStyle = item.light ? '#fff3aa' : '#efc467'; ctx.fillRect(x, y - 1, 1, 1);
    }
    const ordered = [...birds].sort((a, b) => a.y-b.y);
    for (const bird of ordered) {
      const scale = (0.75 + 0.38*clamp((bird.y-FAR)/(NEAR-FAR),0,1))*bird.scale;
      const opacity = 0.19 * Math.max(0, 1 - bird.z/160);
      const w = Math.round(14 * scale);
      const x = Math.round(bird.x), y = Math.round(bird.y);
      ctx.fillStyle = 'rgba(64,66,39,' + opacity + ')';
      ctx.fillRect(x-w/2|0, y-1, w, 2);
      ctx.fillRect(x-w/2+2|0, y+1, w-4, 1);
    }
    for (const bird of ordered) {
      const scale = (0.75 + 0.38*clamp((bird.y-FAR)/(NEAR-FAR),0,1))*bird.scale;
      const fps = bird.flight ? 8 : bird.target && bird.pose === 'walk' ? 10 : 5;
      drawBird(ctx, Math.round(bird.x), Math.round(bird.y - bird.z), bird.index,
        bird.pose, Math.floor(bird.clock*fps), bird.dir, scale);
    }
    for (const f of flecks) {
      ctx.fillStyle = f.color;
      ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 1);
    }
  }
  function loop(time) {
    if (destroyed) return;
    const dt = lastTime ? Math.min((time-lastTime)/1000, 0.1) : 0;
    lastTime = time;
    if (!paused && !document.hidden) { update(dt); draw(); }
    raf = requestAnimationFrame(loop);
  }
  function handleClick(event) {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const style = getComputedStyle(canvas);
    let width = box.width, height = box.height;
    if (style.objectFit === 'cover' || style.objectFit === 'contain') {
      const fit = style.objectFit === 'cover' ? Math.max : Math.min;
      const factor = fit(box.width/WIDTH, box.height/HEIGHT);
      width = WIDTH*factor;
      height = HEIGHT*factor;
    }
    const x = (event.clientX - box.left - (box.width-width)/2)*WIDTH/width;
    const y = (event.clientY - box.top - (box.height-height)/2)*HEIGHT/height;
    if (y >= FAR-10 && y <= HEIGHT && x >= 0 && x <= WIDTH) feed(x, y);
  }
  canvas.addEventListener('click', handleClick);
  setPlace('park');
  raf = requestAnimationFrame(loop);
  return {
    setPlace, feed, scare,
    setPaused(value) { paused = Boolean(value); sound.pause(paused); },
    setSound(value) { sound.enable(value); },
    getState: state,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('click', handleClick);
      sound.close();
    },
  };
}

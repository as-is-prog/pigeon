// Each bird is drawn on the same small pixel grid, feet anchored at the origin.
const blue = {
  O: '#363e48', D: '#4c5869', S: '#687686', M: '#95a1ae', L: '#b4c1c8',
  P: '#8e99a5', B: '#a4b0b7', H: '#81919d', h: '#647483', g: '#397776',
  G: '#70a597', v: '#776584', I: '#3e4857', A: '#758292',
  F: '#a16561', f: '#c98778', t: '#d7a18d', C: '#d4d4c7',
  b: '#59616a', e: '#352e2d', r: '#e2a75a',
};
const dove = {
  O: '#514443', D: '#625354', S: '#86695d', M: '#ac876e', L: '#c6a381',
  P: '#ae918c', B: '#c5aaa0', H: '#aa9791', h: '#99847f', g: '#646473',
  G: '#b4bdc0', v: '#736977', I: '#674f46', A: '#9a8070', F: '#ab6d69',
};
const ashRed = {
  O: '#52494a', D: '#7b6564', S: '#a48982', M: '#c4aaa1', L: '#d7c3b6',
  P: '#b29592', B: '#c7aea4', H: '#a69292', h: '#8e777c', g: '#897779',
  G: '#b29687', v: '#986e77', I: '#985f4f', A: '#bda49b',
};
const silver = {
  O: '#4e5b63', D: '#798994', S: '#93a2ac', M: '#bbc5c9', L: '#d5dad8',
  P: '#aab8bd', B: '#c0c9cb', H: '#a6b3b9', h: '#8d9ea7', g: '#688c8c',
  G: '#9db5a8', v: '#968494', I: '#63707a', A: '#a1afb6',
};
const white = {
  O: '#7a7e80', D: '#a4a9ad', S: '#c0c5c5', M: '#e6e6dc', L: '#faf9ee',
  P: '#dadbd4', B: '#f0eee4', H: '#faf8ed', h: '#e3e3db', g: '#d5d8d1',
  G: '#f0efe4', v: '#ccd0d1', I: '#c8cbd0', A: '#e2e0d7',
  C: '#edc9b9', b: '#af8984', r: '#ad887f',
};
function variety(name, species, colors, pattern = 'bar') {
  return {name, species, colors: {...blue, ...colors}, pattern};
}
const rock = 'ドバト';
const turtle = 'キジバト';
export const variants = [
  variety('二引', rock, {}),
  variety('山吹の羽', turtle, dove, 'scallop'),
  variety('純白', rock, white, 'plain'),
  variety('胡麻', rock, {M:'#8a959e', L:'#a8b2b7', I:'#414852'}, 'check'),
  variety('赤二引', rock, ashRed),
  variety('墨色', rock, {O:'#343640', D:'#454854', S:'#525864', M:'#646c78', L:'#7b8490', P:'#636b77', B:'#777e88', H:'#737d84', h:'#57626c', G:'#6d948b', v:'#745e76', I:'#4c5360'}, 'plain'),
  variety('白斑', rock, {}, 'pied'),
  variety('銀二引', rock, silver),
  variety('栗胡麻', rock, {...ashRed, I:'#8a534a', M:'#b8917c', L:'#d5b294'}, 'check'),
  variety('淡色の羽', turtle, {...dove, D:'#81716a', S:'#a48e7c', M:'#c6b095', L:'#deccb2', I:'#8a7569', P:'#c0aba1', B:'#d1beb0'}, 'scallop'),
  variety('濃胡麻', rock, {M:'#76818d', L:'#9aa7ab', S:'#526171', I:'#39424c'}, 'dense'),
  variety('白頭', rock, {...blue, S:'#798591'}, 'whitehead'),
  variety('栗色の羽', turtle, {...dove, M:'#ad7860', S:'#8e624f', L:'#d19b75', I:'#6d493f', P:'#ac887e', B:'#c2a098'}, 'scallop'),
  variety('銀胡麻', rock, {...silver, I:'#77838c'}, 'check'),
  variety('白羽まじり', rock, {...ashRed, M:'#a77f70', L:'#bc9c89'}, 'splash'),
];

// Rows have individual offsets so feather edges can taper to a single pixel.
const body = [
  [13,'OOOOOO'],[11,'OSMMMPPPDO'],[9,'OSMLLLMPBBPPO'],[8,'OSMMLLLLLPBBBPPO'],
  [7,'OSMMLLLLLMPBBBBPO'],[6,'OSMMLLLLMMMPBBBBPO'],[5,'ODSMMLLLMMMPBBBBPO'],
  [4,'ODDSSMMMMMMPBBBBPPO'],[3,'ODDSSSSMSSSPBBBBPPO'],[1,'ODDASSDDSSSPPBBBPPPPO'],
  [0,'ODDADDODSDSDPPPPPPPDO'],[0,'ODDDOO..ODSSPPPPPPDO'],[0,'OOO.......OODDDDDOO'],
];
const wing = [
  [11,'SMLLLL'],[9,'SMLLLLLMM'],[8,'SMIMLLLLMM'],[7,'SMIIMLLMMMS'],
  [6,'SIMIIDLMMMS'],[5,'SIIMIIMMMSS'],[4,'DSIIMIIMSSD'],[3,'DDSMIDDSD'],[2,'DDAASDD'],
];
const head = [
  [2,'OOOO'],[1,'OHHhhO'],[0,'OHhhhhrO'],[0,'OhhhhrehCb'],
  [1,'OhhhhggDCbb'],[1,'OhhggggO'],[1,'OgGggvvO'],[0,'ODgGvvhO'],[0,'DggvvhhP'],[0,'DSvvhhPP'],
];
const lowHead = [
  [0,'OO'],[0,'OggOO'],[0,'DgGggO'],[0,'DvgGghOO'],[0,'PDvggHHhO'],
  [1,'PDvhhHhhO'],[2,'PhhhhhhrO'],[3,'DhhhhrehO'],[4,'OhhhODCC'],[5,'OOO...bb'],[12,'b'],
];
const highWing = [
  [1,'OO'],[1,'ODLO'],[2,'ODLLO'],[2,'ODALLO'],[2,'ODAMMLO'],[3,'OASMMLLO'],
  [3,'ODASMMLLO'],[4,'ODASMMLLLO'],[5,'OSASMLLLLO'],[6,'OSSMMLLLO'],
  [7,'OSIMLLLO'],[8,'OSIMMMO'],[9,'OSIMMO'],[10,'OSMMO'],[11,'OSMO'],
];
const midWing = [
  [0,'OO'],[0,'ODDOO'],[1,'OADAOOO'],[2,'ODASMLLOO'],[4,'ODASMMLLLOO'],
  [5,'ODASMSMLLLLO'],[7,'ODASMSMMMLO'],[9,'OSMIMMMMO'],[11,'OSIIMMMO'],[13,'OSMMO'],
];
const lowWing = [
  [12,'SSMLLO'],[10,'OSMLLMO'],[9,'OSMLLLMO'],[7,'OSMMMLMO'],[6,'OSAMMIMO'],
  [5,'OSAMIMMO'],[4,'ODAMISMO'],[3,'ODASISMO'],[3,'ODASDMO'],[2,'ODASDO'],[1,'OADDO'],[1,'ODDO'],[0,'ODO'],[0,'OO'],
];

function wingFeather(code, x, y, pattern) {
  if (code === 'D' || code === 'S' || code === 'A' || code === 'O') return code;
  if (pattern === 'scallop') {
    const stagger = y % 4;
    const column = (x + (Math.floor(y / 4) % 2) * 2) % 5;
    if (stagger === 3 || (column === 0 && stagger > 0)) return 'L';
    return column > 1 && stagger < 2 ? 'I' : 'M';
  }
  if (pattern === 'check' || pattern === 'dense') {
    if ((x + (y >> 1) * 2) % 5 < (pattern === 'dense' ? 3 : 2) && y % 3 !== 2) return 'I';
  }
  if (pattern === 'plain' && code === 'I') return 'M';
  return code;
}
const spriteCache = new Map();
function compose(index, pose, n) {
  const {colors, pattern} = variants[index];
  const pixels = new Map();
  const flight = pose === 'fly';
  const feeding = pose === 'peck' || pose === 'dig';
  const low = feeding && n !== 0;
  const shuffle = pose === 'walk' || pose === 'dig';
  const bob = (shuffle && n === 1) ? -1 : 0;
  const set = (x, y, color) => pixels.set((y + 28) * 64 + (x + 8),color);
  const rows = (source, left, top, part) => {
    source.forEach(([offset, str], j) => {
      for (let i = 0; i < str.length; ++i) {
        let code = str[i];
        if (code === '.') continue;
        const x = left + offset + i;
        const y = top + j;
        let palette = colors;
        if (part === 'wing') code = wingFeather(code, x, j, pattern);
        if (part === 'head' && pattern === 'scallop' && 'gvG'.includes(code)) {
          code = ((i + j) % 3 === 0) ? 'G' : 'g';
        }
        if ((pattern === 'whitehead' && part === 'head' && j < 7)
          || (pattern === 'pied' && ((x > 17 && part === 'head') || (x >= 9 && x <= 14 && y < 15 && y >= 10 - (x % 3))))
          || (pattern === 'splash' && ((y > 9 && x < 9) || (part === 'head' && x > 16 && j < 6)))) palette = {...colors, ...white};
        set(x, y, palette[code]);
      }
    });
  };
  if (!flight) {
    // Far toes are slightly darker and sit one pixel higher in perspective.
    const s = shuffle ? [0,1,1,-1][n] : 0;
    rows([[0,'F'],[s,'F'],[s-1,'FFFf']], 12, 18, 'feet');
    rows([[0,'F'],[-s,'f'],[-s,'f'],[-s-1,'Fffft']], 16, 18, 'feet');
  }
  const by = 6 + bob;
  rows(body,0,by,'body');
  rows(wing,0,by+2,'wing');
  if (low) {
    rows(lowHead,16 + (n === 2 ? 1 : 0),9 + (n === 2 ? 1 : 0),'head');
  } else {
    const stride = pose === 'walk' ? [0,1,2,0][n] : 0;
    rows(head,15+stride+(flight?2:0),bob+(flight?4:0),'head');
  }
  if (flight) {
    if (n === 0) rows(highWing,1,-6,'wing');
    else if (n === 2) rows(lowWing,1,8,'wing');
    else rows(midWing,0,1,'wing');
  }
  // Keep only final visible colors, then coalesce each horizontal run.
  const runs = [];
  let last;
  for (const [k, color] of [...pixels].sort((a,b)=>a[0]-b[0])) {
    const x = k % 64 - 8, y = Math.floor(k / 64) - 28;
    if (last && last[1] === y && last[0]+last[2] === x && last[3] === color) last[2]++;
    else {last = [x,y,1,color]; runs.push(last);}
  }
  return runs;
}
function sprite(ctx,index,pose,n) {
  const key = index + '/' + pose + '/' + n;
  let cached = spriteCache.get(key);
  if (cached) return cached;
  const runs = compose(index,pose,n);
  const canvas = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(36,32) : ctx.canvas?.ownerDocument?.createElement('canvas');
  if (canvas) {
    canvas.width = 36;
    canvas.height = 32;
    const pen = canvas.getContext('2d');
    for (const [x,y,w,color] of runs) {pen.fillStyle=color;pen.fillRect(x+2,y+7,w,1);}
  }
  cached = {canvas,runs};
  spriteCache.set(key,cached);
  return cached;
}
export function drawBird(ctx,x,y,index=0,pose='idle',frame=0,dir=1,scale=1) {
  const i = Number.isInteger(index) && variants[index] ? index : 0;
  const n = pose === 'idle' ? 0 : Math.floor(Math.abs(frame)) % 4;
  const cached = sprite(ctx,i,pose,n);
  ctx.save();
  ctx.translate(Math.round(x),Math.round(y));
  ctx.scale(dir < 0 ? -scale : scale,scale);
  ctx.imageSmoothingEnabled = false;
  if (cached.canvas) ctx.drawImage(cached.canvas,-15,-28);
  else for (const [px,py,w,color] of cached.runs) {ctx.fillStyle=color;ctx.fillRect(px-13,py-21,w,1);}
  ctx.restore();
}

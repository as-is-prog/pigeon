import {drawBird,variants} from './birds.js';
import {drawPark} from './park.js';
import {drawStreet,drawRiver} from './places.js';
import {createGame} from './game.js';
import {icon} from './icons.js';

const $=id=>document.getElementById(id);
for(const el of document.querySelectorAll('[data-icon]'))el.innerHTML=icon(el.dataset.icon);
function birdCanvas(index,width=34,height=27){
  const c=document.createElement('canvas');
  c.width=width;c.height=height;
  drawBird(c.getContext('2d'),Math.round(width/2),height-3,index,'idle',0,1,1);
  return c;
}
drawBird($('logo').getContext('2d'),16,27,0,'idle',0,-1,1);
const places=[['park','まちの公園',drawPark],['street','街角の路上',drawStreet],['river','川沿いの道',drawRiver]];
let paused=false,sound=false;
const game=createGame($('world'),state=>{$('count').textContent=state.count;});
for(const [id,label,draw] of places){
  const btn=document.createElement('button');
  btn.className='spot';btn.dataset.place=id;btn.setAttribute('aria-pressed',id==='park');
  const img=document.createElement('canvas');img.width=480;img.height=270;draw(img.getContext('2d'));
  btn.append(img);const strong=document.createElement('strong');strong.textContent=label;btn.append(strong);
  const check=document.createElement('span');check.className='check';check.textContent=id==='park'?'✔':'';btn.append(check);
  btn.onclick=()=>{game.setPlace(id);$('locName').textContent=label;for(const el of $('choices').children){const active=el===btn;el.setAttribute('aria-pressed',active);el.lastChild.textContent=active?'✔':'';}};
  $('choices').append(btn);
}
function togglePause(){
  paused=!paused;game.setPaused(paused);$('live').textContent=paused?'一時停止中':'観察中';
  $('pause').innerHTML=icon(paused?'play':'pause');$('pause').title=paused?'観察を再開':'一時停止';$('pause').setAttribute('aria-label',$('pause').title);
}
$('pause').onclick=togglePause;
$('feed').onclick=()=>{if(paused)togglePause();game.feed();};
$('scare').onclick=()=>{if(paused)togglePause();game.scare();};
$('world').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('feed').click();}});
$('sound').onclick=()=>{sound=!sound;game.setSound(sound);$('sound').setAttribute('aria-pressed',sound);$('sound').innerHTML=icon(sound?'sound':'mute')+'<span>音声 '+(sound?'ON':'OFF')+'</span>';};
$('expand').onclick=async()=>{
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  if($('stage').classList.contains('full')){$('stage').classList.remove('full');return;}
  try{await $('stage').requestFullscreen();}catch{$('stage').classList.add('full');}
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('stage').classList.remove('full');});
const dialog=$('dialog'),content=$('dialogContent');
function modal(title){$('dialogTitle').textContent=title;content.replaceChildren();if(!dialog.open)dialog.showModal();}
$('close').onclick=()=>dialog.close();
dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}};
$('help').onclick=()=>{modal('遊びかた');content.innerHTML='<ul class="guide"><li>観察スポットを選んで、鳩が歩いたり落ち葉をつついたりする姿を眺めましょう。</li><li>地面をクリック・タップすると、その場所に餌をまけます。「餌をまく」でも鳩が集まってきます。</li><li>「おどろかす」を押すと、鳩たちが一斉に飛び立ちます。しばらく待つと、また舞い降ります。</li><li>図鑑の鳩を選ぶと、羽の模様を大きく見られます。</li></ul>';};
function card(i){const b=document.createElement('button');b.className='specimen';const n=document.createElement('small');n.textContent='No.'+String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=variants[i].name;b.append(n,birdCanvas(i),title);b.onclick=()=>detail(i);return b;}
function detail(i){
  modal(variants[i].name);const d=document.createElement('div');d.className='album-detail';
  d.append(birdCanvas(i));const p=document.createElement('p');p.textContent='No.'+String(i+1).padStart(2,'0')+'　'+variants[i].species;d.append(p);
  const back=document.createElement('button');back.textContent='図鑑の一覧へ';back.className='album-back';back.onclick=openAlbum;d.append(back);content.append(d);
}
function openAlbum(){modal('鳩の図鑑　全15柄');const grid=document.createElement('div');grid.className='album-grid';variants.forEach((v,i)=>grid.append(card(i)));content.append(grid);}
$('all').onclick=openAlbum;
for(let i=0;i<8;i++)$('previewBirds').append(card(i));

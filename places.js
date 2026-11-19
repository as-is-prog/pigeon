// All scene geometry is painted on the native 480 × 270 pixel grid.
function painter(ctx, seed) {
  let state = seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const roll = (low, high) => low + Math.floor(random() * (high - low + 1));
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
  }
  function line(x, y, x1, y1, color, width = 1) {
    let steps = Math.max(Math.abs(x1-x), Math.abs(y1-y), 1);
    for (let i = 0; i <= steps; i++)
      rect(Math.round(x+(x1-x)*i/steps), Math.round(y+(y1-y)*i/steps), width, width, color);
  }
  function polygon(points, color) {
    const ymin = Math.ceil(Math.min(...points.map(p=>p[1])));
    const ymax = Math.ceil(Math.max(...points.map(p=>p[1])));
    for (let y = ymin; y < ymax; y++) {
      const intersections = [];
      for (let a=0; a<points.length; a++) {
        const [x0,y0] = points[a], [x1,y1] = points[(a+1)%points.length];
        if ((y+.5>=y0 && y+.5<y1)||(y+.5>=y1 && y+.5<y0)) {
          intersections.push(x0+(x1-x0)*(y+.5-y0)/(y1-y0));
        }
      }
      intersections.sort((a,b)=>a-b);
      for (let a=0;a<intersections.length;a+=2) {
        const x=Math.round(intersections[a]);
        rect(x,y,Math.round(intersections[a+1])-x,1,color);
      }
    }
  }
  function cloud(x,y,s=1) {
    const blocks = [[0,5,38,3],[4,2,26,5],[10,-1,12,6],[14,-3,6,4],[25,1,6,5],[33,4,7,3]];
    for (const [a,b,c,d] of blocks) rect(x+a*s,y+b*s,c*s,d*s,'#f9f5df');
    rect(x+3*s,y+7*s,28*s,s,'#d6e2d2');
    rect(x+25*s,y+5*s,9*s,s,'#e9edda');
  }
  function sky() {
    rect(0,0,480,270,'#88c6d3');
    rect(0,25,480,35,'#9acfd6');
    rect(0,60,480,50,'#b8dedd');
    cloud(5,24,1.2);cloud(139,14,.75);cloud(233,27,.9);cloud(357,17,1.3);
    cloud(70,45,.6);cloud(286,48,.6);
  }
  function leaf(x,y,r,colors) {
    const height=Math.max(3,Math.round(r*.65));
    for(let i=-height;i<=height;i++) {
      const w=Math.round(r*Math.sqrt(Math.max(0,1-i*i/((height+.35)*(height+.35)))));
      rect(x-w,y+i,w*2,1,colors[0]);
    }
    for(let i=0;i<r*2;i++){
      const dx=roll(-r+1,r-1),dy=roll(-height+1,height-1);
      if((dx/r)**2+(dy/height)**2<.82)rect(x+dx,y+dy,roll(2,4),roll(1,2),colors[dy<0?roll(1,2):roll(0,1)]);
    }
  }
  function potted(x,y,h=17) {
    rect(x-5,y-6,10,6,'#985e43');
    rect(x-6,y-8,12,3,'#b57650');
    rect(x-4,y-5,2,4,'#c4895b');
    rect(x-6,y-1,12,1,'#8a7157');
    line(x,y-9,x-1,y-h,'#77784c');
    leaf(x-1,y-h,7,['#47765a','#669055','#8fae62']);
    leaf(x-3,y-h-3,4,['#598050','#87a35b','#aabc66']);
  }
  return {rect,line,polygon,random,roll,cloud,sky,leaf,potted};
}

export function drawStreet(ctx) {
  const {rect,line,polygon,roll,sky,potted,leaf} = painter(ctx,41778);
  sky();
  // Plants and small second-storey apartment buildings behind the shops.
  rect(0,27,87,105,'#d0cbb4');rect(0,25,91,3,'#85978d');
  rect(55,17,83,100,'#e6d6b8');rect(53,14,86,4,'#aab6ab');
  rect(140,35,64,70,'#d3d3bb');rect(145,29,59,8,'#e5dbc4');
  rect(230,26,81,120,'#c1cbb6');rect(228,23,86,4,'#a3ad9c');
  rect(296,38,89,90,'#d2c9aa');
  for(const [x,y,w] of [[7,33,17],[30,33,17],[67,24,15],[93,24,16],[120,24,10],[248,34,18],[281,34,17],[325,41,19]]) {
    rect(x,y,w,17,'#9baca0');rect(x+1,y+1,w-2,15,'#819a99');rect(x+3,y+2,3,13,'#a9bdb0');
    rect(x+(w>>1),y,1,16,'#d6d1b8');rect(x-1,y+16,w+2,2,'#dedbc5');
  }
  // The little florist with a green-and-cream scalloped awning.
  rect(-3,51,126,116,'#b59c78');
  rect(0,54,120,106,'#e4cda6');
  rect(1,48,121,5,'#556862');rect(0,47,124,2,'#788981');
  rect(10,62,100,20,'#a68c63');rect(12,63,96,16,'#eee2bc');
  rect(21,70,9,1,'#a18f64');rect(88,70,12,1,'#a18f64');
  ctx.font='bold 10px sans-serif';ctx.fillStyle='#53775d';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('花　の　店',59,75);
  rect(3,95,107,61,'#866d53');rect(7,98,71,56,'#778b76');
  for(let i=10;i<73;i+=22){
    rect(i,102,17,45,'#91aea0');polygon([[i+1,103],[i+12,103],[i+1,120]],'#b4c6ad');
    rect(i,132,19,2,'#607666');
  }
  rect(82,99,26,61,'#8a6a4e');rect(85,101,20,38,'#9eafa0');rect(86,103,4,28,'#b8c6a9');rect(103,142,2,4,'#e2d1a3');
  for(let i=-5;i<119;i+=16){
    const k=((i+5)/16)%2, c=k?'#deddb4':'#719478', d=k?'#c7c5a4':'#5b7e63';
    polygon([[i+4,84],[i+20,84],[i+13,97],[i-3,97]],c);
    rect(i-3,97,16,4,d);rect(i-2,101,14,1,d);
  }
  rect(0,82,122,3,'#647a65');
  rect(7,149,50,6,'#9e7b51');rect(10,154,2,6,'#80664a');rect(53,154,2,6,'#80664a');
  for(const x of [11,24,37,51,64,112]) potted(x,x===64||x===112?161:150,roll(11,18));
  for(const x of [11,24,50])for(let j=0;j<6;j++)rect(x+roll(-5,3),134+roll(-4,5),2,2,x===24?'#ede5a4':'#df9983');
  // A narrow recessed alley, faded posters, and a tiled-roof tea shop.
  rect(123,67,23,99,'#777b69');rect(126,67,6,89,'#92937b');
  rect(133,94,8,41,'#616f63');rect(131,133,11,21,'#878775');
  rect(145,51,159,114,'#cfbd9a');rect(148,45,153,11,'#b3a78a');
  polygon([[141,55],[153,38],[291,38],[307,55]],'#627575');
  for(let y=40;y<55;y+=4){rect(152-(y-39)/2,y,140+y-39,1,'#8b9990');}
  for(let x=154;x<293;x+=8)line(x,39,x-6,54,'#4e6666');
  rect(142,55,165,3,'#485955');rect(143,58,161,2,'#c6a77d');
  rect(151,61,146,24,'#e4d0a9');
  for(const x of [156,288])rect(x,60,3,99,'#ac8b69');
  rect(173,64,100,18,'#ab8962');rect(175,65,96,14,'#eadab7');
  ctx.font='bold 11px serif';ctx.fillStyle='#6d674d';ctx.fillText('つ ば め 茶 屋',223,77);
  rect(150,88,147,65,'#806b56');rect(154,96,139,56,'#50645b');
  for(let i=157;i<293;i+=11){
    rect(i,105,9,42,'#839083');rect(i,107,2,36,'#9fa595');
    rect(i+9,103,2,51,'#826b51');
  }
  rect(152,127,139,2,'#75694e');
  for(let i=154;i<293;i+=5){rect(i,143,3,13,'#9e805c');}
  rect(144,86,160,4,'#695d4b');rect(145,85,156,2,'#aa8b64');
  for(let i=162;i<257;i+=19){
    rect(i,90,18,18,'#506e76');rect(i+2,90,4,15,'#678187');
    rect(i+6,95,4,5,'#d6d3af');rect(i+9,97,3,1,'#d6d3af');
  }
  rect(273,100,11,22,'#bd6f4b');rect(271,104,15,13,'#cb8057');
  rect(276,99,5,2,'#645e4b');rect(275,121,7,2,'#675a47');
  for(let y=106;y<118;y+=4)rect(272,y,13,1,'#ac6648');
  rect(147,156,151,4,'#bbb49a');
  potted(153,164,15);potted(293,163,22);
  // Sunlit vending machine tucked between the tea shop and a timber townhouse.
  rect(304,63,61,99,'#a49b84');rect(309,68,52,78,'#beb79c');
  rect(315,100,33,61,'#82908a');rect(313,98,32,62,'#e6e6d3');rect(313,98,30,2,'#f6f0d6');
  rect(315,102,26,26,'#7b9695');rect(316,103,24,23,'#c0d1c1');
  for(let row=0;row<2;row++)for(let col=0;col<5;col++){
    const c=['#ddac56','#699c8a','#c97e62','#a2b8ba','#e0d1a1'][(col+row*3)%5];
    rect(317+col*5,105+row*11,3,7,c);rect(318+col*5,104+row*11,1,1,'#f1ebd0');
  }
  rect(316,113,25,2,'#719193');rect(316,124,25,2,'#719193');
  rect(316,128,25,2,'#a75e4c');rect(334,134,7,5,'#73847a');
  rect(317,149,19,5,'#526963');rect(321,150,12,2,'#344e49');
  rect(314,157,29,2,'#b1b9a8');rect(311,160,37,2,'#939786');
  // Townhouse, tile gables, balcony and hanging plants.
  rect(363,37,124,124,'#c9ad89');rect(367,37,119,40,'#ddc6a2');
  polygon([[355,38],[388,14],[481,14],[490,39]],'#657573');
  for(let y=17;y<38;y+=4)rect(387-(y-16)*1.2,y,135,1,'#8e9b8e');
  rect(357,38,130,3,'#4a615c');
  for(const x of [376,412,449]){
    rect(x,44,26,30,'#8a7a61');rect(x+2,46,22,24,'#9db0a2');
    rect(x+12,45,2,26,'#8f8068');rect(x+3,47,4,15,'#c3cbb5');
  }
  rect(363,69,117,3,'#776a52');rect(363,81,117,3,'#786b56');
  for(let x=365;x<481;x+=6)rect(x,70,2,12,'#99836a');
  polygon([[358,85],[480,85],[480,99],[353,99]],'#69847a');rect(352,99,128,3,'#526c63');
  rect(369,103,104,55,'#9f8667');rect(374,105,96,45,'#8fa093');
  for(let x=375;x<472;x+=7)rect(x,105,2,50,'#90775e');
  rect(369,149,104,7,'#b49671');rect(358,156,124,6,'#b9af93');
  potted(371,164,22);potted(465,164,21);potted(475,164,31);
  // Fine overhead lines and weathered utility pole.
  for(const y of [1,6]){
    line(0,y+6,106,y+19,'#778c83');line(106,y+19,212,y+20,'#778c83');line(212,y+20,352,y+4,'#778c83');
  }
  rect(349,3,4,157,'#929583');rect(349,4,1,151,'#b8b29a');
  rect(341,9,18,2,'#7e8a7f');rect(344,6,3,4,'#c5cbb8');rect(356,5,2,5,'#c5cbb8');
  // Large paving blocks open up towards the screen, leaving room for birds.
  rect(0,165,480,105,'#d8ceb6');rect(0,164,480,2,'#bdb69e');
  const stripRows=[166,173,183,196,212,233,258,289];
  for(let i=0;i<stripRows.length-1;i++){
    const y=stripRows[i], h=stripRows[i+1]-y, w=33+i*9;
    for(let x=(i%2===0?-13:-w*.65);x<480;x+=w){
      const color=['#ded4bc','#dbd0b8','#e2d7c1','#ddd2b9','#d9cdb5'][roll(0,4)];
      rect(x,y,w-1,h-1,color);rect(x+1,y,w-2,1,'#e6dcc5');
    }
  }
  for(let i=0;i<440;i++){
    const x=roll(0,479),y=roll(166,269);rect(x,y,roll(1,3),1,roll(0,1)?'#cfc3aa':'#e7ddc8');
  }
  // Thin drainage channel runs along the kerb.
  rect(0,163,480,1,'#a8a68f');
  for(const x of [42,193,382]){
    rect(x,164,21,3,'#89958b');for(let j=2;j<20;j+=4)rect(x+j,164,2,2,'#c2c2ab');
  }
  // A few leaves and low branches soften the near edge.
  leaf(-4,96,15,['#587e5b','#7c9c63','#a3b773']);
}

export function drawRiver(ctx) {
  const {rect,line,polygon,roll,random,sky,leaf} = painter(ctx,781020);
  sky();
  polygon([[0,65],[25,61],[46,65],[71,59],[97,64],[129,52],[145,54],[161,48],[185,52],[203,47],[230,57],[262,51],[293,56],[336,41],[350,44],[366,42],[400,55],[427,51],[452,60],[480,55],[480,107],[0,107]],'#9dbdb0');
  polygon([[0,76],[35,70],[57,70],[82,64],[109,70],[158,60],[184,66],[221,60],[250,67],[279,62],[321,61],[345,53],[374,57],[402,53],[440,62],[480,56],[480,107],[0,107]],'#8aaf9d');
  // Distant houses on the far levee.
  for(let x=-10;x<480;){
    const w=roll(12,29),h=roll(7,17),y=84-h;
    const wall=['#d8cfb3','#e3d9be','#c1c4b0','#c5c8b2'][roll(0,3)];
    rect(x,y,w,h,wall);polygon([[x-2,y],[x+3,y-4],[x+w-4,y-4],[x+w+2,y]],['#899793','#8e9585','#a39d88'][roll(0,2)]);
    for(let a=3;a<w-3;a+=6)rect(x+a,y+3,3,4,'#93a59c');
    x+=w+roll(2,9);
  }
  rect(0,81,480,10,'#98ac86');
  for(let i=0;i<93;i++){
    const x=roll(-4,484);leaf(x,roll(77,84),roll(3,9),['#759b78','#87aa7f','#9bb48c']);
  }
  polygon([[0,89],[159,84],[323,88],[480,82],[480,100],[286,98],[81,100],[0,103]],'#97a187');
  rect(0,96,480,66,'#76b8c3');rect(0,103,480,11,'#83bfc7');rect(0,125,480,7,'#75b6bd');rect(0,140,480,14,'#6faeb3');
  for(let i=0;i<1250;i++){
    const x=roll(0,480),y=roll(97,158);
    const c=['#9ccbc9','#abd3cd','#71afb7','#66a8b0','#80bbc0','#b8dad0'][roll(0,5)];
    rect(x,y,roll(2,Math.max(3,(y-90)>>2)),1,c);
  }
  // Low pastel steel truss bridge, slightly set back in the river valley.
  const spans=[42,101,160,219,278,337,396];
  for(const x of spans){
    polygon([[x+5,92],[x+11,92],[x+13,110],[x+3,110]],'#91aaa1');
    rect(x+4,93,6,17,'#aab8a8');rect(x+1,107,13,3,'#9eaea1');
    for(let i=0;i<4;i++)rect(x+roll(0,15),112+i*2,roll(6,14),1,'#86b7b4');
  }
  for(let s=0;s<6;s++){
    const x=spans[s];
    const truss='#6c9189',lit='#b1c4ac';
    for(const [a,b,c,d] of [[1,89,12,72],[12,72,47,72],[47,72,58,89],[12,72,25,89],[25,89,36,72],[36,72,48,89]]){
      line(x+a,b,x+c,d,truss,2);line(x+a,b-1,x+c,d-1,lit);
    }
    for(const offset of [12,25,36,47])line(x+offset,73,x+offset,89,'#8ba69a');
  }
  rect(0,88,425,2,'#b5bd9f');rect(0,90,425,3,'#6e8276');rect(0,92,425,1,'#657c73');
  // Near bank, fringed by sedges, buttercups, pale grasses and sandy silt.
  polygon([[0,123],[39,130],[114,144],[206,149],[310,144],[398,133],[480,116],[480,183],[0,183]],'#648b5b');
  polygon([[0,126],[58,137],[115,147],[210,151],[312,147],[400,136],[480,119],[480,185],[0,185]],'#8da761');
  for(let i=0;i<2350;i++){
    const x=roll(0,480);
    const y0=Math.round(123+28*Math.sin(Math.PI*x/480)-7*x/480);
    const y=roll(y0,y0+26);
    const c=['#a5b96b','#aebf75','#7c9c60','#b8c67e','#74915a'][roll(0,4)];
    rect(x,y,roll(1,4),roll(1,2),c);
    if(i%5===0)line(x,y,x+roll(-2,2),y-roll(2,6),c);
  }
  for(let i=0;i<85;i++){
    const x=roll(2,478),y=Math.round(134+26*Math.sin(Math.PI*x/480)-8*x/480)+roll(0,12);
    line(x,y,x+1,y-3,'#829353');rect(x,y-4,2,2,i%3?'#f0d77e':'#e9e0aa');
  }
  // Pale path with irregular shoulders and a faint furrow from bicycle wheels.
  let rim=[];
  for(let x=-5;x<=485;x+=5){
    rim.push([x,Math.round(161+15*Math.sin(x/148)+roll(-1,1))]);
  }
  polygon([...rim,[485,270],[-5,270]],'#ddca9d');
  for(let i=0;i<rim.length-1;i++){
    const [x,y]=rim[i];
    rect(x,y-1,roll(2,6),2,'#b5b67a');
    if(i%3===0)rect(x+1,y+1,3,1,'#c6bc88');
  }
  for(let i=0;i<1150;i++){
    const x=roll(0,479),y=roll(160,269);
    if(y<163+15*Math.sin(x/148))continue;
    const far=y<190;
    rect(x,y,roll(1,far?3:5),1,['#d3be92','#e7d5ad','#d7c495','#e2cea2'][roll(0,3)]);
  }
  // Dappled grass verge close to the viewer.
  polygon([[0,239],[26,246],[54,248],[82,257],[142,269],[0,270]],'#99aa67');
  polygon([[378,270],[420,259],[454,254],[480,246],[480,270]],'#96a968');
  for(let i=0;i<570;i++){
    const x=roll(0,480),y=roll(236,270);
    if(y<(x<160?239+x*.24:365-x*.25))continue;
    const c=['#aeb876','#c1bf84','#869f64','#6e9159'][roll(0,3)];
    line(x,y,x+roll(-3,3),y-roll(1,5),c);
  }
  // Weathered timber posts and thin rope follow the turn of the river.
  const posts=[[-6,139],[42,149],[97,157],[158,163],[231,165],[311,160],[397,150],[486,129]];
  for(let i=0;i<posts.length;i++){
    const [x,y]=posts[i],h=13;
    if(i<posts.length-1) {
      const [nx,ny]=posts[i+1], mx=(x+nx)>>1, my=(y+ny)/2-6;
      line(x+1,y-10,mx,my,'#8c8866');line(mx,my,nx,ny-10,'#8c8866');
    }
    rect(x,y-h,4,h,'#8e8864');rect(x,y-h,2,h,'#b2a379');rect(x,y-h,4,1,'#c3b48b');
  }
  // A riverside willow frames the right edge and leaves the central river view open.
  polygon([[480,157],[473,156],[469,148],[467,120],[470,81],[464,58],[453,41],[457,39],[471,54],[474,75],[476,30],[480,23]],'#706e4c');
  line(474,140,476,85,'#978555',2);line(469,115,472,85,'#8b8052');
  for(let i=0;i<140;i++){
    const x=roll(407,500), y=roll(-19,43);
    if((x-479)**2/4700+(y+7)**2/1900>1.25)continue;
    leaf(x,y,roll(4,9),['#4f815e','#67935e','#89a966']);
    if(random()<.33) {
      let lx=x;
      for(let j=0;j<roll(4,12);j++){
        const ly=y+j*3, nx=lx+roll(-1,1);
        line(lx,ly,nx,ly+3,'#719459');rect(nx-2,ly+1,2,3,'#81a462');lx=nx;
      }
    }
  }
}

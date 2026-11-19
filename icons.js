const ink='#465243',green='#7f9c67',light='#c8d9a1',blue='#95b8be',wood='#b98151',gold='#eac766',cream='#fff9dc';
const shape=(d,c=ink)=>'<path fill="'+c+'" d="'+d+'"/>';
const rect=(x,y,w,h,c=ink)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';
const icons={
binocular:shape('M4 3h6v3h4V3h6v6h2v5h2v6h-2v2h-9v-3h-2v3H2v-2H0v-7h2V9h2z')+rect(5,5,4,5,green)+rect(15,5,4,5,green)+rect(3,11,6,3,light)+rect(15,11,6,3,light)+rect(2,16,7,4,blue)+rect(15,16,7,4,blue)+rect(3,16,3,2,cream)+rect(16,16,3,2,cream),
map:shape('M1 5l7-2 8 3 7-3v16l-7 3-8-3-7 2z')+shape('M3 7l4-1v11l-4 1z',light)+shape('M9 6l6 2v11l-6-2z','#eddaa1')+shape('M17 8l4-2v12l-4 1z',green)+rect(6,11,4,2,wood)+rect(10,12,3,2,wood)+rect(13,10,3,2,wood),
pin:shape('M7 2h10v2h3v9h-2v3h-3v3h-2v3h-2v-3H9v-3H6v-3H4V5h3z')+rect(8,5,8,8,green)+rect(10,7,4,4,cream),
bird:shape('M12 4h6v2h2v3h3v2h-4v5h-2v2H7v-1H2v-2H0v-2h6v-2h4V9h2z')+rect(12,9,5,4,'#8eb197')+rect(6,13,9,3,blue)+rect(16,6,1,1,cream)+rect(9,18,2,3,wood)+rect(14,18,2,3,wood),
book:shape('M0 4h3V2h7v1h4V2h7v2h3v17h-9v2H9v-2H0z')+shape('M3 4h6v1h2v14H9v-1H3z','#efdfae')+shape('M13 5h2V4h6v14h-6v1h-2z','#fff3cf')+rect(4,7,5,1,wood)+rect(4,10,4,1,wood)+rect(15,7,5,1,wood)+rect(15,10,4,1,wood)+rect(1,19,9,1,green)+rect(14,19,9,1,green),
hand:shape('M4 13h3V5h4V3h3v2h3v2h3v3h2v8h-2v3H9v-2H7v-2H4z')+shape('M6 14h3V7h2v5h2V5h1v7h2V7h1v6h2v-2h1v6h-2v2h-8v-2H8v-2H6z','#e9c795'),
seed:shape('M7 2h11v3h-2v3h2v3h2v4h2v5h-3v2H5v-2H3v-5h2v-4h2V8h2V5H7z')+shape('M9 3h6v2h-2v2h-2V5H9z','#f1ce85')+rect(9,8,7,2,wood)+shape('M9 11h7v2h2v3h2v3H6v-5h2v-2h1z','#e8b971')+shape('M11 13h3v2h-1v2h-3v-2h1z',wood),
wings:shape('M2 3h2v3h3v3h4l2 2 2-4h4V5h4v5h-2v4h-3v4h-3v3H8v-3H5v-4H3V9H1z')+shape('M3 6h1v2h3v3h3v3h2v4H9v-2H7v-3H5v-3H3z',blue)+shape('M15 10h3V8h3v2h-2v3h-3v3h-2z','#a6aaa1'),
mute:shape('M2 9h4l5-5h2v16h-2l-5-5H2z')+shape('M16 8h2v2h2V8h2v2h-2v3h2v2h-2v-2h-2v2h-2v-2h2v-3h-2z'),
sound:shape('M2 9h4l5-5h2v16h-2l-5-5H2zM16 8h2v8h-2zM20 5h2v14h-2z'),cursor:shape('M4 2h2v2h2v2h2v2h2v2h2v2h2v2h3v2h-7l4 5-3 2-4-6-5 4z'),pause:rect(5,4,5,16)+rect(14,4,5,16),play:shape('M6 3l14 9-14 9z'),expand:shape('M2 3h8v3H5v5H2zM15 3h7v8h-3V6h-4zM2 14h3v5h5v3H2zM19 14h3v8h-7v-3h4z'),grid:rect(2,2,8,8)+rect(14,2,8,8)+rect(2,14,8,8)+rect(14,14,8,8)
};
export const icon=name=>'<svg class="pix" viewBox="0 0 24 24" shape-rendering="crispEdges" aria-hidden="true">'+icons[name]+'</svg>';

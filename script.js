const YOUTUBE_LIVE_URL = "https://www.youtube.com/@lmreicaryt/live";
const LIVE_STATUS_URL = `live-status.json?v=${Date.now()}`;
const FALLBACK_STATUS = { live:false, game:null, title:null, videoId:null };

function updateLiveGameStatus(data){
  const liveGame = data?.live ? data.game : null;
  document.querySelectorAll('[data-game]').forEach(card=>{
    const isLive = Boolean(liveGame && liveGame === card.dataset.game);
    const status = card.querySelector('[data-live-status]');
    card.classList.toggle('is-live',isLive);
    card.classList.toggle('is-not-live',!isLive);
    if(status){status.textContent=isLive?'🔴 AO VIVO AGORA':'EM BREVE';status.classList.toggle('is-live-status',isLive);}
    card.setAttribute('aria-live-status',isLive?'online':'offline');
    card.onclick=isLive?()=>window.open(YOUTUBE_LIVE_URL,'_blank','noopener'):null;
    card.style.cursor=isLive?'pointer':'default';
  });
  const liveNotice=document.querySelector('[data-live-notice]');
  const liveTitle=document.querySelector('[data-live-title]');
  if(liveNotice){liveNotice.classList.toggle('show',Boolean(data?.live));liveNotice.setAttribute('aria-hidden',data?.live?'false':'true');}
  if(liveTitle) liveTitle.textContent=data?.live&&data.title?data.title:'Nenhuma live acontecendo agora';
}
async function fetchLiveStatus(){
  try{const response=await fetch(LIVE_STATUS_URL,{cache:'no-store'});if(!response.ok)throw new Error('Não foi possível carregar o status.');updateLiveGameStatus(await response.json());}
  catch(error){console.warn('Status automático indisponível:',error);updateLiveGameStatus(FALLBACK_STATUS);}
}
fetchLiveStatus();
setInterval(fetchLiveStatus,60000);

const supportBtn=document.getElementById('supportBtn');
const pixModal=document.getElementById('pixModal');
const closePix=document.getElementById('closePix');
const copyPix=document.getElementById('copyPix');
const pixKey='cl284598@gmail.com';
supportBtn?.addEventListener('click',()=>pixModal?.classList.add('show'));
closePix?.addEventListener('click',()=>pixModal?.classList.remove('show'));
pixModal?.addEventListener('click',e=>{if(e.target===pixModal)pixModal.classList.remove('show')});
copyPix?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pixKey);copyPix.textContent='CHAVE COPIADA ✓'}catch{copyPix.textContent=pixKey}setTimeout(()=>copyPix.textContent='COPIAR CHAVE PIX',1800)});

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')})},{threshold:.12});
document.querySelectorAll('.section,.support,.next-live').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(24px)';el.style.transition='opacity .7s ease, transform .7s ease';observer.observe(el)});
const style=document.createElement('style');style.textContent='.section.visible,.support.visible,.next-live.visible{opacity:1!important;transform:translateY(0)!important}';document.head.appendChild(style);

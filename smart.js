(function(){
  'use strict';

  const FIREBASE_CONFIG={
    apiKey:'AIzaSyDMYBcqeFYN5esiJWU3uOwpSF3lpJ1YsoM',
    authDomain:'kite-df7f4.firebaseapp.com',
    databaseURL:'https://kite-df7f4-default-rtdb.europe-west1.firebasedatabase.app',
    projectId:'kite-df7f4',
    storageBucket:'kite-df7f4.firebasestorage.app',
    messagingSenderId:'862575962733',
    appId:'1:862575962733:web:de9ecde7b7ba4c41e66d64'
  };
  const AETHERLAB_URL='https://labelonline.github.io/AetherLab/';
  const root=document.getElementById('smartRoot');
  const SOCIALS=[['instagram','Instagram','IG'],['tiktok','TikTok','TT'],['youtube','YouTube','YT'],['telegram','Telegram','TG'],['x','X','X'],['vk','VK','VK'],['facebook','Facebook','FB'],['website','Сайт','WWW']];

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function http(v){return /^https?:\/\//i.test(String(v||'').trim());}
  function asset(path){return new URL(path,location.href).href;}
  function cleanSlug(v){return decodeURIComponent(String(v||'')).trim().replace(/^#|^\//g,'').split(/[?&/]/)[0].toLowerCase();}
  function getSlug(){
    const hash=cleanSlug(location.hash);
    if(hash) return hash;
    const qs=new URLSearchParams(location.search);
    const q=cleanSlug(qs.get('id')||qs.get('slug')||'');
    if(q) return q;
    const marker='/AetherLab-SmartLinks/';
    const i=location.pathname.indexOf(marker);
    if(i>=0){const tail=cleanSlug(location.pathname.slice(i+marker.length));if(tail&&tail!=='index.html')return tail;}
    return '';
  }
  function fmtDate(v){
    if(!v)return '';
    const d=new Date(String(v).length<=10?String(v)+'T12:00:00':v);
    if(Number.isNaN(d.getTime()))return String(v);
    try{return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(d)}catch(e){return String(v)}
  }
  function brandIcon(id,fallback){
    const common='viewBox="0 0 24 24" aria-hidden="true" focusable="false"';
    const icons={
      spotify:`<svg ${common}><circle cx="12" cy="12" r="10" fill="#1ed760"/><path d="M6.7 9.2c3.5-1 7.7-.8 10.8.7M7.4 12.3c2.9-.8 6.5-.6 9.2.6M8 15.2c2.4-.6 5.3-.5 7.7.5" fill="none" stroke="#07130b" stroke-width="1.6" stroke-linecap="round"/></svg>`,
      apple:`<svg ${common}><rect x="2" y="2" width="20" height="20" rx="6" fill="#fa3158"/><path d="M14.8 6.2v9.1a2.5 2.5 0 1 1-1.3-2.2V8.4l5-1v6.8a2.5 2.5 0 1 1-1.3-2.2V6.1z" fill="#fff"/></svg>`,
      youtubeMusic:`<svg ${common}><circle cx="12" cy="12" r="10" fill="#ff0033"/><circle cx="12" cy="12" r="5.8" fill="none" stroke="#fff" stroke-width="1.2"/><path d="m10 8.8 5.2 3.2-5.2 3.2z" fill="#fff"/></svg>`,
      youtube:`<svg ${common}><rect x="2.4" y="5.5" width="19.2" height="13" rx="4" fill="#ff0033"/><path d="m10 9 5.3 3-5.3 3z" fill="#fff"/></svg>`,
      deezer:`<svg ${common}><path d="M3 15h4v4H3zm4.7-3h4v7h-4zm4.7-3h4v10h-4zm4.7-3h4v13h-4z" fill="#a855f7"/></svg>`,
      tidal:`<svg ${common}><path d="m12 4 3 3-3 3-3-3zm-6 3 3 3-3 3-3-3zm12 0 3 3-3 3-3-3zm-6 6 3 3-3 3-3-3z" fill="#fff"/></svg>`,
      amazon:`<svg ${common}><path d="M7 6v8.2a2.2 2.2 0 1 0 1.4 2V9l7-1.6v5.8a2.2 2.2 0 1 0 1.4 2V5.2z" fill="#25d1da"/><path d="M6 20c3.8 1.5 8.1 1.4 12-.3" fill="none" stroke="#25d1da" stroke-width="1.2" stroke-linecap="round"/></svg>`,
      soundcloud:`<svg ${common}><path d="M4 14.5h1.2v4H4zm2-2h1.2v6H6zm2-1.6h1.2v7.6H8zm2-1.1h1.2v8.7H10zm2.2 8.7h5.2a3.1 3.1 0 0 0 .2-6.2 5.1 5.1 0 0 0-5.4-3.9z" fill="#ff6a00"/></svg>`,
      yandex:`<svg ${common}><circle cx="12" cy="12" r="10" fill="#ff2b2b"/><path d="M8.2 6.2h3.4c3.1 0 4.5 1.4 4.5 3.6 0 1.7-.8 2.8-2.4 3.5l2.8 4.5h-2.8l-2.4-4.1h-.7v4.1H8.2zm2.4 2v3.6h.9c1.5 0 2.2-.6 2.2-1.8s-.7-1.8-2.2-1.8z" fill="#fff"/></svg>`,
      vk:`<svg ${common}><rect x="2" y="4" width="20" height="16" rx="5" fill="#2787f5"/><path d="M5.7 8.2h2.5c.2 2.2 1.1 4 2.1 4.2V8.2h2.4v2.4c1-.1 2-1.5 2.3-2.4h2.4c-.3 1.4-1.6 2.8-2.5 3.4 1 .5 2.6 1.8 3.2 4.1h-2.7c-.4-1.1-1.5-2.5-2.7-2.6v2.6h-.3c-4.8 0-7-3.3-7.1-7.5z" fill="#fff"/></svg>`,
      instagram:`<svg ${common}><defs><linearGradient id="igx" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#ffd600"/><stop offset=".45" stop-color="#ff0169"/><stop offset="1" stop-color="#7b2cff"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igx)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.5" cy="6.7" r="1.2" fill="#fff"/></svg>`,
      tiktok:`<svg ${common}><path d="M14.5 4c.4 2.3 1.8 3.6 4 3.8v2.4c-1.5 0-2.8-.5-4-1.4v5.4a4.9 4.9 0 1 1-4.2-4.9v2.5a2.5 2.5 0 1 0 1.8 2.4V4z" fill="#fff"/></svg>`,
      telegram:`<svg ${common}><circle cx="12" cy="12" r="10" fill="#29a9ea"/><path d="m5.3 11.5 12.9-5c.6-.2 1 .2.8 1l-2.2 10.2c-.2.7-.7.9-1.3.5l-3.3-2.4-1.6 1.6c-.2.2-.3.3-.7.3l.2-3.4 6.2-5.6c.3-.2-.1-.4-.4-.2l-7.7 4.8-3.3-1c-.7-.2-.7-.7.4-.8z" fill="#fff"/></svg>`,
      x:`<svg ${common}><path d="M5 4h3.7l4 5.3L17.3 4H19l-5.5 6.6L19.5 20h-3.7l-4.4-5.8L6.2 20H4.5l6-7.1z" fill="#fff"/></svg>`,
      facebook:`<svg ${common}><circle cx="12" cy="12" r="10" fill="#1877f2"/><path d="M13.5 20v-7h2.3l.4-2.7h-2.7V8.6c0-.8.2-1.3 1.4-1.3h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v1.7H8v2.7h2.5v7z" fill="#fff"/></svg>`,
      website:`<svg ${common}><circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M3.5 12h17M12 3c2.2 2.4 3.4 5.4 3.4 9S14.2 18.6 12 21M12 3C9.8 5.4 8.6 8.4 8.6 12s1.2 6.6 3.4 9" fill="none" stroke="#fff" stroke-width="1.4"/></svg>`
    };
    return icons[id]||`<span>${esc(fallback||'♪')}</span>`;
  }
  function errorPage(title,text){
    root.className='sl-page';
    root.innerHTML=`<div class="sl-error"><img class="sl-error-logo" src="${asset('favicon.png')}" alt="AetherLab"><h1>${esc(title)}</h1><p>${esc(text)}</p><a href="${AETHERLAB_URL}">AetherLab</a></div>`;
  }
  function bgHtml(item){
    const t=item.theme||{},cover=String(item.coverUrl||'');
    if(t.background==='blur'&&cover)return `<div class="sl-bg" style="background-image:url('${esc(cover)}');--sl-blur:${Number(t.blur||34)}px"></div><div class="sl-bg-overlay"></div>`;
    if(t.background==='gradient')return '<div class="sl-bg-gradient"></div>';
    return `<div class="sl-bg-gradient" style="background:${esc(t.backgroundColor||'#090c12')}"></div>`;
  }
  function render(item){
    const t=item.theme||{};
    const services=(Array.isArray(item.services)?item.services:[]).filter(s=>http(s.url));
    const socials=SOCIALS.map(([id,name,mark])=>({id,name,mark,url:String((item.socials||{})[id]||'').trim()})).filter(s=>http(s.url));
    document.title=`${item.title||'Release'} — ${item.artist||'AetherLab'}`;
    document.documentElement.style.setProperty('--sl-text',t.text||'#fff');
    document.documentElement.style.setProperty('--sl-card-radius',`${Number(t.radius||14)}px`);
    document.documentElement.style.setProperty('--sl-cover-radius',`${Number(t.coverRadius||18)}px`);
    document.documentElement.style.setProperty('--sl-button',t.button||'#fff');
    document.documentElement.style.setProperty('--sl-button-text',t.buttonText||'#111');
    root.className='sl-page';
    root.innerHTML=`${bgHtml(item)}<main class="sl-content"><img class="sl-cover" src="${esc(item.coverUrl||asset('favicon.png'))}" alt="${esc(item.title||'Release cover')}"><h1 class="sl-title">${esc(item.title||'Untitled')}</h1><div class="sl-artist">${esc(item.artist||'')}</div>${item.releaseDate?`<div class="sl-release-date">${esc(fmtDate(item.releaseDate))}</div>`:''}<div class="sl-subtitle">${esc(item.subtitle||'Choose your preferred music service')}</div><div class="sl-services">${services.map(s=>`<a class="sl-service" href="${esc(s.url)}" target="_blank" rel="noopener" data-service="${esc(s.id||s.name)}"><span class="sl-service-logo">${brandIcon(s.id,s.mark||'♪')}</span><span class="sl-service-name">${esc(s.name||'Listen')}</span><span class="sl-service-cta">${esc(s.cta||'Play')}</span></a>`).join('')}</div>${socials.length?`<div class="sl-socials">${socials.map(s=>`<a class="sl-social" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.name)}" data-social="${esc(s.id)}">${brandIcon(s.id,s.mark)}</a>`).join('')}</div>`:''}<div class="sl-powered"><span>Powered by</span><a href="${AETHERLAB_URL}" target="_blank" rel="noopener"><img src="${asset('favicon.png')}" alt="AetherLab">AetherLab</a></div></main>`;
  }
  async function bump(path){try{await firebase.database().ref(path).transaction(v=>(Number(v)||0)+1)}catch(e){}}
  async function loadFromLegacy(db,slug){
    try{
      const snap=await db.ref('promoLinks').once('value');
      const all=snap.val()||{};
      for(const key of Object.keys(all)){
        const item=all[key]||{};
        if(!item.deleted&&String(item.slug||'').toLowerCase()===slug&&(item.kind==='aether-smart-link'||item.slug)) return {item,key,legacy:true};
      }
    }catch(e){}
    return null;
  }
  async function start(){
    const slug=getSlug();
    if(!slug){errorPage('Ссылка не найдена','В адресе отсутствует идентификатор смарт-линка.');return;}
    try{
      if(!firebase.apps.length)firebase.initializeApp(FIREBASE_CONFIG);
      const db=firebase.database();
      let found=null;
      try{
        const snap=await db.ref('publicSmartLinks/'+slug).once('value');
        if(snap.exists()&&snap.val()&&!snap.val().deleted)found={item:snap.val(),key:slug,legacy:false};
      }catch(e){}
      if(!found)found=await loadFromLegacy(db,slug);
      if(!found){errorPage('Смарт-линк не найден','Возможно, ссылка была удалена или адрес указан неверно.');return;}
      render(found.item);
      const statBase=found.legacy?`promoLinks/${found.key}/stats`:`publicSmartLinks/${slug}/stats`;
      const visitKey='aether_smart_visit_'+slug;
      try{if(!sessionStorage.getItem(visitKey)){sessionStorage.setItem(visitKey,'1');bump(statBase+'/views');}}catch(e){bump(statBase+'/views');}
      root.addEventListener('click',e=>{
        const a=e.target.closest('[data-service],[data-social]');if(!a)return;
        const name=a.dataset.service||('social_'+a.dataset.social);
        bump(statBase+'/clicks/'+String(name).replace(/[.#$\[\]\/]/g,'_'));
      });
    }catch(err){console.error(err);errorPage('Не удалось открыть ссылку','Проверьте интернет-соединение и попробуйте ещё раз.');}
  }
  start();
})();

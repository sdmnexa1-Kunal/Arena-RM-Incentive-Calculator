const $=id=>document.getElementById(id), money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
const state={sales:[]};
const POLICY={
  qualifyingCars:3,
  qualifyingVictoris:1,
  normal:{petrol:[500,500,1000,1000,1500,1500],cng:[200,200,300,300,500,500],after7:{petrol:2000,cng:750}},
  victoris:{petrol:[5000,6000],cng:[2500,3000]},
  sunroof:4000,
  higherVariant:2000,
  booking:[0,0,500,1000,1200],
  exchange:{normal:750,victoris:1000},
  trueValue:{normal:1000,victoris:2000},
  ew:{royal:200,solitaire:300},
  promoter:300
};
function fuel(x){return /CNG/i.test(x.variant)?'cng':'petrol'}
function isVictoris(x){return x.model==='VICTORIS'}
function isSunroof(x){return isVictoris(x)&&/\(O\)/i.test(x.variant)}
function isHigher(x){const v=x.variant.toUpperCase();return /ZXI\+|ZXI\b/.test(v)||((x.model==='NEW ALTO K-10'||x.model==='S-PRESSO')&&/VXI\+|VXI \(O\)/.test(v))}
function normalBase(x){const f=fuel(x), n=state.sales.filter(s=>!isVictoris(s)).findIndex(s=>s.id===x.id)+1;if(n<=0)return 0; if(n>=7)return POLICY.normal.after7[f]; return POLICY.normal[f][n-1]}
function victorisBase(x){const f=fuel(x), n=state.sales.filter(s=>isVictoris(s)).findIndex(s=>s.id===x.id)+1;return POLICY.victoris[f][n<=1?0:1]}
function bookingBonus(count){if(count<2)return 0;if(count<=3)return count*500;if(count===4)return count*1000;return count*1200}
function msgaRate(value){const n=Number(value||0);if(n>24000)return .025;if(n>=22001)return .02;if(n>=20000)return .015;return 0}
function calc(x){const base=isVictoris(x)?victorisBase(x):normalBase(x);const higher=isHigher(x)?POLICY.higherVariant:0;const sunroof=isSunroof(x)?POLICY.sunroof:0;const exchange=x.exchange==='New Car'?(isVictoris(x)?POLICY.exchange.victoris:POLICY.exchange.normal):x.exchange==='True Value Evaluator'?(isVictoris(x)?POLICY.trueValue.victoris:POLICY.trueValue.normal):0;const ew=x.ew?(x.ewType==='Royal Platinum'?POLICY.ew.royal:POLICY.ew.solitaire):0;const msga=Math.round(Number(x.msga||0)*msgaRate(x.msga));return {base,higher,sunroof,exchange,ew,msga,total:base+higher+sunroof+exchange+ew+msga}}
function qualification(){return {cars:state.sales.length,victoris:state.sales.filter(isVictoris).length,ok:state.sales.length>=3&&state.sales.some(isVictoris)}}
function spotLabel(c,x){const a=[];if(c.higher)a.push('Higher Variant ₹2,000');if(c.sunroof)a.push('Victoris Sunroof ₹4,000');return a.join(' + ')||'—'}
function render(){const q=qualification();let total=0,main=0,booking=bookingBonus(state.sales.length),exchange=0,ew=0,msga=0;state.sales.forEach(x=>{const c=calc(x);total+=c.total;main+=c.base+c.higher+c.sunroof;exchange+=c.exchange;ew+=c.ew;msga+=c.msga});total+=booking;let qualifiedTotal=q.ok?total:0;$('grandTotal').textContent=money(qualifiedTotal);$('sumTotal').textContent=money(qualifiedTotal);$('sumMain').textContent=money(main);$('sumBooking').textContent=money(booking);$('sumExchange').textContent=money(exchange);$('sumEW').textContent=money(ew);$('sumMSGA').textContent=money(msga);$('vehicleCount').textContent=state.sales.length;$('victorisCount').textContent=q.victoris;$('countText').textContent=`${state.sales.length} ${state.sales.length===1?'vehicle':'vehicles'}`;$('statusText').textContent=q.ok?'QUALIFIED':`NEED ${Math.max(3-state.sales.length,0)} CAR${Math.max(3-state.sales.length,0)===1?'':'S'} / 1 VICTORIS`;
$('qualificationNote').textContent=q.ok?`Qualification fulfilled: ${q.cars} vehicles including ${q.victoris} Victoris.`:`Qualifying condition: minimum 3 cars and retail of 1 Victoris in October.`;$('qualificationBanner').textContent=q.ok?'Qualified RM/SRM incentive shown.':'Qualification not met — potential earning is displayed as ₹0 until 3 cars + 1 Victoris are achieved.';$('summary').hidden=!state.sales.length;$('emptyTable').style.display=state.sales.length?'none':'block';
const groups=[['1–2 Cars','₹500 Petrol / ₹200 CNG'],['3–4 Cars','₹1,000 Petrol / ₹300 CNG'],['5–6 Cars','₹1,500 Petrol / ₹500 CNG'],['7th+','₹2,000 Petrol / ₹750 CNG'],['Victoris','₹5,000/₹6,000 Petrol • ₹2,500/₹3,000 CNG']];$('tiers').innerHTML=groups.map(g=>`<div class="tier"><small>${g[0]}</small><b>${g[1]}</b></div>`).join('');
$('salesBody').innerHTML=state.sales.map((x,i)=>{const c=calc(x);return `<tr><td>${i+1}</td><td class="model-name">${x.model}</td><td class="variant-name">${x.variant}</td><td>${x.exchange?'Yes':'No'}</td><td>${x.ew?(x.ewType||'Yes'):'No'}</td><td>${x.msga?'₹'+Number(x.msga).toLocaleString('en-IN'):'₹0'}</td><td>${spotLabel(c,x)}</td><td>${money(c.base+c.higher+c.sunroof)}</td><td>${q.ok?money(c.total):'Locked'}</td><td><button class="delete" data-id="${x.id}">×</button></td></tr>`}).join('');document.querySelectorAll('.delete').forEach(b=>b.onclick=()=>{state.sales=state.sales.filter(s=>s.id!==b.dataset.id);render()});}
function renderVisual(model){$('modelVisual').innerHTML=model?`<div class="visual-label">${model}<small>MODEL SELECTED</small></div>`:'<span>SELECT A MODEL</span>'}
model.onchange=()=>{variant.innerHTML='<option value="">Select variant</option>';variant.disabled=!model.value;$('addBtn').disabled=true;const rows=ARENA_VEHICLES.filter(x=>x.model===model.value);rows.forEach(x=>{const o=document.createElement('option');o.value=x.variant;o.textContent=x.variant;variant.appendChild(o)});renderVisual(model.value)};
variant.onchange=()=>{$('addBtn').disabled=!variant.value};
$('addBtn').onclick=()=>{const src=ARENA_VEHICLES.find(x=>x.model===model.value&&x.variant===variant.value);if(!src)return;state.sales.push({...src,exchange:$('exchange').value,ew:$('ew').value!=='No',ewType:$('ew').value,msga:Number($('msga').value||0),id:crypto.randomUUID()});model.value='';variant.innerHTML='<option value="">Select variant</option>';variant.disabled=true;$('addBtn').disabled=true;$('exchange').value='No';$('ew').value='No';$('msga').value='0';renderVisual('');render()};
$('resetBtn').onclick=()=>{if(!state.sales.length||confirm('Clear all vehicles?')){state.sales=[];render()}};
$('bookingDate').onchange=()=>{$('periodBadge').textContent='OCTOBER 2026';render()};
ARENA_VEHICLES.map(x=>x.model).filter((x,i,a)=>a.indexOf(x)===i).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;model.appendChild(o)});render();

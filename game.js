const books = [
  { id: "practical_farming", name: "농사 입문", type: "실용서", desc: "비료, 윤작, 종자 보관법.", risk: 0 },
  { id: "practical_medicine", name: "응급 처치", type: "실용서", desc: "지혈, 열 관리, 부목 고정.", risk: 0 },
  { id: "practical_water", name: "정수와 위생", type: "실용서", desc: "물 소독과 감염 예방법.", risk: 0 },
  { id: "tech_guns", name: "총기 정비 매뉴얼", type: "기술서", desc: "무기 분해·재조립.", risk: 2 },
  { id: "tech_explosive", name: "즉석 폭약 공학", type: "기술서", desc: "고위험 제작 지식.", risk: 3 },
  { id: "forbidden_cult", name: "금서: 군중심리", type: "금서", desc: "선동과 광신의 구조.", risk: 3 }
];

const requests = [{ id: "fertilizer" }, { id: "fever" }, { id: "defense" }, { id: "faith" }];
const requestTextPool = {
  fertilizer: ["비료 만드는 법이 적힌 책이 필요합니다.", "씨앗이 죽어가요. 토양 되살리는 기록이 있습니까?", "거름 배합법을 모르겠어. 이번 파종이 마지막이야."],
  fever: ["열병 치료법을 찾고 있어요.", "해열과 격리 절차가 필요합니다. 환자가 늘고 있습니다.", "아이들 고열이 멈추지 않습니다. 의학서를 빌려주세요."],
  defense: ["마을 방어선을 강화할 방법이 필요해.", "성문이 오래 못 버텨. 방어 설계 관련 책을 찾고 있어.", "습격이 예고됐어. 방어 준비 지식을 원한다."],
  faith: ["사람들 마음을 하나로 묶을 말이 필요합니다.", "공동체가 갈라지고 있어요. 결속에 관한 텍스트가 필요합니다.", "폭동 직전입니다. 사람들을 진정시킬 지식이 필요해요."]
};

const firstNames = ["민", "하", "준", "수", "율", "도", "린", "서", "진", "유", "나", "현"];
const lastNames = ["강", "서", "박", "윤", "한", "오", "남", "진", "백", "문", "심", "노"];
const jobs = ["정비사", "교사", "배달원", "경비", "간호사", "사서", "농부", "상인", "기록관", "통신병", "제빵사", "재단사"];
const accessories = ["붉은 스카프", "철제 반지", "검은 장갑", "청동 목걸이", "고글", "붕대", "은색 핀", "왼쪽 귀걸이", "가죽 팔찌", "파란 완장"];

const residentDirectory = Array.from({ length: 48 }, (_, i) => ({
  id: `R-${1000 + i}`,
  name: `${lastNames[i % lastNames.length]}${firstNames[(i * 3) % firstNames.length]}${firstNames[(i * 5 + 1) % firstNames.length]}`,
  apt: `${1 + (i % 9)}0${1 + (i % 5)}`,
  job: jobs[i % jobs.length],
  accessory: accessories[i % accessories.length]
}));

const questionTemplates = [
  { id: "id", label: "거래증서 확인" },
  { id: "permit", label: "보상 약속서 확인" },
  { id: "phone", label: "무전 연락처 확인" },
  { id: "accessory", label: "소지품 단서 대조" },
  { id: "reason", label: "요청 목적 확인" },
  { id: "history", label: "이전 대출 기록" }
];

const outcomeTable = {
  fertilizer: {
    practical_farming: [
      { chance: 0.85, result: "[탐험 보고서] 밭이 살아났습니다. 버섯과 감자가 올라와 식량 3상자를 보냈습니다.", food: 3, fuel: 0, threat: -1, death: false },
      { chance: 0.15, result: "[탐험 보고서] 비료 제조엔 성공했지만 저장고가 젖어 절반만 건졌습니다. 식량 1상자만 도착했습니다.", food: 1, fuel: 0, threat: 0, death: false }
    ],
    practical_medicine: [
      { chance: 0.8, result: "[탐험 보고서] 병충해 원인을 찾아내 밭 일부를 지켰습니다. 식량 2를 보냅니다.", food: 2, fuel: 0, threat: 0, death: false },
      { chance: 0.2, result: "[탐험 보고서] 소독은 했지만 비료법이 없어 수확이 적었습니다. 식량 1만 확보했습니다.", food: 1, fuel: 0, threat: 0, death: false }
    ],
    practical_water: [
      { chance: 0.85, result: "[탐험 보고서] 오염수 문제를 잡아 파종은 지켰습니다. 연료 1과 식량 1을 보냅니다.", food: 1, fuel: 1, threat: 0, death: false },
      { chance: 0.15, result: "[탐험 보고서] 물은 깨끗해졌지만 토양은 죽어 수확이 늦어집니다.", food: 0, fuel: 0, threat: 0, death: false }
    ],
    tech_guns: [
      { chance: 0.8, result: "[탐험 보고서] 씨앗 대신 탄약을 모으는 분위기가 퍼졌습니다. 방어는 올랐지만 배고픔이 커집니다.", food: 0, fuel: 1, threat: 2, death: false },
      { chance: 0.2, result: "[탐험 보고서] 식량 탐사대가 무장 충돌로 전멸했습니다. 책이 돌아오지 않았습니다.", food: 0, fuel: 0, threat: 3, death: true }
    ],
    tech_explosive: [
      { chance: 0.75, result: "[탐험 보고서] 창고 폭파로 해충은 사라졌으나 밭도 함께 날아갔습니다. 연료 2만 도착.", food: 0, fuel: 2, threat: 3, death: false },
      { chance: 0.25, result: "[탐험 보고서] 폭약 사고로 탐험대가 사망했습니다. 도서 소실.", food: 0, fuel: 0, threat: 4, death: true }
    ],
    forbidden_cult: [
      { chance: 0.9, result: "[탐험 보고서] '흙의 교리' 집회가 열려 작업 속도는 올랐지만 맹신 분위기가 짙어졌습니다. 식량 2.", food: 2, fuel: 0, threat: 2, death: false },
      { chance: 0.1, result: "[탐험 보고서] 교리 해석 다툼으로 분열이 발생, 대가가 오지 않았습니다.", food: 0, fuel: 0, threat: 3, death: false }
    ]
  },
  fever: {
    practical_farming: [
      { chance: 0.85, result: "[탐험 보고서] 허브 재배법만 건져 응급 대처했습니다. 식량 1과 연료 1을 보냅니다.", food: 1, fuel: 1, threat: 0, death: false },
      { chance: 0.15, result: "[탐험 보고서] 치료 실패로 1명이 사망. 공포가 번졌습니다.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    practical_medicine: [
      { chance: 0.88, result: "[탐험 보고서] 해열과 격리에 성공해 집단 감염을 막았습니다. 식량 2, 연료 1 도착.", food: 2, fuel: 1, threat: -1, death: false },
      { chance: 0.12, result: "[탐험 보고서] 12페이지가 찢겨 투약량 오류가 발생, 동료 한 명을 잃었습니다. 그래도 대가는 보냈습니다.", food: 1, fuel: 0, threat: 1, death: false }
    ],
    practical_water: [
      { chance: 0.86, result: "[탐험 보고서] 식수 소독으로 발병률이 크게 내려갔습니다. 연료 2 제공.", food: 0, fuel: 2, threat: 0, death: false },
      { chance: 0.14, result: "[탐험 보고서] 이미 늦은 환자들은 지키지 못했습니다. 공동체 사기는 하락.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    tech_guns: [
      { chance: 0.8, result: "[탐험 보고서] 약이 없어 병자를 버리고 무장 원정에 나섰습니다. 연료 2를 보냈지만 평판이 떨어졌습니다.", food: 0, fuel: 2, threat: 2, death: false },
      { chance: 0.2, result: "[탐험 보고서] 병자를 둘러싼 충돌 중 총기 오발. 요청자가 사망해 도서 소실.", food: 0, fuel: 0, threat: 3, death: true }
    ],
    tech_explosive: [
      { chance: 0.78, result: "[탐험 보고서] 감염 구역을 폭파 격리했습니다. 효과는 있었지만 반감이 큽니다. 연료 1.", food: 0, fuel: 1, threat: 3, death: false },
      { chance: 0.22, result: "[탐험 보고서] 폭발 사고와 2차 감염으로 팀이 붕괴. 책 소실.", food: 0, fuel: 0, threat: 4, death: true }
    ],
    forbidden_cult: [
      { chance: 0.9, result: "[탐험 보고서] 기도 집회로 공포는 진정됐지만 치료는 더뎠습니다. 식량 1.", food: 1, fuel: 0, threat: 2, death: false },
      { chance: 0.1, result: "[탐험 보고서] '정화 의식'이 폭주해 환자를 희생시켰습니다.", food: 0, fuel: 0, threat: 4, death: false }
    ]
  },
  defense: {
    practical_farming: [
      { chance: 0.85, result: "[탐험 보고서] 식량 비축으로 공성전을 버텨냈습니다. 식량 2.", food: 2, fuel: 0, threat: 0, death: false },
      { chance: 0.15, result: "[탐험 보고서] 보급은 됐지만 방어선이 얇아져 약탈 피해가 발생.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    practical_medicine: [
      { chance: 0.84, result: "[탐험 보고서] 부상자 회복 속도가 빨라 전열이 유지됐습니다. 식량 1, 연료 1.", food: 1, fuel: 1, threat: 0, death: false },
      { chance: 0.16, result: "[탐험 보고서] 치료는 성공했지만 탄약 부족으로 일부 방어선이 무너졌습니다.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    practical_water: [
      { chance: 0.86, result: "[탐험 보고서] 식수 확보로 장기 방어가 가능해졌습니다. 연료 2.", food: 0, fuel: 2, threat: 0, death: false },
      { chance: 0.14, result: "[탐험 보고서] 우물 독성 루머가 돌며 사기가 하락했습니다.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    tech_guns: [
      { chance: 0.82, result: "[탐험 보고서] 방어선이 강해져 약탈단을 격퇴했습니다. 연료 2, 식량 1.", food: 1, fuel: 2, threat: 2, death: false },
      { chance: 0.18, result: "[탐험 보고서] 무장 경쟁이 촉발돼 인근 마을과 전쟁 직전입니다.", food: 0, fuel: 0, threat: 4, death: false }
    ],
    tech_explosive: [
      { chance: 0.78, result: "[탐험 보고서] 폭약 함정이 적을 막았지만 민가 일부가 파괴됐습니다. 연료 3.", food: 0, fuel: 3, threat: 3, death: false },
      { chance: 0.22, result: "[탐험 보고서] 함정 조기 폭발로 요청자가 사망했습니다. 도서 소실.", food: 0, fuel: 0, threat: 4, death: true }
    ],
    forbidden_cult: [
      { chance: 0.92, result: "[탐험 보고서] 광신적 결속으로 전투력은 상승했습니다. 하지만 검열단이 생겼습니다. 식량 1.", food: 1, fuel: 0, threat: 3, death: false },
      { chance: 0.08, result: "[탐험 보고서] '이단 처벌'이 시작되어 내부 숙청이 발생했습니다.", food: 0, fuel: 0, threat: 5, death: false }
    ]
  },
  faith: {
    practical_farming: [
      { chance: 0.84, result: "[탐험 보고서] 공동 경작 규약이 만들어져 작은 화해가 일어났습니다. 식량 2.", food: 2, fuel: 0, threat: -1, death: false },
      { chance: 0.16, result: "[탐험 보고서] 설득은 실패했지만 배급 기준은 정리되었습니다. 식량 1.", food: 1, fuel: 0, threat: 0, death: false }
    ],
    practical_medicine: [
      { chance: 0.85, result: "[탐험 보고서] 치유 공동체가 생겨 갈등이 완화됐습니다. 식량 1, 연료 1.", food: 1, fuel: 1, threat: -1, death: false },
      { chance: 0.15, result: "[탐험 보고서] 치료 우선순위를 두고 말다툼이 벌어졌습니다.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    practical_water: [
      { chance: 0.85, result: "[탐험 보고서] 공동 우물 규칙이 합의되어 분쟁이 줄었습니다. 연료 1.", food: 0, fuel: 1, threat: -1, death: false },
      { chance: 0.15, result: "[탐험 보고서] 물 배분을 둘러싼 불만이 남아 있습니다.", food: 0, fuel: 0, threat: 1, death: false }
    ],
    tech_guns: [
      { chance: 0.8, result: "[탐험 보고서] 무장 경비대가 질서를 잡았습니다. 당장은 안전하지만 공포 통치가 시작됩니다.", food: 0, fuel: 2, threat: 3, death: false },
      { chance: 0.2, result: "[탐험 보고서] 무장파 내분으로 요청자가 사망. 책 회수 실패.", food: 0, fuel: 0, threat: 4, death: true }
    ],
    tech_explosive: [
      { chance: 0.77, result: "[탐험 보고서] 기념탑 폭파 사건 이후 강경파가 권력을 잡았습니다. 연료 2.", food: 0, fuel: 2, threat: 4, death: false },
      { chance: 0.23, result: "[탐험 보고서] 폭약 실험이 실패해 다수 사상자. 요청자는 돌아오지 못했습니다.", food: 0, fuel: 0, threat: 5, death: true }
    ],
    forbidden_cult: [
      { chance: 0.93, result: "[탐험 보고서] 교리가 퍼지며 공동체가 결속했습니다. 동시에 도서관 검열 요구가 올라옵니다. 식량 1.", food: 1, fuel: 0, threat: 3, death: false },
      { chance: 0.07, result: "[탐험 보고서] 광신 집단이 경쟁 분파를 처형했습니다. 지역 정세가 폭발 직전입니다.", food: 0, fuel: 0, threat: 6, death: false }
    ]
  }
};


const state = {
  day: 1, fuel: 20, food: 20, hunger: 0, threat: 0,
  logs: [], radio: ["무전기 연결 정상. 외부 신호 약함."],
  selectedBookId: null, currentVisitor: null, currentRequest: null,
  askedQuestions: new Set(), questionPanelOpen: false,
  stats: { approved: 0, rejected: 0, emergency: 0, threatsStopped: 0, trustLosses: 0 },
  lostBooks: new Set()
};

const el = {
  day: document.getElementById("day"), tempFuel: document.getElementById("tempFuel"), foodHunger: document.getElementById("foodHunger"), threat: document.getElementById("threat"),
  visitorName: document.getElementById("visitorName"), visitorTrait: document.getElementById("visitorTrait"), requestText: document.getElementById("requestText"),
  trustHint: document.getElementById("trustHint"), docStatus: document.getElementById("docStatus"), resultLog: document.getElementById("resultLog"), radioLog: document.getElementById("radioLog"),
  dataBox: document.getElementById("dataBox"), memoPanel: document.getElementById("memoPanel"),
  bookCards: document.getElementById("bookCards"), bookDetail: document.getElementById("bookDetail"),
  giveBtn: document.getElementById("giveBtn"), rejectBtn: document.getElementById("rejectBtn"), askBtn: document.getElementById("askBtn"),
  alertBtn: document.getElementById("alertBtn"), questionPanel: document.getElementById("questionPanel"),
  screenFlash: document.getElementById("screenFlash"), notification: document.getElementById("notification")
};

const cMap = {"거래증서 확인":"id","보상약속서 확인":"permit","무전 연락처 확인":"phone","소지품 단서 대조":"accessory","요청 목적 확인":"reason","이전 대출 기록":"history"};
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function weightedPick(items){const r=Math.random();let a=0;for(const it of items){a+=it.chance;if(r<=a)return it;}return items[items.length-1];}
function threatLabel(v){if(v<4)return "안정"; if(v<8)return "긴장"; if(v<12)return "불안"; return "붕괴 직전";}

function notify(msg){el.notification.textContent=msg;el.notification.classList.add('show');setTimeout(()=>el.notification.classList.remove('show'),1000)}
function flash(){el.screenFlash.classList.add('active');setTimeout(()=>el.screenFlash.classList.remove('active'),140)}

function buildVisitor(){
  const resident=pick(residentDirectory); const isHostile=Math.random()<0.36;
  const shownName=isHostile && Math.random()<0.72 ? pick(residentDirectory).name : resident.name;
  const shownApt=isHostile && Math.random()<0.62 ? pick(residentDirectory).apt : resident.apt;
  const shownAccessory=isHostile && Math.random()<0.7 ? pick(accessories) : resident.accessory;
  const idDoc={name:shownName,apt:shownApt,id:resident.id,expiry:1955+Math.floor(Math.random()*3)};
  const permitDoc={apt:Math.random()<0.12 ? pick(residentDirectory).apt : shownApt, seal:Math.random()>(isHostile?0.45:0.05)};
  const flags=[]; if(idDoc.name!==resident.name) flags.push('거래증서 이름 불일치'); if(idDoc.apt!==resident.apt) flags.push('거래증서 거점 불일치');
  if(!permitDoc.seal) flags.push('보상 약속서 서명 없음'); if(permitDoc.apt!==resident.apt) flags.push('보상약속서 거점 불일치'); if(shownAccessory!==resident.accessory) flags.push('소지품 불일치');
  return {resident,isHostile,shownName,shownAccessory,idDoc,permitDoc,flags,suspicious:(isHostile?28:7)+flags.length*6+Math.floor(Math.random()*10),trait:`${pick(['경계','초조','침착','과장된 친절','피로'])}한 태도. 직업 주장: ${pick(jobs)}.`};
}

function renderMemoPanel(){const checks=['거래증서 확인','보상약속서 확인','무전 연락처 확인','소지품 단서 대조','요청 목적 확인','이전 대출 기록']; el.memoPanel.innerHTML=checks.map(c=>`<label><input type="checkbox" disabled ${state.askedQuestions.has(cMap[c])?'checked':''}/> ${c}</label>`).join('');}
function renderQuestionPanel(){el.questionPanel.innerHTML=''; questionTemplates.forEach(q=>{const b=document.createElement('button'); b.className='q-btn'; b.textContent=q.label; b.disabled=state.askedQuestions.has(q.id); b.onclick=()=>askQuestion(q.id); el.questionPanel.appendChild(b);}); el.questionPanel.style.display=state.questionPanelOpen?'grid':'none'; renderMemoPanel();}

function askQuestion(type){
  if(state.askedQuestions.has(type)) return; state.askedQuestions.add(type);
  const v=state.currentVisitor;
  const ans={
    id:`거래증서: ${v.idDoc.name} / ${v.idDoc.apt} / 만료 ${v.idDoc.expiry}`,
    permit:`보상약속서: ${v.permitDoc.apt} / 봉인 ${v.permitDoc.seal?'정상':'누락'}`,
    phone:`거점 전화: ${v.isHostile?'해당 팀이 이미 현장에 있다고 응답':'요청자 본인 신원 일치 응답'}`,
    accessory:`소지품: 현재 '${v.shownAccessory}' / 주민표 '${v.resident.accessory}'`,
    reason:`진술: ${state.currentRequest.text}`,
    history:`기록: ${v.isHostile?'동일 인물 사칭 제보 존재':'최근 문제 없는 대출 거래 기록'}`
  };
  v.suspicious = Math.max(4, v.suspicious + ((v.flags.length && ['id','permit','accessory','phone'].includes(type))?3:-2));
  el.trustHint.textContent=`신뢰도 단서: 신뢰 위험도 추정 ${v.suspicious}%`;
  el.docStatus.textContent=`검증 상태: ${v.flags.length?v.flags.join(', '):'이상 없음'}`;
  state.radio.push(`검증: ${ans[type]}`); renderLogs(); renderQuestionPanel();
}

function renderBooks(){el.bookCards.innerHTML=''; books.forEach(book=>{const btn=document.createElement('button'); const lost=state.lostBooks.has(book.id); btn.className=`book-card ${state.selectedBookId===book.id?'selected':''} ${lost?'lost':''}`; btn.disabled=lost; btn.innerHTML=`<strong>${book.name}</strong><br/><small>${book.type} · 위험 ${book.risk}</small>`; btn.onclick=()=>{state.selectedBookId=book.id; const preview=outcomeTable[state.currentRequest.id]?.[book.id]?.[0]?.result||'효과 데이터 없음'; el.bookDetail.textContent=`${book.name} — ${book.desc} | 예상: ${preview}`; renderBooks();}; el.bookCards.appendChild(btn);});}
function renderLogs(){el.resultLog.innerHTML=[...state.logs].slice(-7).reverse().map(v=>`<li>${v}</li>`).join(''); el.radioLog.innerHTML=[...state.radio].slice(-8).reverse().map(v=>`<li>${v}</li>`).join(''); el.dataBox.textContent=`운영지표 · 대출승인 ${state.stats.approved} | 반려 ${state.stats.rejected} | 격리 ${state.stats.emergency} | 위협차단 ${state.stats.threatsStopped} | 오판 ${state.stats.trustLosses}`;}
function updateHud(){el.day.textContent=`📅 Day ${state.day}`; const temp=Math.max(-10,8-Math.floor((20-state.fuel)/3)); el.tempFuel.textContent=`🌡 온도 ${temp}℃  ⛽ 연료 ${state.fuel}`; el.foodHunger.textContent=`🍞 식량 ${state.food}  🧍 허기 ${state.hunger}`; el.threat.textContent=`⚠ 위협도 ${state.threat} (${threatLabel(state.threat)})`; const fuelMeter=Math.max(8,Math.min(100,state.fuel*4)); const foodMeter=Math.max(8,Math.min(100,state.food*4)); const threatMeter=Math.max(8,Math.min(100,100-(state.threat*5))); el.day.style.setProperty('--meter', `${Math.min(100, state.day*4)}%`); el.tempFuel.style.setProperty('--meter', `${fuelMeter}%`); el.foodHunger.style.setProperty('--meter', `${foodMeter}%`); el.threat.style.setProperty('--meter', `${threatMeter}%`);} 
function nextVisitor(){state.currentVisitor=buildVisitor(); const r=pick(requests); state.currentRequest={id:r.id,text:pick(requestTextPool[r.id])}; state.selectedBookId=null; state.askedQuestions.clear(); state.questionPanelOpen=false; el.visitorName.textContent=`${state.currentVisitor.shownName} (${state.currentVisitor.resident.apt})`; el.visitorTrait.textContent=state.currentVisitor.trait; el.requestText.textContent=state.currentRequest.text; el.trustHint.textContent=`신뢰도 단서: 신뢰 위험도 추정 ${state.currentVisitor.suspicious}%`; el.docStatus.textContent='검증 전'; el.bookDetail.textContent='도서를 선택하세요.'; renderBooks(); renderQuestionPanel(); renderMemoPanel();}

function consumeDailyResources(){state.fuel=Math.max(0,state.fuel-2); state.food=Math.max(0,state.food-2); if(state.food===0) state.hunger+=2; if(state.fuel===0) state.hunger+=1;}
function applyEndingCheck(){if(state.hunger>=15){alert('엔딩: 관리자가 굶주림으로 쓰러졌습니다.');location.reload();} if(state.threat>=18){alert('엔딩: 약탈과 검열이 도서관을 덮쳤습니다.');location.reload();} if(state.day>=25&&state.threat<=7){alert('엔딩: 지식의 성전이 세워졌습니다.');location.reload();}}
function advanceDay(){state.day+=1; consumeDailyResources(); updateHud(); renderLogs(); nextVisitor(); applyEndingCheck();}

function resolveBookDelivery(){const outcomes=outcomeTable[state.currentRequest.id][state.selectedBookId]; const o=weightedPick(outcomes); state.logs.push(`Day ${state.day}: ${o.result}`); state.food=Math.max(0,state.food+o.food); state.fuel=Math.max(0,state.fuel+o.fuel); state.threat=Math.max(0,state.threat+o.threat); if(o.death){state.lostBooks.add(state.selectedBookId); state.radio.push(`무전: 요청자 사망. '${books.find(b=>b.id===state.selectedBookId).name}' 소실.`);} else state.radio.push('무전: 대가 도착, 거래 완료.'); if(state.lostBooks.size===books.length){alert('엔딩: 모든 책이 소실되었습니다.');location.reload();}}
function approveVisitor(){if(!state.selectedBookId){alert('먼저 도서를 선택하세요.');return;} const v=state.currentVisitor; state.stats.approved+=1; if(v.isHostile && v.flags.length>=2){state.threat+=3; state.logs.push(`Day ${state.day}: 약탈 성향 방문자를 승인했습니다. 서고 위협이 증가했습니다.`);} resolveBookDelivery(); flash(); advanceDay();}
function rejectVisitor(){const v=state.currentVisitor; state.stats.rejected+=1; if(!v.isHostile){state.stats.trustLosses+=1; state.threat+=2; state.food=Math.max(0,state.food-1); state.logs.push(`Day ${state.day}: 정상 탐험가를 반려해 신뢰가 하락했습니다.`);} else {state.stats.threatsStopped+=1; state.threat=Math.max(0,state.threat-1); state.logs.push(`Day ${state.day}: 위험 성향 방문자를 반려했습니다.`);} state.radio.push('무전: 대출 반려 처리 완료.'); flash(); advanceDay();}
function emergencyCall(){const v=state.currentVisitor; state.stats.emergency+=1; if(v.isHostile){state.stats.threatsStopped+=1; state.threat=Math.max(0,state.threat-2); state.logs.push(`Day ${state.day}: 격리 프로토콜 성공. 위험 방문자를 제압했습니다.`);} else {state.stats.trustLosses+=1; state.threat+=3; state.food=Math.max(0,state.food-1); state.logs.push(`Day ${state.day}: 오판으로 주민이 사망했습니다.`);} state.radio.push('긴급 무전: 격리 요원 출동. 호출은 취소 불가.'); notify('격리 호출 전송됨'); flash(); advanceDay();}
function toggleQuestionPanel(){state.questionPanelOpen=!state.questionPanelOpen; state.radio.push(state.questionPanelOpen?'검증 도구를 펼쳤습니다.':'검증 도구를 닫았습니다.'); renderQuestionPanel(); renderLogs();}

el.giveBtn.addEventListener('click', approveVisitor);
el.rejectBtn.addEventListener('click', rejectVisitor);
el.askBtn.addEventListener('click', toggleQuestionPanel);
el.alertBtn.addEventListener('click', emergencyCall);

updateHud(); renderBooks(); renderLogs(); nextVisitor();

(function setupQualityLayer(){
  const canvas=document.getElementById('fxCanvas'); const ctx=canvas.getContext('2d');
  const audioBtn=document.getElementById('audioBtn'); let audioOn=false; let ac; let ambient;
  const parts=[];
  const tone=(f,d=0.07,t='triangle',g=0.03)=>{if(!audioOn)return; ac=ac||new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended')ac.resume(); const o=ac.createOscillator(); const gain=ac.createGain(); o.type=t; o.frequency.value=f; gain.gain.value=0.0001; gain.gain.exponentialRampToValueAtTime(g,ac.currentTime+0.01); gain.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+d); o.connect(gain).connect(ac.destination); o.start(); o.stop(ac.currentTime+d)};
  function toggleAmbient(){audioOn=!audioOn; if(audioOn){ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const b=ac.createBuffer(1,2*ac.sampleRate,ac.sampleRate); const ch=b.getChannelData(0); for(let i=0;i<ch.length;i++) ch[i]=(Math.random()*2-1)*0.18; ambient=ac.createBufferSource(); ambient.buffer=b; ambient.loop=true; const f=ac.createBiquadFilter(); f.type='bandpass'; f.frequency.value=380; const g=ac.createGain(); g.gain.value=.018; ambient.connect(f).connect(g).connect(ac.destination); ambient.start(); audioBtn.textContent='🔊 사운드 ON'; notify('환경음 활성화');} else {if(ambient){ambient.stop(); ambient.disconnect(); ambient=null;} audioBtn.textContent='🔇 사운드 OFF'; notify('환경음 비활성화');}}
  audioBtn.addEventListener('click',toggleAmbient);
  document.body.addEventListener('click',e=>{if(e.target.closest('button')) tone(260,0.05,'triangle',0.026)},true);
  const resize=()=>{canvas.width=innerWidth; canvas.height=innerHeight};
  const tick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height); if(Math.random()<.7&&parts.length<90) parts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+.6,vx:(Math.random()-.5)*.15,vy:-Math.random()*.25-.05,a:Math.random()*.35+.08}); for(let i=parts.length-1;i>=0;i--){const p=parts[i]; p.x+=p.vx;p.y+=p.vy;p.a*=.996; ctx.fillStyle=`rgba(227,188,137,${p.a})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); if(p.y<-10||p.a<.02) parts.splice(i,1);} requestAnimationFrame(tick)};
  resize(); tick(); addEventListener('resize',resize);
})();

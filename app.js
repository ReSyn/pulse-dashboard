const STORAGE_KEY = "pulse-dashboard-v1";
const today = new Date();
const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const dailyTasks = {
  Monday: ["Shower", "Drink water regularly", "Eat breakfast", "Sports session", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Tuesday: ["Shower", "Drink water regularly", "Eat breakfast", "Workout A", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Wednesday: ["Shower", "Drink water regularly", "Eat breakfast", "Sports session", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Thursday: ["Shower", "Drink water regularly", "Eat breakfast", "Recovery walk or gentle stretching", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Friday: ["Shower", "Drink water regularly", "Eat breakfast", "Workout B", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Saturday: ["Shower", "Drink water regularly", "Eat breakfast", "Sports session", "Eat lunch", "Eat dinner", "Get ready for bed"],
  Sunday: ["Shower", "Drink water regularly", "Eat breakfast", "Rest and recover", "Eat lunch", "Eat dinner", "Get ready for bed"]
};
const schedule = [
  {day:"Monday",type:"Sport",detail:"Your regular 2-hour sports session",symbol:"●"},
  {day:"Tuesday",type:"Strength",detail:"Workout A · Full body · about 25–30 min",symbol:"◆"},
  {day:"Wednesday",type:"Sport",detail:"Your regular 2-hour sports session",symbol:"●"},
  {day:"Thursday",type:"Recovery",detail:"Gentle walking or relaxed stretching",symbol:"○"},
  {day:"Friday",type:"Strength",detail:"Workout B · Strength and core · about 25–30 min",symbol:"◆"},
  {day:"Saturday",type:"Sport",detail:"Your regular 2-hour sports session",symbol:"●"},
  {day:"Sunday",type:"Rest",detail:"A full recovery day",symbol:"○"}
];
const workouts = {
  A:{title:"Workout A · Full body",kicker:"TUESDAY · FULL BODY",exercises:[
    ["Squats","3 × 12 repetitions","Stand with feet about shoulder-width apart. Send your hips back, bend your knees, then stand up with control."],
    ["Push-ups","3 × 6–12 repetitions","Place hands a little wider than shoulders. Keep your body in a straight line, lower with control and push up. Use knee or wall push-ups if needed."],
    ["Reverse lunges","2 × 10 each leg","Step one foot backwards, bend both knees comfortably, then push through the front foot to return."],
    ["Plank","3 × 20–30 seconds","Rest on your forearms and toes, keeping your body in a comfortable straight line. Breathe normally."],
    ["Calf raises","2 × 15 repetitions","Stand tall, lift your heels, pause briefly, then lower slowly."]
  ]},
  B:{title:"Workout B · Strength and core",kicker:"FRIDAY · STRENGTH & CORE",exercises:[
    ["Split squats","2 × 10 each leg","Stand with one foot in front of the other. Bend both knees, lower with control, then stand. Hold a wall lightly for balance if needed."],
    ["Close-grip push-ups","2 × 6–10 repetitions","Place hands slightly closer than shoulder-width. Keep elbows comfortably near your sides. Use regular or knee push-ups if needed."],
    ["Glute bridges","2 × 15 repetitions","Lie on your back with knees bent and feet on the floor. Lift hips gently, then lower with control."],
    ["Dead bugs","2 × 10 each side","Lie on your back with arms raised and knees bent. Slowly extend the opposite arm and leg, then switch sides. Keep your back steady."],
    ["Mountain climbers","2 × 20 alternating steps","Start in a high plank. Bring one knee forward, return it, then alternate. Keep the movement controlled."]
  ]}
};
const phases = [
  {range:"WEEKS 1–2",start:1,end:2,title:"Learn the movements",description:"Practise each exercise with controlled technique. Start with fewer sets if needed and establish a comfortable weekly routine."},
  {range:"WEEKS 3–4",start:3,end:4,title:"Build consistency",description:"Get familiar with the schedule and complete the planned sessions when you're feeling recovered. Technique comes before repetitions."},
  {range:"WEEKS 5–8",start:5,end:8,title:"Develop strength",description:"If the workouts feel comfortable and recovery is good, gradually add a repetition here and there. Don't increase every exercise at once."},
  {range:"WEEKS 9–12",start:9,end:12,title:"Maintain progress",description:"Keep movements controlled, notice improvements in coordination and sports skills, and maintain good recovery habits."}
];
const meals = [
  ["BREAKFAST","Eggs, baladi bread or toast, milk and fruit."],
  ["LUNCH","Chicken, fish, meat or beans with rice, pasta or potatoes and salad."],
  ["SNACK","Fruit, nuts, milk or a peanut-butter sandwich. Add a snack when hungry."],
  ["DINNER","Eggs, chicken, beans or cheese with bread or potatoes and vegetables."]
];
function loadState(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};}catch{return {};}
}
let state = loadState();
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function getDayName(d=new Date()){return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];}
function getTodayHabits(){const key=dateKey();if(!state.habitsByDate)state.habitsByDate={};if(!state.habitsByDate[key])state.habitsByDate[key]=[];return state.habitsByDate[key];}
function setTodayHabits(values){if(!state.habitsByDate)state.habitsByDate={};state.habitsByDate[dateKey()]=values;saveState();}
function showToast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove("show"),2200);}
function switchTab(name){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));window.scrollTo({top:0,behavior:"smooth"});}
function renderHabits(){
  const day=getDayName();const tasks=dailyTasks[day];const done=getTodayHabits();const container=document.getElementById("today-habits");
  document.querySelector(".habit-panel .panel-top h3").textContent=`${day}'s checklist`;
  container.innerHTML=tasks.map(task=>`<label class="check-row"><input type="checkbox" data-habit="${task}" ${done.includes(task)?"checked":""}><span>${task}</span></label>`).join("");
  document.getElementById("habit-count").textContent=`${done.length}/${tasks.length}`;
  document.getElementById("habit-progress").style.width=`${done.length/tasks.length*100}%`;
  container.querySelectorAll("input").forEach(input=>input.addEventListener("change",()=>{
    const task=input.dataset.habit;let updated=getTodayHabits().slice();
    updated=input.checked?[...new Set([...updated,task])]:updated.filter(x=>x!==task);
    setTodayHabits(updated);renderHabits();
  }));
}
function renderSchedule(){
  const html=schedule.map(item=>`<article class="schedule-card"><div class="schedule-icon" aria-hidden="true">${item.symbol}</div><div><strong>${item.day}</strong><small>${item.detail}</small></div><span class="tag ${item.type.toLowerCase()}">${item.type}</span></article>`).join("");
  document.getElementById("weekly-plan").innerHTML=html;
  document.getElementById("week-strip").innerHTML=schedule.map(item=>`<div class="day-card ${item.type.toLowerCase()}"><strong>${item.day.slice(0,3)}</strong><span>${item.type}</span><i class="day-dot"></i></div>`).join("");
}
function renderWorkout(which="A"){
  const workout=workouts[which];
  document.getElementById("workout-kicker").textContent=workout.kicker;
  document.getElementById("workout-title").textContent=workout.title;
  document.getElementById("exercise-list").innerHTML=workout.exercises.map((e,i)=>`<article class="exercise-card"><span class="exercise-number">${String(i+1).padStart(2,"0")}</span><div><h3>${e[0]}</h3><span class="sets">${e[1]}</span><p>${e[2]}</p></div></article>`).join("");
  document.querySelectorAll(".segment").forEach(b=>b.classList.toggle("active",b.dataset.workout===which));
}
function renderMeals(){document.getElementById("meal-list").innerHTML=meals.map(m=>`<article class="meal-card"><span class="meal-time">${m[0]}</span><h3>${m[0][0]+m[0].slice(1).toLowerCase()}</h3><p>${m[1]}</p></article>`).join("");}


const hydrationQuestionBank=[{"q":"Do fruit and soup contribute to your daily water intake?","a":["Yes, they do","No, only drinks count"],"correct":0,"why":"Water-rich foods like fruit and soup contribute to your total water intake."},{"q":"If you forgot to drink earlier, what's a sensible approach?","a":["Gulp lots down at once","Sip regularly through the day"],"correct":1,"why":"Regular sips are more comfortable than trying to catch up all at once."},{"q":"Can hot weather and sports change how much you need to drink?","a":["Yes, they can","No, needs never change"],"correct":0,"why":"Heat and activity can increase fluid needs. Take water breaks and listen to thirst."},{"q":"Which is a good everyday drink choice?","a":["Water","Energy drinks"],"correct":0,"why":"Water is a great everyday choice. Energy drinks aren't needed for hydration."},{"q":"Does milk contribute to hydration?","a":["Yes","No"],"correct":0,"why":"Milk contains water and contributes to daily fluid intake."},{"q":"When is a useful time to drink water?","a":["Only at bedtime","At regular points during the day"],"correct":1,"why":"Having drinks with meals and taking sips during the day is a simple routine."},{"q":"What can be a sign you may need a drink?","a":["Feeling thirsty","Having a favourite colour"],"correct":0,"why":"Thirst is one of the body's signals to get a drink."},{"q":"Do you need to force yourself to finish a fixed amount of water?","a":["Yes, no matter what","No, needs vary"],"correct":1,"why":"Fluid needs vary with weather, activity, food and the individual. A number is a guide, not a rule."},{"q":"Which snack can also provide water?","a":["Cucumber slices","Plain crackers only"],"correct":0,"why":"Cucumber has a high water content and contributes to hydration."},{"q":"What is a practical way to remember drinks at school?","a":["Keep a water bottle handy","Avoid drinking until you get home"],"correct":0,"why":"Having a bottle available makes it easier to take sips when you have a break."},{"q":"Can drinking too much water very quickly be a problem?","a":["Yes","No, more is always better"],"correct":0,"why":"Drinking excessive amounts quickly can be harmful. Drink normally across the day."},{"q":"Do vegetables contain water?","a":["Yes, many do","No, vegetables are dry"],"correct":0,"why":"Many vegetables, such as lettuce and cucumber, contain lots of water."},{"q":"What might make you need extra drinks on a hot day?","a":["Sweating more","Reading a book"],"correct":0,"why":"Sweating helps cool the body and means you lose fluid that needs replacing."},{"q":"Are sports drinks necessary for every ordinary workout?","a":["Yes, always","Usually not for everyday activity"],"correct":1,"why":"For ordinary activity, water and regular meals are generally enough."},{"q":"Which habit can help you stay hydrated?","a":["Drink with meals","Ignore thirst all day"],"correct":0,"why":"Having a drink with meals is an easy habit to build."},{"q":"Does tea or soup count as fluid?","a":["Yes, they contribute","No, only plain water counts"],"correct":0,"why":"Other drinks and water-rich foods also contribute to fluid intake."},{"q":"What should you do if you feel thirsty during sports?","a":["Take a water break","Keep going and ignore it"],"correct":0,"why":"Take a break and drink. It's sensible to respond to thirst during activity."},{"q":"Is everyone's daily water need exactly the same?","a":["Yes, identical for everyone","No, it varies"],"correct":1,"why":"Needs vary with age, activity, weather, health and other factors."},{"q":"Which is a good clue that you're drinking enough over the day?","a":["You rarely feel thirsty and urine is usually pale yellow","You never need a bathroom break"],"correct":0,"why":"Thirst and generally pale-yellow urine can be useful everyday clues, though neither is perfect on its own."},{"q":"What is the best approach to hydration?","a":["Make it a relaxed daily habit","Treat it like a competition"],"correct":0,"why":"Hydration should support how you feel, not become a score or competition."}];
let hydrationQuestions=[],quizIndex=0,quizScore=0,quizAnswered=false;
function startHydrationQuiz(){
 hydrationQuestions=hydrationQuestionBank.map((q)=>({...q,sort:Math.random()})).sort((a,b)=>a.sort-b.sort).slice(0,3);
 quizIndex=0;quizScore=0;quizAnswered=false;renderHydrationQuiz();
}
function renderHydrationQuiz(){
 const progress=document.getElementById("quiz-progress"),question=document.getElementById("quiz-question"),answers=document.getElementById("quiz-answers"),feedback=document.getElementById("quiz-feedback"),next=document.getElementById("quiz-next"),score=document.getElementById("quiz-score");
 if(quizIndex>=hydrationQuestions.length){progress.textContent="ROUND COMPLETE";question.textContent=quizScore===3?"Perfect round!":"Round complete!";answers.innerHTML="";feedback.textContent="You got "+quizScore+" out of 3 correct. "+(quizScore===3?"Flawless!":"Ready for another round?");next.textContent="Play again";next.disabled=false;score.textContent=quizScore+"/3";document.getElementById("quiz-panel").classList.add("quiz-complete");return;}
 const q=hydrationQuestions[quizIndex];document.getElementById("quiz-panel").classList.remove("quiz-complete");
 progress.textContent="QUESTION "+(quizIndex+1)+" OF 3";question.textContent=q.q;score.textContent=quizScore+"/3";quizAnswered=false;feedback.textContent="Pick an answer to see why.";next.textContent=quizIndex===2?"See results":"Next question";next.disabled=true;
 answers.innerHTML=q.a.map((answer,i)=>'<button class="quiz-answer" data-answer="'+i+'" type="button">'+answer+'</button>').join("");
}
function launchConfetti(){
 if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const layer=document.getElementById("confetti-layer");if(!layer)return;
 const shapes=["","circle","square"];
 for(let i=0;i<34;i++){const piece=document.createElement("i");piece.className="confetti-piece "+shapes[i%3];piece.style.left=(8+Math.random()*84)+"%";piece.style.setProperty("--drift",((Math.random()-.5)*170)+"px");piece.style.setProperty("--spin",(Math.random()*720-360)+"deg");piece.style.animationDelay=(Math.random()*.18)+"s";piece.style.background=["#8fe0ba","#e6b44f","#78b9e8","#d98568","#a99ae8"][i%5];layer.appendChild(piece);setTimeout(()=>piece.remove(),1550);}
}
document.getElementById("quiz-answers").addEventListener("click",e=>{
 const button=e.target.closest("[data-answer]");if(!button||quizAnswered||quizIndex>=hydrationQuestions.length)return;
 const q=hydrationQuestions[quizIndex],chosen=Number(button.dataset.answer);quizAnswered=true;
 if(chosen===q.correct){quizScore++;launchConfetti();document.getElementById("quiz-panel").classList.add("answer-correct");setTimeout(()=>document.getElementById("quiz-panel").classList.remove("answer-correct"),520);}
 document.querySelectorAll(".quiz-answer").forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===chosen)b.classList.add("incorrect");});
 document.getElementById("quiz-feedback").textContent=(chosen===q.correct?"Correct! ✨ ":"Not quite. ")+q.why;
 document.getElementById("quiz-score").textContent=quizScore+"/3";document.getElementById("quiz-next").disabled=false;
});
document.getElementById("quiz-next").addEventListener("click",()=>{
 if(quizIndex>=hydrationQuestions.length){startHydrationQuiz();return;}
 quizIndex++;renderHydrationQuiz();
});

function getTodayWater(){if(!state.waterByDate)state.waterByDate={};const key=dateKey();if(!Array.isArray(state.waterByDate[key]))state.waterByDate[key]=[];return state.waterByDate[key];}
function setTodayWater(entries){if(!state.waterByDate)state.waterByDate={};state.waterByDate[dateKey()]=entries;saveState();}
function renderHydration(){
 const entries=getTodayWater();const total=entries.reduce((sum,n)=>sum+n,0);
 document.getElementById("water-total").textContent=total.toLocaleString();
 document.getElementById("water-summary").textContent=total===0?"Start by logging a glass whenever you have one.":"You've logged "+entries.length+" drink"+(entries.length===1?"":"s")+" today. Nice job keeping track.";
 document.getElementById("undo-water").disabled=entries.length===0;document.getElementById("reset-water").disabled=entries.length===0;
 const feeling=state.energyByDate&&state.energyByDate[dateKey()];
 document.querySelectorAll(".energy-option").forEach(button=>{button.classList.toggle("selected",button.dataset.energy===feeling);button.setAttribute("aria-pressed",String(button.dataset.energy===feeling));});
 document.getElementById("energy-feedback").textContent=feeling==="Good"?"You've marked today as a good-energy day.":feeling==="Okay"?"You've marked today as an okay day. Keep your pace comfortable.":feeling==="Need rest"?"Rest is productive too. It's okay to make today easier.":"Your check-in stays on this device.";
}
function addWater(amount){
 if(!Number.isFinite(amount)||amount<1||amount>2000){showToast("Enter an amount between 1 and 2,000 ml.");return;}
 setTodayWater([...getTodayWater(),Math.round(amount)]);document.getElementById("custom-water").value="";renderHydration();showToast(Math.round(amount)+" ml added to today's log.");
}

function renderProgress(){
  const week=Number(state.currentWeek||1);const slider=document.getElementById("week-slider");slider.value=week;
  document.getElementById("week-number").textContent=`WEEK ${week} OF 12`;
  document.getElementById("week-big").innerHTML=`${String(week).padStart(2,"0")}<span>/12</span>`;
  const phase=phases.find(p=>week>=p.start&&week<=p.end);
  document.getElementById("phase-range").textContent=phase.range;
  document.getElementById("phase-title").textContent=phase.title;
  document.getElementById("phase-description").textContent=phase.description;
  document.getElementById("phase-list").innerHTML=phases.map(p=>`<article class="phase-item ${phase===p?"current":""}"><span>${p.range}</span><strong>${p.title}</strong><p>${p.description}</p></article>`).join("");
}
function renderToday(){
  const today=new Date();const day=getDayName(today);const item=schedule.find(x=>x.day===day);
  document.getElementById("today-date").textContent=today.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
  document.getElementById("today-heading").textContent=`Good ${today.getHours()<12?"morning":today.getHours()<18?"afternoon":"evening"}`;
  document.getElementById("today-activity").textContent=item?item.type:"Your day";
  document.getElementById("today-description").textContent=item?item.detail:"Take today at your own pace.";
  const action=document.getElementById("today-action");
  action.textContent=item?.type==="Strength"?"Open today's workout":"View weekly plan";
  action.onclick=()=>{if(item?.type==="Strength"){renderWorkout(day==="Tuesday"?"A":"B");switchTab("workouts");}else switchTab("plan");};
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.go)));
document.querySelectorAll(".segment").forEach(b=>b.addEventListener("click",()=>renderWorkout(b.dataset.workout)));
document.getElementById("reset-habits").addEventListener("click",()=>{setTodayHabits([]);renderHabits();showToast("Today's checklist was reset.");});
document.getElementById("add-water-glass").addEventListener("click",()=>addWater(250));
document.getElementById("add-water-bottle").addEventListener("click",()=>addWater(500));
document.getElementById("add-custom-water").addEventListener("click",()=>addWater(Number(document.getElementById("custom-water").value)));
document.getElementById("custom-water").addEventListener("keydown",e=>{if(e.key==="Enter")addWater(Number(e.currentTarget.value));});
document.getElementById("undo-water").addEventListener("click",()=>{const entries=getTodayWater().slice();entries.pop();setTodayWater(entries);renderHydration();showToast("Last water entry removed.");});
document.getElementById("reset-water").addEventListener("click",()=>{setTodayWater([]);renderHydration();showToast("Today's water log cleared.");});
document.querySelectorAll(".energy-option").forEach(button=>button.addEventListener("click",()=>{if(!state.energyByDate)state.energyByDate={};state.energyByDate[dateKey()]=button.dataset.energy;saveState();renderHydration();showToast("Recovery check-in saved.");}));
document.getElementById("week-slider").addEventListener("input",e=>{state.currentWeek=Number(e.target.value);saveState();renderProgress();});
document.getElementById("theme-toggle").addEventListener("click",()=>{document.body.classList.toggle("light-mode");state.lightMode=document.body.classList.contains("light-mode");saveState();});
document.getElementById("export-data").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="pulse-progress-backup.json";a.click();URL.revokeObjectURL(url);showToast("Progress backup downloaded.");
});
function updateConnection(){const el=document.getElementById("connection-status");el.textContent=navigator.onLine?"● Online":"● Offline";el.classList.toggle("offline",!navigator.onLine);}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
if(state.lightMode)document.body.classList.add("light-mode");
renderToday();renderHabits();renderSchedule();renderWorkout("A");renderMeals();renderHydration();startHydrationQuiz();renderProgress();updateConnection();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));

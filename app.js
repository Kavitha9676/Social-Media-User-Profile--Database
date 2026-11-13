const csvPath = "data/social_media_profiles.csv";
let profiles = [];
const colors = ["#8068ed", "#55a5df", "#f0a45d", "#45bd98", "#df78a7", "#8b91a8"];
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
  });
}
function countBy(field) {
  return profiles.reduce((a, p) => (a[p[field]] = (a[p[field]] || 0) + 1, a), {});
}
function chart(id, type, labels, values) {
  const ctx = document.getElementById(id);
  if (!window.Chart) { ctx.parentElement.innerHTML = "<p>Charts need an internet connection to load Chart.js.</p>"; return; }
  new Chart(ctx, {type, data:{labels,datasets:[{data:values,backgroundColor:colors,borderWidth:0,borderRadius:type==="bar"?7:0,hoverOffset:7}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:type!=="bar",position:"bottom",labels:{usePointStyle:true,boxWidth:7,padding:16,font:{size:10}}}},scales:type==="bar"?{x:{grid:{display:false},ticks:{font:{size:10}}},y:{beginAtZero:true,ticks:{stepSize:1,font:{size:10}},grid:{color:"#f0f1f5"}}}:{}}});
}
function renderRows(list) {
  document.getElementById("profileRows").innerHTML = list.map(p => `<tr>
    <td><div class="user-cell"><span class="user-avatar">${p.username.slice(0,1).toUpperCase()}</span>${p.username}</div></td>
    <td>${p.age_group}</td><td>${p.location}</td><td><span class="interest-tag">${p.interest}</span></td>
    <td>${Number(p.followers).toLocaleString()}</td><td>${p.posts}</td></tr>`).join("");
}
function render() {
  document.getElementById("totalUsers").textContent = profiles.length;
  document.getElementById("totalLocations").textContent = Object.keys(countBy("location")).length;
  document.getElementById("totalInterests").textContent = Object.keys(countBy("interest")).length;
  document.getElementById("avgFollowers").textContent = Math.round(profiles.reduce((s,p)=>s+Number(p.followers),0)/profiles.length).toLocaleString();
  const locations=countBy("location"), interests=countBy("interest");
  const bands={"0-499":0,"500-999":0,"1000-1999":0,"2000+":0};
  profiles.forEach(p=>{const n=Number(p.followers);bands[n<500?"0-499":n<1000?"500-999":n<2000?"1000-1999":"2000+"]++});
  chart("locationChart","doughnut",Object.keys(locations),Object.values(locations));
  chart("interestChart","doughnut",Object.keys(interests),Object.values(interests));
  chart("followerChart","bar",Object.keys(bands),Object.values(bands));
  renderRows(profiles);
}
fetch(csvPath).then(r=>{if(!r.ok)throw Error("Could not load CSV");return r.text()}).then(t=>{profiles=parseCSV(t);render()}).catch(()=>{document.getElementById("profileRows").innerHTML='<tr><td colspan="6">Could not load dataset. Run the project using the Python local server instructions in README.md.</td></tr>'});
document.getElementById("searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderRows(profiles.filter(p=>Object.values(p).some(v=>v.toLowerCase().includes(q))))});

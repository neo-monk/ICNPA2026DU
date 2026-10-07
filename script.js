/*
  First test version:
  One entry only, under Nuclear Reaction.
  Replace/add entries in this data block later.
*/
const sections = [
  {id:"nuclear-reaction",label:"B",title:"Nuclear Reaction",entries:[
    {
      id:"B1",
      title:"xy",
      authors:"xyz",
      page:1,
      pdf:"https://drive.google.com/file/d/1wyQ5351UpAFNlHIGcLWgclUVzYsp7V2k/view?usp=sharing"
    }
  ]}
];

const contentsList = document.getElementById("contentsList");
const sectionsEl = document.getElementById("sections");
const authorsEl = document.getElementById("authors");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("count");

function allEntries(){
  return sections.flatMap(s => s.entries.map(e => ({...e, sectionId:s.id, sectionTitle:s.title})));
}

function renderContents(){
  contentsList.innerHTML = `<div class="contents-grid">${
    sections.map(s => `<div class="contents-item">
      <a href="#${s.id}">${s.label}. ${escapeHtml(s.title)}</a>
    </div>`).join("")
  }</div>`;
}

function renderSections(query=""){
  const q = query.trim().toLowerCase();
  let shown = 0;
  sectionsEl.innerHTML = sections.map(s => {
    const entries = s.entries.filter(e =>
      !q || [e.id,e.title,e.authors,String(e.page)].join(" ").toLowerCase().includes(q)
    );
    shown += entries.length;
    if(q && entries.length===0) return "";
    const rows = entries.map(e => `
      <article class="entry" id="${e.id}">
        <div class="number">${escapeHtml(e.id)}</div>
        <div>
          <div class="title">${escapeHtml(e.title)}</div>
          <div class="authors">${escapeHtml(e.authors)}</div>
        </div>
        <a class="pdf" href="${e.pdf}" target="_blank" rel="noopener">PDF</a>
      </article>
    `).join("");
    return `<section class="conference-section" id="${s.id}">
      <div class="section-heading">
        <h2>${s.label}. ${escapeHtml(s.title)}</h2>
        <a href="#contents">Top ↑</a>
      </div>
      ${rows}
    </section>`;
  }).join("");
  countEl.textContent = `${shown} abstract${shown===1?"":"s"}`;
}

function renderAuthors(){
  const map = new Map();
  allEntries().forEach(e => {
    e.authors.split(",").map(x=>x.trim()).filter(Boolean).forEach(author => {
      if(!map.has(author)) map.set(author, []);
      map.get(author).push(e.id);
    });
  });
  authorsEl.innerHTML = [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([name,ids]) =>
    `<div class="author-row"><div class="author-name">${escapeHtml(name)}</div><div>${ids.map(id=>`<a href="#${id}">${id}</a>`).join(", ")}</div></div>`
  ).join("");
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

searchEl.addEventListener("input", e => renderSections(e.target.value));
renderContents();
renderSections();
renderAuthors();

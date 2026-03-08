let allIssues = [], 
filteredIssues = [],
 currentTab = 'all';

const formatAuthor = a => a ? a.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Unknown';

const getPriorityImage = p => ({high:'Status=High.png', medium:'Status=Medium.png', low:'Status=Low.png'})[p?.toLowerCase()] || 'Status=High.png';

const getStatusImage = s => s === 'open' ? './images/Open-Status.png' : './images/Status=Closed.png';

const getLabelIcon = l => ({bug:'fa-bug', enhancement:'fa-star', documentation:'fa-book', 'help wanted':'fa-handshake', 'good first issue':'fa-seedling'})[l?.toLowerCase()] || 'fa-tag';

const getLabelClass = l => ({
    bug:'bg-[#FECACA] text-[#EF4444]', enhancement:'bg-green-100 text-green-700',
    documentation:'bg-blue-100 text-blue-700', 'help wanted':'bg-purple-100 text-purple-700',
    'good first issue':'bg-green-100 text-green-700'
})[l?.toLowerCase()] || 'bg-gray-100 text-gray-700';

const toggleSpinner = s => {
    const sp = document.getElementById("loadingSpinner"), g = document.getElementById("issuesGrid");
    if (!sp || !g) return;
    s ? (sp.classList.remove("hidden"), g.classList.add("hidden")) : (sp.classList.add("hidden"), g.classList.remove("hidden"));
};

const updateCount = () => {
    const el = document.getElementById('totalIssuesCount');
    if (el) el.textContent = `${filteredIssues.length} Issues`;
};

const searchIssues = () => {
    const q = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    filteredIssues = q ? allIssues.filter(i => i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.labels?.some(l => l.toLowerCase().includes(q))) : [...allIssues];
    if (currentTab === 'open') filteredIssues = filteredIssues.filter(i => i.status === 'open');
    if (currentTab === 'closed') filteredIssues = filteredIssues.filter(i => i.status === 'closed');
    updateCount();
    displayIssues();
};

const displayIssues = () => {
    const grid = document.getElementById('issuesGrid');
    if (!grid) return;
    if (!filteredIssues.length) { grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No issues found</div>'; return; }
    
    grid.innerHTML = filteredIssues.map(i => {
        const labels = i.labels?.map(l => {
            const ic = getLabelIcon(l), lc = getLabelClass(l);
            return l.toLowerCase() === 'documentation' ? `<span class="flex items-center p-1 ${lc} rounded-lg text-xs"><i class="fa-solid ${ic} mr-1"></i>DOCUMENTATION</span>`
                : l.toLowerCase() === 'good first issue' ? `<span class="flex items-center p-1 ${lc} rounded-lg text-xs"><i class="fa-solid ${ic} mr-1"></i>GOOD FIRST</span>`
                : `<span class="flex items-center p-1 ${lc} rounded-lg text-xs"><i class="fa-solid ${ic} mr-1"></i>${l.toUpperCase()}</span>`;
        }).join('') || '<span class="text-xs text-gray-400">No labels</span>';
        
        return `<div class="bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${i.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500'} cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 issue-card" data-id="${i.id}">
            <div class="p-4">
                <div class="mb-3 flex justify-between items-center">
                    <img src="${getStatusImage(i.status)}" alt="${i.status}" class="w-6 h-6 object-contain">
                    <img src="./images/${getPriorityImage(i.priority)}" alt="${i.priority}" class="h-5 object-contain">
                </div>
                <h3 class="font-bold text-gray-800 text-base mb-2">${i.title}</h3>
                <p class="text-sm text-[#64748B] mb-4 leading-relaxed">${i.description || 'No description provided'}</p>
                <div class="flex gap-2 mb-4 flex-wrap">${labels}</div>
                <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span class="font-semibold">#${i.id} by ${formatAuthor(i.author)}</span>       
                    <span>${i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '1/15/2024'}</span>
                </div>
            </div>
        </div>`;
    }).join('');
    
    document.querySelectorAll('.issue-card').forEach(c => c.addEventListener('click', () => {
        const id = c.dataset.id;
        const issue = allIssues.find(x => x.id == id);
        if (issue) showModal(issue);
    }));
};

const showModal = (i) => {
    if (!i) return;
    document.getElementById('modalTitle').textContent = i.title;
    document.getElementById('modalAuthor').textContent = formatAuthor(i.author);
    document.getElementById('modalDate').textContent = new Date(i.createdAt).toLocaleDateString();
    document.getElementById('modalDescription').textContent = i.description || 'No description';
    document.getElementById('modalAssignee').textContent = formatAuthor(i.assignee) || 'Not assigned';
    
    const statusSpan = document.getElementById('modalStatus');
    statusSpan.innerHTML = '';
    const span = document.createElement('span');
    span.className = 'text-sm font-medium ' + (i.status === 'open' ? 'text-green-600' : 'text-purple-600');
    span.textContent = i.status === 'open' ? 'OPEN' : 'CLOSED';
    statusSpan.appendChild(span);
    
    const priorityMap = {high:'High', medium:'Medium', low:'Low'};
    document.getElementById('modalPriority').innerHTML = `<img src="./images/Status=${priorityMap[i.priority?.toLowerCase()] || 'High'}.png" class="h-6">`;
    
    const labelsDiv = document.getElementById('modalLabels');
    labelsDiv.innerHTML = '';
    labelsDiv.className = 'flex gap-2 flex-wrap items-center';
    
    if (i.labels?.length) i.labels.forEach(l => {
        if (l === 'documentation' || l === 'good first issue') {
            const span = document.createElement('span');
            span.className = `px-2 py-1 text-xs font-medium rounded ${l === 'documentation' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`;
            span.innerHTML = l === 'documentation' ? '<i class="fa-solid fa-book mr-1"></i>DOCUMENTATION' : '<i class="fa-solid fa-seedling mr-1"></i>GOOD FIRST ISSUE';
            labelsDiv.appendChild(span);
        } else {
            labelsDiv.innerHTML += `<img src="./images/Name=${l}.png" class="h-6">`;
        }
    });
    
    document.getElementById('issueModal').showModal();
};

const loadAllIssues = () => {
    toggleSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(r => r.json())
        .then(j => { allIssues = j.data || []; filteredIssues = [...allIssues]; updateCount(); displayIssues(); toggleSpinner(false); })
        .catch(e => { console.error(e); toggleSpinner(false); });
};

const filterAll = () => {
    currentTab = 'all';
    document.getElementById('allBtn')?.classList.add('btn-primary');
    document.getElementById('openBtn')?.classList.remove('btn-primary');
    document.getElementById('closedBtn')?.classList.remove('btn-primary');
    filteredIssues = [...allIssues]; updateCount(); displayIssues();
};

const filterOpen = () => {
    currentTab = 'open';
    document.getElementById('allBtn')?.classList.remove('btn-primary');
    document.getElementById('openBtn')?.classList.add('btn-primary');
    document.getElementById('closedBtn')?.classList.remove('btn-primary');
    filteredIssues = allIssues.filter(i => i.status === 'open'); updateCount(); displayIssues();
};

const filterClosed = () => {
    currentTab = 'closed';
    document.getElementById('allBtn')?.classList.remove('btn-primary');
    document.getElementById('openBtn')?.classList.remove('btn-primary');
    document.getElementById('closedBtn')?.classList.add('btn-primary');
    filteredIssues = allIssues.filter(i => i.status === 'closed'); updateCount(); displayIssues();
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('allBtn')?.addEventListener('click', filterAll);
    document.getElementById('openBtn')?.addEventListener('click', filterOpen);
    document.getElementById('closedBtn')?.addEventListener('click', filterClosed);
    document.getElementById('searchBtn')?.addEventListener('click', e => { e.preventDefault(); searchIssues(); });
    document.getElementById('searchInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') searchIssues(); });
    loadAllIssues();
});
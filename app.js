let allIssues = [];

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        fetchIssues();
    } else { alert("Invalid credentials!"); }
}

async function fetchIssues() {
    toggleLoading(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data;
        displayIssues(allIssues);
    } catch (err) { console.error(err); } finally { toggleLoading(false); }
}

function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    document.getElementById('issue-count').innerText = issues.length;
    container.innerHTML = '';

    if (issues.length === 0) {
        container.innerHTML = `<div class="col-span-full py-20 text-center text-slate-400">No issues found.</div>`;
        return;
    }

    issues.forEach(issue => {
        const priorityColor = issue.priority.toLowerCase() === 'high' ? 'border-t-red-500' : (issue.priority.toLowerCase() === 'medium' ? 'border-t-orange-400' : 'border-t-purple-500');
        const card = document.createElement('div');
        card.className = `bg-white p-6 rounded-xl border-t-4 ${priorityColor} border-x border-b border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer`;
        card.onclick = () => showModal(issue._id || issue.id);

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-emerald-50 rounded-full text-emerald-500"><i class="fa-solid fa-circle-dot text-xs"></i></div>
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityClass(issue.priority)}">${issue.priority}</span>
            </div>
            <h3 class="font-bold text-slate-800 text-sm mb-2 line-clamp-1">${issue.title}</h3>
            <p class="text-xs text-slate-500 mb-4 line-clamp-2">${issue.description}</p>
            <div class="flex flex-wrap gap-2 mb-6">
                <span class="badge badge-outline text-[10px] uppercase font-bold text-orange-400 border-orange-200">${issue.label || 'Issue'}</span>
                <span class="badge bg-emerald-100 border-none text-emerald-600 text-[10px] font-bold">BUG</span>
            </div>
            <div class="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span># by ${issue.author ? issue.author.split(' ')[0].toLowerCase() : 'admin'}</span>
                <span>${new Date(issue.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>`;
        container.appendChild(card);
    });
}

function handleSearch() {
    const text = document.getElementById('search-input').value.toLowerCase();
    const filtered = allIssues.filter(i => 
        i.title.toLowerCase().includes(text) || 
        i.description.toLowerCase().includes(text)
    );
    displayIssues(filtered);
}

function filterByTab(status, element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    element.classList.add('active-tab');
    displayIssues(status === 'all' ? allIssues : allIssues.filter(i => i.status === status));
}

async function showModal(id) {
    const modal = document.getElementById('issue_modal');
    const content = document.getElementById('modal-content');
    modal.showModal();
    content.innerHTML = '<div class="flex justify-center p-10"><span class="loading loading-spinner text-primary"></span></div>';

    // If it's a locally added issue, it won't be on the server
    const localIssue = allIssues.find(i => i.id === id || i._id === id);
    
    try {
        let data = localIssue;
        if (typeof id === 'string' && id.length > 5) { // Likely a server ID
            const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
            const result = await res.json();
            data = result.data;
        }

        content.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-2xl text-slate-800">${data.title}</h3>
                <form method="dialog"><button class="btn btn-sm btn-circle btn-ghost">✕</button></form>
            </div>
            <div class="flex gap-2 items-center mb-6">
                <span class="badge badge-success text-white font-bold">${data.status || 'open'}</span>
                <span class="text-xs text-slate-400">Opened by <strong>${data.author || 'admin'}</strong> on ${new Date(data.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">${data.description}</p>
            <div class="mt-8 grid grid-cols-2 gap-4">
                <div class="p-4 border border-slate-100 rounded-xl">
                    <p class="text-[10px] text-slate-400 uppercase font-black mb-1">Assignee</p>
                    <p class="text-sm font-bold text-slate-700">${data.author || 'Unassigned'}</p>
                </div>
                <div class="p-4 border border-slate-100 rounded-xl">
                    <p class="text-[10px] text-slate-400 uppercase font-black mb-1">Priority</p>
                    <span class="badge badge-error text-white text-[10px] font-bold uppercase">${data.priority}</span>
                </div>
            </div>`;
    } catch (err) { content.innerHTML = "Error loading details."; }
}

function addNewIssue() {
    const title = document.getElementById('new-title').value;
    const desc = document.getElementById('new-desc').value;
    const prio = document.getElementById('new-priority').value;

    if (!title || !desc) return alert("Fill all fields");

    const newObj = {
        id: Date.now(), // Local ID
        title,
        description: desc,
        priority: prio,
        status: 'open',
        author: 'Admin User',
        createdAt: new Date().toISOString(),
        label: 'Enhancement'
    };

    allIssues.unshift(newObj);
    displayIssues(allIssues);
    document.getElementById('new_issue_modal').close();
    // Reset fields
    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value = '';
}

function toggleLoading(show) {
    document.getElementById('loading-spinner').classList.toggle('hidden', !show);
    document.getElementById('issues-container').classList.toggle('hidden', show);
}

function getPriorityClass(p) {
    const pr = p.toLowerCase();
    return pr === 'high' ? 'bg-red-50 text-red-500' : (pr === 'medium' ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-500');
}
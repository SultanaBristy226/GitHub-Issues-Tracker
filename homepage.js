const allDataContainer = document.getElementById("all-issues-container")

async function loadData() {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()
    displayData(data.data)
}

function displayData(allData) {
    allDataContainer.innerHTML = ""
    
    allData.forEach(item => {
        const card = document.createElement('div')
        card.innerHTML = `
            <div class="outline h-full space-y-3 card card-body shadow-sm border-t-6">
                <h1 class="text-xl font-semibold">${item.title}</h1>
                <p class="text-gray-600">${item.description}</p>
                <div class="flex gap-4">
                    <div class="flex items-center p-1 bg-[#FECACA] text-[#EF4444] rounded-lg">
                        <i class="fa-brands fa-empire"></i>
                        <span>${item.labels?.[0] || 'bug'}</span>
                    </div>
                    <div class="flex items-center p-1 bg-[#FFF8DB] text-[#D97706] rounded-lg">
                        <i class="fa-brands fa-empire"></i>
                        <span>${item.labels?.[1] || 'documentation'}</span>
                    </div>
                </div>
                <p>#${item.id} by ${item.author}</p>
                <p>${item.date || '1/15/2024'}</p>
            </div>
        `
        
        const cardDiv = card.firstElementChild
        if (item.status === "open") {
            cardDiv.style.borderTop = "6px solid #3B82F6"
        } else {
            cardDiv.style.borderTop = "6px solid #6B7280"
        }
        
        allDataContainer.appendChild(card)
    })
}

async function openData() {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()
    const filteredData = data.data.filter(item => item.status === "open")
    displayData(filteredData)
}

async function closedData() {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data = await res.json()
    const filteredData = data.data.filter(item => item.status === "closed")
    displayData(filteredData)
}

loadData()
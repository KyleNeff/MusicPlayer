// Calls app.py with webpage depending on func call
async function submitForm(event, formType) {
    event.preventDefault();

    // Find closest
    let form = event.target.closest('form'); 
    let formData = new FormData(form);
    let params = new URLSearchParams();

    for (let pair of formData.entries()) {
        params.append(pair[0], pair[1]);
    }

    let baseUrl = 'http://127.0.0.1:5000';
    let url, method;

    switch (formType) {
        case 'insert':
            url = `${baseUrl}/insert_song`;
            method = 'POST';
            break;
        case 'recommend':
            url = `${baseUrl}/recommend_song`;
            method = 'GET';
            break;
        case 'search':
            url = `${baseUrl}/search_song`;
            method = 'GET';
            break;
        case 'recommendPlaylist':
            url = `${baseUrl}/recommend_playlist`;
            method = 'GET';
            break;
        default:
            url = `${baseUrl}/`;
            method = 'GET';
            break;
    }

    let response = await fetch(url + (method === 'GET' ? '?' + params.toString() : ''), {
        method: method,
        body: method === 'POST' ? params : null,
    });

    let result = await response.json();

    if (response.ok) {
        switch (formType) {
            case 'insert':
                alert(result.message);
                break;
            case 'recommend':
                populateRecommendTable(result)
                break;
            case 'search':
                populateSearchTable(result)
                break;
            case 'recommendPlaylist':
                populateRecommendTable(result)
                break;      
        }
    } else {
        alert(result.error);
    }
}

//Populates Recommendation Table
function populateRecommendTable(data) {
    let table = document.getElementById('resultsTable');
    table.innerHTML = "";

    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    let headers = [""];

    headers.forEach((headerText, index) => {
        let cell = headerRow.insertCell(index);
        cell.outerHTML = `<th>${headerText}</th>`;
    });

    // Parse JSON string into an object (likely an array)

    let dataArray = JSON.parse(data);

    // Check if dataArray is an array
    if (Array.isArray(dataArray)) {
        // Iterate over dataArray and populate table rows
        dataArray.forEach((row, index) => {
            let rowElement = table.insertRow(index + 1);
            let truncate = Object.values(row).slice(1, 2);
            truncate.forEach((cellData, cellIndex) => {
                let cell = rowElement.insertCell(cellIndex);
                cell.innerHTML = `<i class='bx bxs-music'></i> ${cellData}`;
                
            });
        });
    } else {
        console.error('Data is not in expected format (array of objects)');
    }
}

//Populates Search Table
function populateSearchTable(data) {
    let table = document.getElementById('searchTable');
    table.innerHTML = "";

    let header = table.createTHead();
    let headerRow = header.insertRow(0);
    let headers = ["Song by Artist"];

    headers.forEach((headerText, index) => {
        let cell = headerRow.insertCell(index);
        cell.outerHTML = `<th>${headerText}</th>`;
    });

    // Check if dataArray is an array
    if (Array.isArray(data)) {
        // Iterate over dataArray and populate table rows
        data.forEach((row, index) => {
            let rowElement = table.insertRow(index + 1);
            //Drop listen count and user
            let truncate = Object.values(row).slice(0, 1);
            truncate.forEach((cellData, cellIndex) => {
                let cell = rowElement.insertCell(cellIndex);
                cell.innerHTML = `<i class='bx bxs-music'></i> ${cellData}`;
            });
        });
    } else {
        console.error('Data is not in expected format (array of objects)');
    }
}

//Helper function for calling recommend Song in App.py
async function callRecSong(){
    let url = "http://127.0.0.1:5000/recommend_song"
    let method = 'GET';
    let params = new URLSearchParams();  // Create a URLSearchParams object
    let response = await fetch(url + (method === 'GET' ? '?' + params.toString() : ''), {
        method: method,
        body: method === 'POST' ? params : null,
    });

    let result = await response.json();

    populateRecommendTable(result)
}

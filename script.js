const form = document.getElementById('request-form');
const responseDiv = document.getElementById('response');
const responseDivStatus = document.getElementById('status');
const fileInput = document.getElementById('file');
const removeFileButton = document.getElementById('remove-file');
const headersInput = document.getElementById('headers');

// Clear form fields on page load
window.onload = () => {
    form.reset();
    removeFileButton.disabled = true;
};

// Enable/disable the "Remove File" button based on file input
fileInput.addEventListener('change', () => {
    removeFileButton.disabled = !fileInput.files.length;
});

// Remove the uploaded file
removeFileButton.addEventListener('click', () => {
    fileInput.value = '';
    removeFileButton.disabled = true;
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const file = document.getElementById('file').files[0];
    const method = document.getElementById('method').value;
    const headersString = headersInput.value.trim();

    try {
        let response;
        const requestOptions = {
            method,
            headers: {
                'Origin': 'https://example.com'
            }
        };

        // Parse additional headers
        if (headersString) {
            const headers = headersString.split('\n');
            headers.forEach(header => {
                const [name, value] = header.split(': ');
                if (name && value) {
                    requestOptions.headers[name] = value;
                }
            });
        }

        // Include request body only for non-GET/HEAD methods
        if (method !== 'GET' && method !== 'HEAD' && file) {
            const formData = new FormData();
            formData.append('file', file);
            requestOptions.body = formData;
        }

        response = await fetch(url, requestOptions);
        console.log(response);
        console.log("response.headers =", response.headers);
        const data = await response.text();
        responseDivStatus.textContent=response.status;
        responseDiv.textContent = data;
    } catch (error) {
        // console.log(error)
        responseDiv.textContent = `Error: ${error.message}`;
    }
});
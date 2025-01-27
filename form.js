document.getElementById('imageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData()
    let image = document.getElementById('imageInput').files[0];
    formData.append('image', image);

    fetch('http://127.0.0.1:5000/prediction', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        const contentType = response.headers.get('Content-Type');
        if (contentType.includes('application/json')) {
            return response.json();
        }
        else {
            return response.text();
        }
    })
    .then(data => { 
        console.log(data)

        if (typeof data === 'string') {
            document.getElementById('result').innerText = data
        }
        else {
        if (data.prediction.class_0 >= 0.9) {
            document.getElementById('result').innerText = 'Image very likely does not show stress' 
        }
        else if(data.prediction.class_0 < 0.9 && data.prediction.class_0 >= 0.7) {
            document.getElementById('result').innerText = 'Image likely does not show stress'
        }
        else if(data.prediction.class_1 >= 0.9) {
            document.getElementById('result').innerText = 'Image very likely shows stress'
        }
        else if(data.prediction.class_1 < 0.9 && data.prediction.class_1 >= 0.7) {
            document.getElementById('result').innerText = 'Image likely shows stress'
        }
        else {
            document.getElementById('result').innerText = 'Unable to predict if image shows stress or does not show stress'
        }
    }
    })
    .catch(error => console.error('Error:', error))
});


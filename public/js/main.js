document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value.trim();
    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        const predictionDiv = document.getElementById('predictionResult');
        
        predictionDiv.innerHTML = `
            <p><strong>Input:</strong> ${data.text}</p>
            <p><strong>Prediction:</strong> ${data.prediction}</p>
            <p><strong>Confidence:</strong> ${data.confidence.toFixed(2)}%</p>
        `;
        resultsDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing text');
    }
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create navigation header
    const header = document.createElement('header');
    header.className = 'bg-white shadow-sm mb-8';
    header.innerHTML = `
        <nav class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="index.html" class="text-xl font-bold text-blue-600">BERT Demo</a>
                <div class="hidden md:flex space-x-6">
                    <a href="index.html" class="hover:text-blue-600">Home</a>
                    <a href="about.html" class="hover:text-blue-600">About</a>
                    <a href="contact.html" class="hover:text-blue-600">Contact</a>
                </div>
            </div>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);
});

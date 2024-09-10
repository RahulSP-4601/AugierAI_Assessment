document.addEventListener('DOMContentLoaded', function () {
    const outlierList = document.getElementById('outlier-list');
    const addOutlierButton = document.getElementById('add-outlier');
    const editor = document.getElementById('editor');
    const inputArea = document.getElementById('input-area');
    const currentOutlierDisplay = document.getElementById('current-outlier');
    const sendMessageButton = document.getElementById('send-message');
    const resultArea = document.getElementById('result-area');
    const spinner = document.getElementById('spinner');
    const boldButton = document.getElementById('bold-button');
    const italicButton = document.getElementById('italic-button');
    const strikeButton = document.getElementById('strike-button');
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const textColorInput = document.getElementById('text-color');
    const backgroundColorInput = document.getElementById('background-color');

    let currentOutlier = null;

    function loadData() {
        fetch('/get_outliers')
            .then(response => response.json())
            .then(data => {
                outlierList.innerHTML = '';
                data.outliers.forEach(outlier => {
                    const li = document.createElement('li');
                    const button = document.createElement('button');
                    button.textContent = outlier.name;
                    button.onclick = () => selectOutlier(outlier.name);
                    li.appendChild(button);
                    outlierList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching outliers:', error);
            });
    }

    function selectOutlier(outlierName) {
        currentOutlier = outlierName;
        currentOutlierDisplay.textContent = `Selected Outlier: ${outlierName}`;
        
        fetch('/get_outlier_content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ outlier_name: outlierName })
        })
        .then(response => response.json())
        .then(data => {
            editor.innerHTML = data.content || '';
        })
        .catch(error => {
            console.error('Error fetching outlier content:', error);
        });
    }

    editor.addEventListener('input', function () {
        if (currentOutlier) {
            fetch('/save_outlier_content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ outlier_name: currentOutlier, content: editor.innerHTML })
            })
            .catch(error => {
                console.error('Error saving outlier content:', error);
            });
        }
    });

    addOutlierButton.addEventListener('click', function () {
        const newOutlier = prompt("Enter new outlier:");
        if (newOutlier) {
            fetch('/add_outlier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ outlier: newOutlier })
            })
            .then(response => response.json())
            .then(data => {
                loadData();
                editor.innerHTML = '';
                currentOutlierDisplay.textContent = '';
            })
            .catch(error => {
                console.error('Error adding outlier:', error);
            });
        }
    });

    sendMessageButton.addEventListener('click', function () {
        const inputText = inputArea.textContent.trim();

        if (inputText === '') {
            alert('Please enter a message.');
            return;
        }

        spinner.style.display = 'block';

        fetch('/interact_llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: inputText })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const responseItem = document.createElement('div');
            responseItem.textContent = `Response: ${data.response}`;
            resultArea.appendChild(responseItem);
            inputArea.textContent = '';
        })
        .catch(error => {
            console.error('Error interacting with LLM:', error);
            resultArea.textContent = 'Error interacting with LLM.';
        })
        .finally(() => {
            spinner.style.display = 'none';
        });
    });

    function format(command, value = null) {
        document.execCommand(command, false, value);
        editor.focus();
    }

    boldButton.addEventListener('click', () => format('bold'));
    italicButton.addEventListener('click', () => format('italic'));
    strikeButton.addEventListener('click', () => format('strikeThrough'));

    fontFamilySelect.addEventListener('change', () => {
        format('fontName', fontFamilySelect.value);
    });

    fontSizeSelect.addEventListener('change', () => {
        const sizeMapping = {
            small: '2',
            medium: '3',
            large: '5'
        };
        format('fontSize', sizeMapping[fontSizeSelect.value] || '3');
    });

    textColorInput.addEventListener('input', () => {
        format('foreColor', textColorInput.value);
    });

    backgroundColorInput.addEventListener('input', () => {
        format('backColor', backgroundColorInput.value);
    });

    loadData();
});

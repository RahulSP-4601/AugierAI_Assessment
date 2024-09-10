from flask import Flask, render_template, request, jsonify
import os
import json
import openai

app = Flask(__name__)

openai.api_key = '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'

OUTLIERS_FILE = 'outliers.json'
EDITOR_CONTENT_FILE = 'editor_content.json'
LLM_RESPONSES_FILE = 'llm_responses.json'

def load_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return json.load(file)
    return []

def save_data(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

# Initialize with data
outliers = load_data(OUTLIERS_FILE)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_outliers', methods=['GET'])
def get_outliers():
    return jsonify({'outliers': outliers})

@app.route('/add_outlier', methods=['POST'])
def add_outlier():
    data = request.get_json()
    new_outlier = data.get('outlier')
    if new_outlier:
        outliers.append({'name': new_outlier, 'content': ''})
        save_data(OUTLIERS_FILE, outliers)
    return jsonify({'outliers': outliers})

@app.route('/get_outlier_content', methods=['POST'])
def get_outlier_content():
    outlier_name = request.json.get('outlier_name')
    outlier = next((o for o in outliers if o['name'] == outlier_name), None)
    return jsonify({'content': outlier['content'] if outlier else ''})

@app.route('/save_outlier_content', methods=['POST'])
def save_outlier_content():
    outlier_name = request.json.get('outlier_name')
    content = request.json.get('content', "")
    
    for outlier in outliers:
        if outlier['name'] == outlier_name:
            outlier['content'] = content
            break
    
    save_data(OUTLIERS_FILE, outliers)
    return jsonify({"status": "success"})

@app.route('/interact_llm', methods=['POST'])
def interact_llm():
    input_text = request.json.get('text')
    print("Received input text:", input_text)

    try:
        prompt = f"Compose a professional email to my sister informing her that I will be visiting home in 5 days. Message: {input_text}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that helps to write professional emails."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
            temperature=0.7
        )
        
        generated_text = response['choices'][0]['message']['content'].strip()
        print("Generated response:", generated_text)

        generated_text = ' '.join(generated_text.split())  # Remove excessive whitespace

        llm_responses = load_data(LLM_RESPONSES_FILE)
        llm_responses.append(generated_text)
        save_data(LLM_RESPONSES_FILE, llm_responses)
    
    except Exception as e:
        generated_text = f"Error: {str(e)}"
    
    return jsonify(response=generated_text)

@app.route('/save_editor_content', methods=['POST'])
def save_editor_content():
    content = request.json.get('content', "")
    save_data(EDITOR_CONTENT_FILE, {"content": content})
    return jsonify({"status": "success"})

@app.route('/get_editor_content', methods=['GET'])
def get_editor_content():
    content = load_data(EDITOR_CONTENT_FILE)
    return jsonify({"content": content.get('content', "")})

if __name__ == '__main__':
    app.run(debug=True)

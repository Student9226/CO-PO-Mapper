from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from boltiotai import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

openai.api_key = os.environ['OPENAI_API_KEY']

nltk.download('punkt')
nltk.download('stopwords')

def map_outcomes(program_outcomes, course_outcomes):
    stop_words = set(stopwords.words('english'))

    def calculate_similarity(po, co):
        po_tokens = word_tokenize(po.lower())
        co_tokens = word_tokenize(co.lower())

        po_filtered = [w for w in po_tokens if not w in stop_words]
        co_filtered = [w for w in co_tokens if not w in stop_words]

        common_words = set(po_filtered).intersection(set(co_filtered))
        return len(common_words)

    mapping_matrix = []
    for po in program_outcomes:
        row = []
        for co in course_outcomes:
            similarity = calculate_similarity(po, co)
            row.append(min(similarity, 3)) 
        mapping_matrix.append(row)
    
    return mapping_matrix

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json  
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided'}), 400

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
            "role": "system",
            "content": "You are a helpful assistant for my CO-PO Mapper website. Answer and guide user's queries in very concise and short reponse; giving only as much response as needed. You can use the following data about my website to satisfy user's doubts: The sidebar that can be opned by the hamburger icon on the top-right contains navigation buttons to Home, Contact, About and Login pages. The website is currently in its newly developed stage and more updates are on the way. User's must input accurate and complete data in the table to receive accurate CO-PO mapping. The dark-mode button on the top-left changes the website's theme. Frequently asked questions can be found on the About page which also contains more information about the website and its functionality. Any suggestions can be sent on the Contact page."
        }, {
            "role": "user",
            "content": question
        }]
    )
    output = response['choices'][0]['message']['content']
    return jsonify({'answer': output})

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Page</title>
    </head>
    <body>
        <h1 style="text-align:center">You are viewing the Flask app serving as NLP backend to my CO-PO Mapper Website!</h1>
        <p style="text-align:center">To view the website this Flask app is intended for, go to <a href="http://www.copomapper.surge.sh" target="_blank">CO PO Mapper</a>.</p>
        <p style="text-align:center">Feel free to explore!</p>
    </body>
    </html>
    '''

@app.route('/map_outcomes', methods=['POST'])
def map_outcomes_route():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    program_outcomes = data.get('program_outcomes', [])
    course_outcomes = data.get('course_outcomes', [])
    
    if not program_outcomes or not course_outcomes:
        return jsonify({'error': 'Missing program or course outcomes'}), 400
    
    mapping_matrix = map_outcomes(program_outcomes, course_outcomes)
    
    return jsonify({'mapping': mapping_matrix})

if __name__ == '__main__':
    app.run(debug=True)

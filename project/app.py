from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

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
            row.append(min(similarity, 3))  # Cap similarity at 3
        mapping_matrix.append(row)
    
    return mapping_matrix

@app.route('/')
def hello_world():
    return 'Hello, World!'

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

from flask import Flask, jsonify, request
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk import download
import json

# Download NLTK data
download('punkt')
download('stopwords')

app = Flask(__name__)

# Sample data (replace with actual program and course outcomes)
program_outcomes = {
    'BSc CS': ['Design computer programs', 'Understand networks', 'Apply cloud computing'],
    'BSc IT': ['Analyze data', 'Develop software', 'Manage security systems']
}

course_outcomes = {
    'Introduction to Programming': ['Write code', 'Understand programming logic', 'Work with data structures'],
    'Data Science Fundamentals': ['Analyze data', 'Work with machine learning models', 'Understand statistics']
}

# Function to clean and tokenize text
def preprocess(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text.lower())
    return [token for token in tokens if token.isalpha() and token not in stop_words]

# Function to compute keyword overlap
def compute_similarity(prog_outcome, course_outcome):
    prog_tokens = preprocess(prog_outcome)
    course_tokens = preprocess(course_outcome)
    common_tokens = set(prog_tokens) & set(course_tokens)
    return len(common_tokens) / (len(prog_tokens) + len(course_tokens) - len(common_tokens))

@app.route('/map-outcomes', methods=['POST'])
def map_outcomes():
    data = request.json
    selected_program = data.get('program', '')
    selected_course = data.get('course', '')
    
    # Get program and course outcomes
    prog_outcomes = program_outcomes.get(selected_program, [])
    course_outcomes_list = course_outcomes.get(selected_course, [])
    
    # Map the course outcomes to program outcomes using simple keyword matching
    mapping = []
    
    for co in course_outcomes_list:
        co_mapping = {'course_outcome': co, 'similarities': []}
        for po in prog_outcomes:
            similarity = compute_similarity(po, co)
            co_mapping['similarities'].append({'program_outcome': po, 'similarity': round(similarity, 2)})
        mapping.append(co_mapping)
    
    return jsonify(mapping)

if __name__ == '__main__':
    app.run(debug=True)

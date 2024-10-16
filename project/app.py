""" 
This Flask application serves as the backend for the CO-PO mapping system.
It allows adding and retrieving course and program outcomes, mapping them using NLP, 
and fetching CO-PO mapping data from a MongoDB database. 
"""
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk import download
from flask_cors import CORS
from pymongo import MongoClient
try:
    download('punkt')
    download('stopwords')
except FileNotFoundError as e:
    print("Error loading NLTK resources")
load_dotenv()

app = Flask(__name__)
CORS(app)
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client['co_po_mapping']
course_collection = db['courses']
program_collection = db['programs']
co_po_matrix_file = db['mappings']

def preprocess(text):
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text.lower())
    return [token for token in tokens if token.isalpha() and token not in stop_words]

# Compute similarity between program outcomes and course outcomes
def compute_similarity(prog_outcome, course_outcome):
    print(f"Program Outcomes: {prog_outcome}")
    if not prog_outcome:
        return jsonify({'error': f'No program outcomes found for {prog_outcome}'}), 400
    if not course_outcome:
        return jsonify({'error': f'No course outcomes found for {course_outcome}'}), 400
    prog_tokens = preprocess(prog_outcome)
    course_tokens = preprocess(course_outcome)
    common_tokens = set(prog_tokens) & set(course_tokens)
    print(f"Program Tokens: {prog_tokens}")
    print(f"Course Tokens: {course_tokens}")
    return len(common_tokens) / (len(prog_tokens) + len(course_tokens) - len(common_tokens))

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CO-PO Mapper Management</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
            }
            h1 {
                margin-top: 20px;
            }
            form {
                margin: 20px auto;
                width: 50%;
                text-align: left;
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 5px;
            }
            label {
                display: block;
                margin-bottom: 8px;
            }
            input, textarea {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            button {
                background-color: #28a745;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #218838;
            }
        </style>
    </head>
    <body>
        <h1>CO-PO Mapper Management</h1>
        <h1 style="text-align:center">You are viewing the Flask app serving as NLP backend to my CO-PO Mapper Website!</h1>
        <p style="text-align:center">To view the website this Flask app is intended for, go to <a href="http://www.copomapper.surge.sh" target="_blank">CO PO Mapper</a>.</p>
        <h2>Add Course Outcomes</h2>
        <form action="/add_course" method="post">
            <label for="course">Course Name:</label>
            <input type="text" id="course" name="course" required>
            
            <label for="outcomes">Course Outcomes (comma-separated):</label>
            <textarea id="outcomes" name="outcomes" required></textarea>

            <button type="submit">Add Course</button>
        </form>

        <h2>Add Program Outcomes</h2>
        <form action="/add_program" method="post">
            <label for="program">Program Name:</label>
            <input type="text" id="program" name="program" required>
            
            <label for="outcomes">Program Outcomes (comma-separated):</label>
            <textarea id="outcomes" name="outcomes" required></textarea>

            <button type="submit">Add Program</button>
        </form>

        <h2>View Data</h2>
        <button onclick="window.location.href='/get_all_courses'">View All Courses</button>
        <button onclick="window.location.href='/get_all_programs'">View All Programs</button>

    </body>
    </html>
    '''

@app.route('/map-outcomes', methods=['POST'])
def map_outcomes():
    data = request.json
    selected_program = data.get('program', '')
    course_outcomes_list = data.get('course_outcomes', [])
    print(f"Course Outcomes: {course_outcomes_list}")


    prog_outcomes = program_collection.get(selected_program, {}).get('program_outcomes', [])

    mapping = []
    for co in course_outcomes_list:
        co_mapping = {'course_outcome': co, 'similarities': []}
        for po in prog_outcomes:
            similarity = compute_similarity(po, co)
            print(f"Comparing PO: {po} with CO: {co} -> Similarity: {similarity}")
            co_mapping['similarities'].append({'program_outcome': po, 'similarity': round(similarity, 2)})
        mapping.append(co_mapping)

    return jsonify(mapping)
    
@app.route('/add_course', methods=['POST'])
def add_course():
    course_name = request.form.get('course')
    outcomes = request.form.get('outcomes').split(',')

    if not course_name or not outcomes:
        return jsonify({'error': 'Course name or outcomes missing'}), 400

    course_collection.insert_one({'course': course_name, 'outcomes': [outcome.strip() for outcome in outcomes]})
    return jsonify({'message': 'Course outcomes added successfully'}), 200


@app.route('/add_program', methods=['POST'])
def add_program():
    program_name = request.form.get('program')
    outcomes = request.form.get('outcomes').split(',')

    if not program_name or not outcomes:
        return jsonify({'error': 'Program name or outcomes missing'}), 400

    program_collection.update_one(
    {"program_outcomes": {"$exists": True}}, 
    {"$set": {f"program_outcomes.{program_name}": [outcome.strip() for outcome in outcomes]}}, 
    upsert=True
)


    return jsonify({'message': 'Program outcomes added successfully'}), 200



@app.route('/get_course/<course_name>', methods=['GET'])
def get_course(course_name):
    if request.method == 'OPTIONS':
        return '', 200
    course_data = course_collection.find_one({'name': course_name}, {'_id': 0})

    if course_data:
        for syllabus in course_data['syllabi']:
            for program in syllabus['program']:
                for course in program['courses']:
                    if course['name'] == course_name:
                        return jsonify({
                            'course': course_name,
                            'id': course['id'],
                            'outcomes': course['outcomes']
                        }), 200

    return jsonify({'error': f'Course {course_name} not found'}), 404



@app.route('/get_program/<program_name>', methods=['GET']) 
def get_program(program_name):
    if request.method == 'OPTIONS':
        return '', 200
    program_record = program_collection.find_one({'program_outcomes.' + program_name: {'$exists': True}}, {'_id': 0})

    if program_record:
        return jsonify({'program': program_name, 'outcomes': program_record['program_outcomes'][program_name]}), 200
    return jsonify({'error': f'Program {program_name} not found'}), 404


@app.route('/get_mapping/<program_name>/<course_name>', methods=['GET'])
def get_mapping(program_name, course_name):
    # Query the MongoDB collection for the specific program and course mapping
    mapping = co_po_matrix_file.find_one({program_name: { "$exists": True }})
    
    if mapping and course_name in mapping[program_name]:
        course_mapping = mapping[program_name][course_name]
        return jsonify(course_mapping), 200
    
    return jsonify({'error': 'Mapping not found'}), 404

@app.route('/get_all_courses', methods=['GET'])
def get_all_courses():
    courses = list(course_collection.find({}, {'_id': 0}))
    return jsonify(courses), 200

@app.route('/get_all_programs', methods=['GET'])
def get_all_programs():
    programs = list(program_collection.find({}, {'_id': 0}))

    return jsonify(programs), 200

if __name__ == '__main__':
    app.run(debug=True)

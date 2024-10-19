from flask import Flask, request, jsonify
from boltiotai import openai
from dotenv import load_dotenv
import os
from flask_cors import CORS
from pymongo import MongoClient

load_dotenv()
app = Flask(__name__)
CORS(app)
openai.api_key = os.environ['OPENAI_API_KEY']
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client['co_po_mapping']
course_collection = db['courses'] 
program_collection = db['programs'] 


def format_data_for_ai(data):
    formatted_data = ""
    for row in data:
        formatted_data += f"Course: {row['course']}, Outcome: {row['outcome']}\n"
    return formatted_data

@app.route('/add_course', methods=['POST'])
def add_course():
    """
    Adds course outcomes to MongoDB.
    Expected data format: { "course": "Course Name", "outcomes": [ "CO1", "CO2", "CO3" ] }
    """
    data = request.json
    course_name = data.get('course')
    outcomes = data.get('outcomes')

    if not course_name or not outcomes:
        return jsonify({'error': 'Course name or outcomes missing'}), 400

    course_collection.insert_one({'course': course_name, 'outcomes': outcomes})
    return jsonify({'message': 'Course outcomes added successfully'}), 201

@app.route('/add_program', methods=['POST'])
def add_program():
    """
    Adds program outcomes to MongoDB.
    Expected data format: { "program": "Program Name", "outcomes": [ "PO1", "PO2", "PO3" ] }
    """
    data = request.json
    program_name = data.get('program')
    outcomes = data.get('outcomes')

    if not program_name or not outcomes:
        return jsonify({'error': 'Program name or outcomes missing'}), 400

    program_collection.insert_one({'program': program_name, 'outcomes': outcomes})
    return jsonify({'message': 'Program outcomes added successfully'}), 201

@app.route('/get_course/<course_name>', methods=['GET'])
def get_course(course_name):
    """
    Retrieves course outcomes from MongoDB.
    """
    course = course_collection.find_one({'course': course_name}, {'_id': 0})

    if course:
        return jsonify(course), 200
    return jsonify({'error': 'Course not found'}), 404

@app.route('/get_program/<program_name>', methods=['GET'])
def get_program(program_name):
    """
    Retrieves program outcomes from MongoDB.
    """
    program = program_collection.find_one({'program': program_name}, {'_id': 0})

    if program:
        return jsonify(program), 200
    return jsonify({'error': 'Program not found'}), 404
@app.route('/get_mapping/<program_name>/<course_name>', methods=['GET'])
def get_mapping(program_name, course_name):
    mapping = db.mappings.find_one(
        {program_name: {"$exists": True}},
        {program_name: {course_name: 1, "_id": 0}}
    )

    if mapping:
        return jsonify(mapping), 200
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
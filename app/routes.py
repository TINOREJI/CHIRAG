from flask import Blueprint, render_template, request, jsonify

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/search', methods=['POST'])
def search():
    search_query = request.form['query']
    results = {"message": f"Search query received: {search_query}"}
    return jsonify(results)

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

announcements = [
    {'id': 1, 'type': 'Пропал', 'Категория': 'Электроника', 'Описание': 'Чёрный ноутбук', 'Локация': [55.7557, 37.71174]},
    {'id': 2, 'type': 'Найден', 'Категория': 'Ключи', 'Описание': 'Серебряный брелок', 'Локация': [55.75566, 37.71494]},
]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Server is running'})

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    return jsonify(announcements)

@app.route('/api/announcements/<int:announcement_id>', methods=['GET'])
def get_announcement(announcement_id):
    announcement = next((a for a in announcements if a['id'] == announcement_id), None)
    if announcement:
        return jsonify(announcement)
    return jsonify({'error': 'Announcement not found'}), 404

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    new_id = max(a['id'] for a in announcements) + 1 if announcements else 1
    new_announcement = {
        'id': new_id,
        'type': data.get('type'),
        'Категория': data.get('category'),
        'Описание': data.get('description'),
        'Локация': data.get('location', [])
    }
    announcements.append(new_announcement)
    return jsonify(new_announcement), 201

@app.route('/api/search', methods=['GET'])
def search_announcements():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify(announcements)

    filtered = [a for a in announcements if query in a['Описание'].lower()]
    return jsonify(filtered)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
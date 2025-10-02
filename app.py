from flask import Flask, render_template, request, redirect, url_for
from urllib.parse import quote

app = Flask(__name__, template_folder='templates')

announcements = [
    {'id': 1, 'type': 'Пропал', 'Категория': 'Электроника', 'Описание': 'Чёрный ноутбук', 'Локация': [55.7557, 37.71174]},
    {'id': 2, 'type': 'Найден', 'Категория': 'Ключи', 'Описание': 'Серебряный брелок', 'Локация': [55.75566, 37.71494]},
]

messages = {}

@app.route('/')
def home():
    return render_template('home.html', announcements=announcements)

@app.route('/post', methods=['GET', 'POST'])
def post():
    if request.method == 'POST':
        print(f"Posted: {request.form}")
        return redirect(url_for('home'))
    return render_template('post.html')

@app.route('/search')
def search():
    query = request.args.get('q', '')
    filtered = [a for a in announcements if query.lower() in a['Описание'].lower()]
    return render_template('search.html', announcements=filtered, query=query)

@app.route('/details/<int:id>')
def details(id):
    item = next((a for a in announcements if a['id'] == id), None)
    if not item:
        return "Not found", 404
    return render_template('details.html', item=item)

@app.route('/map')
def map_view():
    return render_template('map.html', announcements=announcements)

@app.route('/chat/<int:id>', methods=['GET', 'POST'])
def chat(id):
    if id not in messages:
        messages[id] = []
    if request.method == 'POST':
        text = request.form['message']
        messages[id].append({'text': text, 'sender': 'Ты'})
        return redirect(url_for('chat', id=id))
    return render_template('chat.html', item_id=id, messages=messages.get(id, []))

@app.route('/profile')
def profile():
    return render_template('profile.html')

if __name__ == '__main__':
    app.run(debug=True)
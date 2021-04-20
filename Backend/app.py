from flask import Flask, request
from db import Db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = Db()


@app.route('/accidents')
def get_accident_by_id():
    return db.get_crashes_for_year(request.args.get('year'))


@app.route('/accidents/exact')
def get_exact_accident():
    return db.get_crash_info(request.args.get('year'), request.args.get('id'))


@app.route('/accidents/all_info')
def get_all_info():
    return db.get_all_info_about_crashes(request.args.get('year'))


@app.route('/concentration')
def get_crashes_by_point():
    return db.get_crashes_by_point(request.args.get('year'), request.args.get('id'))


@app.route('/concentration/all_info')
def get_crashes_info_by_point():
    return db.get_crashes_info_by_point(request.args.get('year'), request.args.get('id'))


@app.route('/points')
def get_points():
    return db.get_points_of_concentration(request.args.get('year'))


@app.route('/login')
def login():
    return db.login(request.args.get('login'), request.args.get('password'))


if __name__ == '__main__':
    app.run()

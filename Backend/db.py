from pymongo import MongoClient
import json
from datetime import datetime
import hashlib
import os


class Db:

    def __init__(self):
        self.client = MongoClient(
            "mongodb+srv://seoful:prpzg6RO5sfTWhrH@crashes.kk22f.mongodb.net/crashes?retryWrites=true&w=majority")

    def get_crashes_for_year(self, year):
        db = self.client['crashes'][str(year)]
        crashes = db.find({})
        crashes = self.reduce_crashes(crashes)
        return json.dumps(crashes)

    def get_all_info_about_crashes(self, year):
        db = self.client['crashes'][str(year)]
        crashes = list(db.find({}))
        for crash in crashes:
            del crash['_id']
            crash['date'] = str(crash['date'])
        return json.dumps(crashes)

    def get_crashes_for_period(self, start: datetime, end: datetime) -> str:
        start_year = start.year
        end_year = end.year
        crashes_arr = []
        for year in (start_year, end_year + 1):
            db = self.client['crashes'][str(year)]
            crashes = db.find({'$and': [{'date': {"$gte": start}},
                                        {'date': {"$lte": end}}]})
            crashes = self.reduce_crashes(crashes)
            crashes_arr += list(crashes)
        return json.dumps(crashes_arr)

    def get_crash_info(self, year, id):
        db = self.client['crashes'][str(year)]
        crash = db.find_one({'ac_id': int(id)})
        del crash['_id']
        crash['date'] = str(crash['date'])
        return json.dumps(crash)

    def get_crashes_by_point(self, year, id):
        db = self.client['points'][str(year)]
        point = db.find_one({'id': int(id)})
        arr = []
        crashes = point['crashes']
        db = self.client['crashes'][str(year)]
        for crash in crashes:
            cr = db.find_one({'ac_id': crash})
            arr.append(self.reduce_crash(cr))
        return json.dumps(arr)

    def get_crashes_info_by_point(self, year, id):
        db = self.client['points'][str(year)]
        point = db.find_one({'id': int(id)})
        arr = []
        crashes = point['crashes']
        db = self.client['crashes'][str(year)]
        for crash in crashes:
            cr = db.find_one({'ac_id': crash})
            del cr['_id']
            cr['date'] = str(cr['date'])
            arr.append(cr)
        return json.dumps(arr)

    def reduce_crashes(self, crashes):
        crashes_arr = []
        for crash in crashes:
            crashes_arr.append(self.reduce_crash(crash))
        return crashes_arr

    def get_points_of_concentration(self, year):
        db = self.client['points'][str(year)]
        points = list(db.find({}))
        for point in points:
            del point['_id']
        return json.dumps(points)

    def reduce_crash(self, crash):
        return {
            'date': str(crash['date']),
            'id': crash['ac_id'],
            'type': str(crash['kind']),
            'lng': crash['lng'],
            'ltd': crash['ltd']
        }

    def login(self, login, password):
        db = self.client['users']['users']
        user = db.find_one({'login': login})
        ret = False
        if user is not None:
            ret = user['password'] == password
        return json.dumps({'access': ret})

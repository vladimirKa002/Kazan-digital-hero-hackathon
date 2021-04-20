from pymongo import MongoClient
from sklearn.cluster import DBSCAN
from mpu import haversine_distance
from math import sin, cos, sqrt, atan2, radians, degrees
from geopy import distance
import pandas as pd
import json
import os

client = MongoClient(
    "mongodb+srv://seoful:prpzg6RO5sfTWhrH@crashes.kk22f.mongodb.net/crashes?retryWrites=true&w=majority")

y = {0: 'Наезд на препятствие', 1: 'Съезд с дороги', 2: 'Наезд на велосипедиста',
     3: 'Отбрасывание предмета(отсоединение колеса)', 4: 'Наезд на гужевой транспорт', 5: 'Иной вид ДТП',
     6: 'Падение пассажира', 7: 'Наезд на стоящее ТС', 8: 'Опрокидывание', 9: 'Наезд на пешехода', 10: 'Столкновение',
     11: 'Наезд на животное'}


def get_midpoint(points):
    x = 0.0
    y = 0.0
    z = 0.0

    for coord in points:
        latitude = radians(coord[0])
        longitude = radians(coord[1])

        y += cos(latitude) * sin(longitude)
        x += cos(latitude) * cos(longitude)
        z += sin(latitude)

    total = len(points)

    x = x / total
    y = y / total
    z = z / total

    central_longitude = atan2(y, x)
    central_square_root = sqrt(x * x + y * y)
    central_latitude = atan2(z, central_square_root)

    mid_point = [
        degrees(central_latitude), degrees(central_longitude)
    ]
    print(mid_point)
    return mid_point


def get_points(location, eps, num, year):
    ids = []
    coords = []
    type = []
    db = client['crashes'][str(year)]

    crashes = db.find({'location': location})
    for crash in crashes:
        ids.append(crash['ac_id'])
        coords.append([crash['lng'], crash['ltd']])
        type.append(crash['kind'])

    dests = [[0 for x in range(len(coords))] for y in range(len(coords))]

    if f"dists_str_{year}_{location}.json" in os.listdir("."):
        dests = json.loads(open(f"dists_str_{year}_{location}.json").read())
    else:
        for i in range(0, len(coords)):  # len(coords)
            if i % 10 == 0:
                print(f"Iteration: {i} out of {len(coords)}")
            for j in range(0, i):
                # d = haversine_distance((coords[i][1], coords[i][0]), (coords[j][1], coords[j][0]))
                # d = dist(radians(coords[i][0]), radians(coords[i][1]), radians(coords[j][0]), radians(coords[j][1]))
                d = distance.distance((coords[i][0], coords[i][1]), (coords[j][0], coords[j][1])).km
                dests[i][j] = d
                dests[j][i] = d

        dests_str = json.dumps(dests)
        open(f"dists_str_{year}_{location}.json", "w").write(dests_str)

    # print(dests)
    model = DBSCAN(eps=eps, min_samples=num, metric='precomputed').fit(dests)

    # print(model.labels_)
    labels = model.labels_
    labels_set = set(labels)
    print(labels_set)

    points_arr = []
    for num in labels_set:

        ids_point = []
        arr = []
        n = 0
        midpoint = []
        kinds = {}
        if num != -1:
            for label in labels:
                if num == label:
                    lng = coords[n][0]
                    ltd = coords[n][1]
                    kind = type[n]
                    if kind not in kinds:
                        kinds[kind] = 0
                    else:
                        kinds[kind] += 1
                    ids_point.append(ids[n])
                    arr.append([lng, ltd])
                n += 1
            midpoint = get_midpoint(arr)
            point = {'lng': midpoint[0],
                     'ltd': midpoint[1],
                     'crashes': ids_point}
            if len(arr) >= 5:
                points_arr.append(point)
                continue
            for kind in kinds:
                if kinds[kind] >= 3:
                    points_arr.append(point)
                    break
    return points_arr


def put_to_db(year, points):
    database = client['points'][str(year)]
    for point in points:
        database.insert_one(point)


csf_file = pd.DataFrame()

pd_doc = pd.DataFrame()

ind = 0
def save_answer(t_t, diam, min, year):
    global pd_doc, ind
    p = get_points(t_t, diam, min, year)
    for point in p:
        ind += 1
        pd_doc = pd_doc.append(pd.DataFrame({"crashes": len(point['crashes'])}, index=[ind]))
    # put_to_db(year, p)


save_answer('outside', 1, 3, 2017)
save_answer('city', 0.2, 3, 2017)
save_answer('outside', 1, 3, 2018)
save_answer('city', 0.2, 3, 2018)
save_answer('outside', 1, 3, 2019)
save_answer('city', 0.2, 3, 2019)

pd_doc.to_csv("keklol2.csv")
import os
import requests
from pyjstat import pyjstat
from flask import Flask, jsonify, request
import pandas as pd
from pandas import DataFrame
from flask_cors import CORS

app = Flask(__name__)
#CORS(app, resources={r"/get_data": {"origins": "http://localhost:3000"}})

CORS(app);


file_path = "data.json"
url = "https://webgate.ec.europa.eu/empl/redisstat/api/dissemination/sdmx/2.1/data/lmp_ind_actru?format=json&compressed=false"

if not os.path.exists(file_path):
    print(f"{file_path} not found. Downloading...")
    try: 
        response = requests.get(url)
        response.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(response.content)
        print("Done!")
    except requests.exceptions.RequestException as e:
        print(f"Error downloading the file: {e}")
        exit(1)

with open(file_path, "r") as f:
    dataset = pyjstat.Dataset.read(f)
    dimensions: dict = dataset['dimension']
    labels: dict = dimensions.get("GEO").get("category").get("label")
    filtered_labels = {k: v for k, v in labels.items() if k not in ['EU27_2020', 'EA19']}


    df: DataFrame = dataset.write(output='dataframe')
    #os.remove(file_path)


@app.route('/get-iso-codes', methods=['GET'])
def get_iso_codes():
    if not filtered_labels:
        return jsonify({"error": "Could not fetch countries"}, 400)
    
    countries_list = [{"iso_code": iso, "country": name} for iso, name in filtered_labels.items()]
    return jsonify(countries_list)

           

@app.route('/get-data', methods=['GET'])
def get_data():
    isoCode = request.args.get('iso_code')
    country = filtered_labels.get(isoCode)
    print(f"Fetching data for {country}, {isoCode}.")

    if not isoCode:
        return jsonify({"error": "Missing 'iso_code' parameter"}), 400
    
    if not country:
        return jsonify({"error": "'Country' not in list"}), 400

    filter = (
        (df['Geopolitical entity (reporting)'] == country) & 
        (df['Sex'] != 'Total') & 
        (df['Age class'] == 'Total') & 
        (df['Registration with employment services'] == 'Registered unemployed') &
        (df['Labour market policy interventions by type of action'] == 'Total LMP measures (categories 2-7)')
    )
    
    filtered_rows = df[filter]
    filtered_rows = filtered_rows[['Sex', 'Time period', 'value']]
    filtered_rows = filtered_rows.sort_values(by=['Time period', 'Sex'], ascending = True)
    filtered_rows['value'] = filtered_rows['value'].astype(object).where(pd.notna(filtered_rows['value']), None)
    df_json = filtered_rows.to_dict(orient='records')

    #print(df_json)

    return jsonify(df_json)

if __name__ == '__main__':
    app.run(debug=True)

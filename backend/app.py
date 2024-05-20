#pip install -U flask

from flask import Flask, send_file, jsonify, make_response, Response, stream_with_context
from flask_cors import CORS
import time
from base64 import b64encode
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import ViT
import sys
from os import path
import multiprocessing as mp
import tempfile
import os
import subprocess




app = Flask(__name__)
CORS(app)



@app.route('/run_test')
def run_test():
    def generate():
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8" 
        process = subprocess.Popen(["python", "ViT.py"], stdout=subprocess.PIPE, text=True, env=env)
        while True:
            chunk = process.stdout.read(256)
            if not chunk:
                break
            yield f"data: {chunk}\n\n"
            print(f"data: {chunk}")

        process.wait()

    return Response(stream_with_context(generate()), mimetype='text/event-stream')





###################################


@app.route("/")
def start_page():
     return make_response('Vision Transformer Model API', 200)

def plot_png(fig):
  output = io.BytesIO()
  FigureCanvas(fig).print_png(output)
  return output.getvalue()



@app.route('/get_image/<name>', methods=['GET'])
def get_image(name):
    filepath = f"data/{name}.png"
    if path.exists(filepath):
        return send_file(filepath, mimetype="image/png")
    else:
        return "File not found", 404


@app.route("/patches", methods=['GET'])
def patches():
    figure, figurepatch, text = ViT.only_patches()
    output, outputpatch = plot_png(figure), plot_png(figurepatch)
    response = {
        "images": [
            b64encode(output).decode('ascii'),
            b64encode(outputpatch).decode('ascii')
        ],
        "text": text
    }
    return jsonify(response)

@app.route("/get_graph_image", methods=['GET'])
def graph_route():
    return send_file("graphs/graph21.png", mimetype="image/png")

@app.route("/graph", methods=['GET'])
def get_graph():
    factory, model, _, _, _, _ = ViT.get_factory_model()
    g, rg, layer_weights = ViT.get_graph(factory, model)
    response = {
        "graph": g,
        "rg": rg,
        "layer_weights": layer_weights
    }
    return jsonify(response)



###################################



if __name__ == "__main__":
  app.run(debug=True)
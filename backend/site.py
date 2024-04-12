#pip install -U flask
from flask import Flask, send_file, jsonify, make_response
from flask_cors import CORS
from base64 import b64encode
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import ViT
import graph

app = Flask(__name__)
CORS(app)

# def main():
#   app.run()

@app.route("/")
def start_page():
     return make_response('Vision Transformer Model API', 200)

def plot_png(fig):
  output = io.BytesIO()
  FigureCanvas(fig).print_png(output)
  return output.getvalue()

@app.route("/training", methods=['GET'])
def training():
    return make_response('Training endpoint.', 200)

@app.route('/get_image/<name>', methods=['GET'])
def get_image(name):
  return send_file("data/"+name + ".png", mimetype="image/png")

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
    graph.gen_pydot_graph()
    return send_file("graph2.png", mimetype="image/png")

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

if __name__ == "__main__":
  app.run(debug=True)
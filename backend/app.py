#pip install -U flask

from flask import Flask, send_file, jsonify, make_response, Response, stream_with_context
from flask_cors import CORS
from base64 import b64encode
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io
import ViT
import graph
from os import path
import multiprocessing as mp
import os
import subprocess




app = Flask(__name__)
CORS(app)


os.environ['PYTHONIOENCODING'] = 'utf-8'


@app.route('/run_test/<datasource>')
def run_test(datasource):
    def generate():
        yield "data: Training process has started...\n\n" 
        with subprocess.Popen(["python", "-u" , "ViT.py", datasource], stdout=subprocess.PIPE, bufsize=1, text=True, encoding='utf-8') as process:
            for line in iter(process.stdout.readline, ''):
                yield f"data: {line}\n\n"
            process.stdout.close()
            return_code = process.wait()
            if return_code:
                raise subprocess.CalledProcessError(return_code, "python ViT.py")
            yield "data: END_OF_STREAM\n\n"

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


@app.route("/patches/<datasource>", methods=['GET'])
def patches(datasource):
    figure, figurepatch, text = ViT.only_patches(datasource=datasource)
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
    return send_file("graphs/graphvit.png", mimetype="image/png")

@app.route('/get_training_images')
def get_training_images():
    files = ['loss_results.png', 'top5_accuracy_results.png']
    response = []
    for file in files:
        filepath = f"{file}"
        if path.exists(filepath):
            with open(filepath, "rb") as image_file:
                encoded_image = b64encode(image_file.read()).decode('ascii')
                response.append(encoded_image)
    return jsonify(response)

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
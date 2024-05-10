#pip install -U flask

from flask import Flask, request, send_file, jsonify, make_response, Response, stream_with_context
from flask_cors import CORS
from threading import Thread
import time
from base64 import b64encode
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import ViT
import sys




app = Flask(__name__)
CORS(app)

@app.route('/run_test')
def run_test():
    def generate():
        output_stream = io.StringIO()  # Initialize a StringIO stream
        old_stdout = sys.stdout
        sys.stdout = output_stream  # Redirect stdout to the StringIO stream

        try:
            ViT.test_vit()  # Assuming this function prints output periodically
            output_stream.seek(0)  # Move to the start of the stream

            while True:
                line = output_stream.readline()
                if not line:
                    break
                yield f"data: {line}\n\n"
                time.sleep(0.1)  # Adjust timing based on your needs

        except Exception as e:
            app.logger.error("Error during streaming: %s", str(e))
            yield f"data: ERROR: {str(e)}\n\n"

        finally:
            sys.stdout = old_stdout  # Restore original stdout

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
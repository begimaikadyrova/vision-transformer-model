#pip install -U flask
from flask import Flask, send_file
from flask_cors import CORS
from base64 import encodebytes
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import ViT

app = Flask(__name__)
CORS(app)

# def main():
#   app.run()

@app.route("/")
def start_page():
    return ("<html>" +
            "<body>" +
            "   <title>Vision Transformer Model</title>" +
            "   <a href='/patches'>Patches</a>" +
            "   <a href='/training'>Train Model</a>" +
            "</body>" +
            "</html>")

def plot_png(fig):
  output = io.BytesIO()
  FigureCanvas(fig).print_png(output)
  return output

@app.route("/training")
def training():
  return ("<html>" +
            "<body>" +
            "   <title>Vision Transformer Model</title>" +
            "   <img src='/get_image/dense_1_bias_0'/>" +
            "   <img src='/get_image/dense_1_kernel_0'/>" +
            "</body>" +
            "</html>")

@app.route('/get_image/<name>', methods=['GET'])
def get_image(name):
  return send_file("data/"+name + ".png", mimetype="image/png")

@app.route("/patches")
def patches():
  figure, figurepatch, text = ViT.only_patches()
  output, outputpatch = plot_png(figure), plot_png(figurepatch)
  return ("<html>" +
          " <body>" +
          "   <title>Vision Transformer Model</title>" +
          " <img src='data:image/png;base64, " + encodebytes(output.getvalue()).decode('ascii') + "'/>" +
          " <img src='data:image/png;base64, " + encodebytes(outputpatch.getvalue()).decode('ascii') + "'/>" +
          '\n'.join(["<p>" + x + "</p>" for x in text]) + 
          " </body>" +
          "</html>")

if __name__ == "__main__":
  app.run(debug=True)
#pip install -U flask
from flask import Flask
from base64 import encodebytes
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io

app = Flask(__name__)

def main():
  app.run()

@app.route("/")
def start_page():
  return ("<html>" +
          " <body>" +
          "   <title>Vision Transformer Model</title>"
          " </body>" +
          " <a href='/patches'>Patches</a>" +
          "</html>")
def plot_png(fig):
  output = io.BytesIO()
  FigureCanvas(fig).print_png(output)
  return output
@app.route("/patches")
def patches():
  import ViT
  figure, figurepatch, text = ViT.only_patches()
  output, outputpatch = plot_png(figure), plot_png(figurepatch)
  return ("<html>" +
          " <body>" +
          "   <title>Vision Transformer Model</title>"
          " </body>" +
          " <img src='data:image/png;base64, " + encodebytes(output.getvalue()).decode('ascii') + "'/>" +
          " <img src='data:image/png;base64, " + encodebytes(outputpatch.getvalue()).decode('ascii') + "'/>" +
          '\n'.join(["<p>" + x + "</p>" for x in text]) + 
          "</html>")

if __name__ == "__main__": main()
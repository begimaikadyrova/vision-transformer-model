#pip install -U tensorflow
#pip install -U keras

#this code is based upon the public Keras example from:
#https://keras.io/examples/vision/image_classification_with_vision_transformer/

import io
import os, tempfile
import keras
from keras import layers
from keras import ops
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt


# def enable_ansi_support():
#     if os.name == 'nt':
#         import ctypes
#         kernel32 = ctypes.windll.kernel32
#         hStdOut = kernel32.GetStdHandle(-11)
#         mode = ctypes.c_ulong()
#         kernel32.GetConsoleMode(hStdOut, ctypes.byref(mode))
#         mode.value |= 4
#         kernel32.SetConsoleMode(hStdOut, mode)

# enable_ansi_support()



os.environ["KERAS_BACKEND"] = "tensorflow"  # @param ["tensorflow", "jax", "torch"]




def mlp(x, hidden_units, dropout_rate):
    for units in hidden_units:
        x = layers.Dense(units, activation=keras.activations.gelu)(x)
        x = layers.Dropout(dropout_rate)(x)
    return x

class Patches(layers.Layer):
    def __init__(self, patch_size):
        super().__init__()
        self.patch_size = patch_size

    def call(self, images):
        input_shape = ops.shape(images)
        batch_size = input_shape[0]
        height = input_shape[1]
        width = input_shape[2]
        channels = input_shape[3]
        num_patches_h = height // self.patch_size
        num_patches_w = width // self.patch_size
        images = tf.cast(images, tf.float32) / 255.0 #images = tf.image.convert_image_dtype(images, dtype=tf.float32, saturate=False)
        patches = keras.ops.image.extract_patches(images, size=self.patch_size)
        patches = ops.reshape(
            patches,
            (
                batch_size,
                num_patches_h * num_patches_w,
                self.patch_size * self.patch_size * channels,
            ),
        )
        return patches

    def get_config(self):
        config = super().get_config()
        config.update({"patch_size": self.patch_size})
        return config

class PatchEncoder(layers.Layer):
    def __init__(self, num_patches, projection_dim):
        super().__init__()
        self.num_patches = num_patches
        self.projection = layers.Dense(units=projection_dim)
        self.position_embedding = layers.Embedding(
            input_dim=num_patches, output_dim=projection_dim
        )

    def call(self, patch):
        positions = ops.expand_dims(
            ops.arange(start=0, stop=self.num_patches, step=1), axis=0
        )
        projected_patches = self.projection(patch)
        encoded = projected_patches + self.position_embedding(positions)
        return encoded

    def get_config(self):
        config = super().get_config()
        config.update({"num_patches": self.num_patches})
        return config
class ViT:
  def __init__(self, num_classes, input_shape, x_train):
    self.num_classes = num_classes
    self.input_shape = input_shape
    self.learning_rate = 0.001
    self.weight_decay = 0.0001
    self.batch_size = 256
    self.num_epochs = 10  # For real training, use num_epochs=100. 10 is a test value
    self.image_size = 72  # We'll resize input images to this size
    self.patch_size = 6  # Size of the patches to be extract from the input images
    self.num_patches = (self.image_size // self.patch_size) ** 2
    self.projection_dim = 64
    self.num_heads = 4
    self.transformer_units = [
        self.projection_dim * 2,
        self.projection_dim,
    ]  # Size of the transformer layers
    self.transformer_layers = 1
    self.mlp_head_units = [
        2048,
        1024,
    ]  # Size of the dense layers of the final classifier

    self.data_augmentation = keras.Sequential(
        [
            layers.Normalization(),
            layers.Resizing(self.image_size, self.image_size),
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(factor=0.02),
            layers.RandomZoom(height_factor=0.2, width_factor=0.2),
        ],
        name="data_augmentation",
    )
    # Compute the mean and the variance of the training data for normalization.
    self.data_augmentation.layers[0].adapt(x_train)
  def create_vit_classifier(self):
      inputs = keras.Input(shape=self.input_shape)
      # Augment data.
      augmented = self.data_augmentation(inputs)
      # Create patches.
      patches = Patches(self.patch_size)(augmented)
      # Encode patches.
      encoded_patches = PatchEncoder(self.num_patches, self.projection_dim)(patches)

      # Create multiple layers of the Transformer block.
      for _ in range(self.transformer_layers):
          # Layer normalization 1.
          x1 = layers.LayerNormalization(epsilon=1e-6)(encoded_patches)
          # Create a multi-head attention layer.
          attention_output = layers.MultiHeadAttention(
              num_heads=self.num_heads, key_dim=self.projection_dim, dropout=0.1
          )(x1, x1)
          # Skip connection 1.
          x2 = layers.Add()([attention_output, encoded_patches])
          # Layer normalization 2.
          x3 = layers.LayerNormalization(epsilon=1e-6)(x2)
          # MLP.
          x3 = mlp(x3, hidden_units=self.transformer_units, dropout_rate=0.1)
          # Skip connection 2.
          encoded_patches = layers.Add()([x3, x2])

      # Create a [batch_size, projection_dim] tensor.
      representation = layers.LayerNormalization(epsilon=1e-6)(encoded_patches)
      representation = layers.Flatten()(representation)
      representation = layers.Dropout(0.5)(representation)
      # Add MLP.
      features = mlp(representation, hidden_units=self.mlp_head_units, dropout_rate=0.5)
      # Classify outputs.
      logits = layers.Dense(self.num_classes)(features)
      # Create the Keras model.
      model = keras.Model(inputs=inputs, outputs=logits)
      return model

def display_patches(x_train, image_size, patch_size):
  from matplotlib.figure import Figure
  fig, axs = plt.subplots(1, 1, figsize=(4, 4))
  fig.suptitle("Original Image")
  image = x_train[np.random.choice(range(x_train.shape[0]))]
  axs.imshow(image.astype("uint8"))
  axs.axis("off")

  resized_image = ops.image.resize(
      ops.convert_to_tensor([image]), size=(image_size, image_size)
  )
  patches = Patches(patch_size)(resized_image)

  n = int(np.sqrt(patches.shape[1]))
  figpatch, axs = plt.subplots(n, n, figsize=(4, 4))
  figpatch.suptitle("Patch Image")
  for i, patch in enumerate(patches[0]):
      ax = axs[i // n, i % n]
      patch_img = ops.reshape(patch * 255.0, (patch_size, patch_size, 3))
      ax.imshow(ops.convert_to_numpy(patch_img).astype("uint8"))
      ax.axis("off")
  return fig, figpatch, [f"Image size: {image_size} X {image_size}",
    f"Patch size: {patch_size} X {patch_size}", 
    f"Patches per image: {patches.shape[1]}", 
    f"Elements per patch: {patches.shape[-1]}"]

def weights_to_images(model, batch):
    for layer in model.layers:
      for weight in layer.trainable_weights:
        x = keras.ops.convert_to_numpy(weight) #(x, y) or (x,) or (x, y, z) but we want (x, y, 3)
        if len(x.shape) == 1: #convert to 2D by making a expanded line
            x = np.stack([x]*64, axis=1)
        elif len(x.shape) == 3: #convert to 2D by making a square
          print(weight.path)
          assert 4 in x.shape
          if x.shape[0] == 4:
            x = np.concatenate([np.concatenate([x[0,:,:], x[1,:,:]], axis=0), np.concatenate([x[2,:,:], x[3,:,:]], axis=0)], axis=1)
          elif x.shape[1] == 4:
            x = np.concatenate([np.concatenate([x[:,0,:], x[:,1,:]], axis=0), np.concatenate([x[:,2,:], x[:,3,:]], axis=0)], axis=1)
        #x = np.stack((x * 256, np.zeros(x.shape), np.zeros(x.shape)), axis=2)
        #rgb = x * (256*3)
        #x = np.stack((np.where(rgb<256, rgb, 0), np.where((rgb>=256) & (rgb<512), rgb-256, 0), np.where(rgb>=512, rgb-512, 0)), axis=2)
        rgb = x * 256 * 256 * 256
        x = np.stack((rgb % 256, (rgb / 256) % 256, (rgb / (256*256)) % 256), axis=2)
        if x.shape[0] >= 1024:
            x = tf.image.resize(tf.convert_to_tensor(x), size=(256, x.shape[1]//(x.shape[0]//256))).numpy()
        tf.keras.utils.save_img(f"data/{weight.path.replace('/', '_')}_{batch}.png", x, file_format='png')
        pass #grayscale: weight * 255.0 #or make this a red, green or blue component
        #convert_weight_to_image(weight)
        ###RGB: weight * 255.0 * 255.0 * 255.0 cast int32 reshape int8 (...,...,3)
    # assert False
            

class WeightsCheckpoint(keras.callbacks.Callback):
    def __init__(self, tempdir):
        self.tempdir = tempdir
    def on_train_batch_end(self, batch, logs=None):
        #keys = list(logs.keys())
        #print("...Training: end of batch {}; got log keys: {}".format(batch, keys))
        #self.model.save_weights(os.path.join(self.tempdir, f"all.{batch}.weights.h5"))
       weights_to_images(self.model, batch)

    def on_test_batch_begin(self, batch, logs=None):
        keys = list(logs.keys())
        print("...Evaluating: start of batch {}; got log keys: {}".format(batch, keys))


def run_experiment(factory, model, x_train, y_train, x_test, y_test):
    optimizer = keras.optimizers.AdamW(
        learning_rate=factory.learning_rate, weight_decay=factory.weight_decay
    )

    model.compile(
        optimizer=optimizer,
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=[
            keras.metrics.SparseCategoricalAccuracy(name="accuracy"),
            keras.metrics.SparseTopKCategoricalAccuracy(5, name="top-5-accuracy"),
        ],        
    )



    tempdir = tempfile.gettempdir()
    checkpoint_filepath = os.path.join(tempdir, "checkpoint.weights.h5")
    checkpoint_callback = keras.callbacks.ModelCheckpoint(
        checkpoint_filepath,
        monitor="val_accuracy",
        save_best_only=True,
        save_weights_only=True,
    )
    print("Saving to: ", tempdir)
    
    print(model.summary())
    #model.load_weights(os.path.join(tempdir, "all.0.weights.h5"))
    
    #the steps_per_epoch and epochs parameters here
    history = model.fit(
        x=x_train,
        y=y_train,
        batch_size=factory.batch_size,
        epochs=3,
        steps_per_epoch=10,
        validation_split=0.1,
        callbacks=[checkpoint_callback, WeightsCheckpoint(tempdir)],
    )

    model.load_weights(checkpoint_filepath)
    _, accuracy, top_5_accuracy = model.evaluate(x_test, y_test)
    print(f"Test accuracy: {round(accuracy * 100, 2)}%")
    print(f"Test top 5 accuracy: {round(top_5_accuracy * 100, 2)}%")

    
    return history



def plot_history(item, history, filename):
    plt.plot(history.history[item], label=item)
    plt.plot(history.history["val_" + item], label="val_" + item)
    plt.xlabel("Epochs")
    plt.ylabel(item)
    plt.title("Train and Validation {} Over Epochs".format(item), fontsize=14)
    plt.legend()
    plt.grid()
    plt.savefig(filename)
    plt.show()
    plt.close()



def only_patches():
  num_classes = 100
  input_shape = (32, 32, 3)
  (x_train, y_train), (x_test, y_test) = keras.datasets.cifar10.load_data()
  #(x_train, y_train), (x_test, y_test) = keras.datasets.cifar100.load_data()
  factory = ViT(num_classes, input_shape, x_train)
  return display_patches(x_train, factory.image_size, factory.patch_size)

def get_graph(factory, model):
    optimizer = keras.optimizers.AdamW(
        learning_rate=factory.learning_rate, weight_decay=factory.weight_decay
    )

    model.compile(
        optimizer=optimizer,
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=[
            keras.metrics.SparseCategoricalAccuracy(name="accuracy"),
            keras.metrics.SparseTopKCategoricalAccuracy(5, name="top-5-accuracy"),
        ],        
    )

    
    print(model.summary())
    #model.load_weights(os.path.join(tempdir, "all.0.weights.h5"))
    g, layer_weights = {}, {}
    for layer in model.layers: #what is the graph relationship of layers?
      if not layer.name in g: g[layer.name] = []
      if not layer.name in layer_weights: layer_weights[layer.name] = []
      print("Layer: ", layer.name)
      for node in layer._inbound_nodes:
        for kt in node.input_tensors:
            keras_history = kt._keras_history
            inbound_layer = keras_history.operation
            g[layer.name].append(inbound_layer.name)
        for weight in layer.trainable_weights:
            layer_weights[layer.name].append(weight.path)
    rg = {}
    for k in g:
       for v in g[k]:
          if not v in rg: rg[v] = []
          rg[v].append(k)

   

    return (g, rg, layer_weights)

def get_factory_model():
    num_classes = 100
    input_shape = (32, 32, 3)
    (x_train, y_train), (x_test, y_test) = keras.datasets.cifar100.load_data()
    print(f"x_train shape: {x_train.shape} - y_train shape: {y_train.shape}")
    print(f"x_test shape: {x_test.shape} - y_test shape: {y_test.shape}")

    factory = ViT(num_classes, input_shape, x_train)
    display_patches(x_train, factory.image_size, factory.patch_size)

    
    model = factory.create_vit_classifier() 
    return (factory, model, x_train, y_train, x_test, y_test)
  
   
    
def test_vit():
    print("\nBuilding model...")
    factory, model, x_train, y_train, x_test, y_test = get_factory_model()
    

    history = run_experiment(factory, model, x_train, y_train, x_test, y_test)
    print(history.history.keys())
    plot_history("loss", history, 'loss_results.png')
    plot_history("top-5-accuracy", history, 'top5_accuracy_results.png')


    
if __name__ == "__main__":
   test_vit()
    


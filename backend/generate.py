from ViT import get_factory_model, run_experiment, plot_history
import sys

def generate_cache():
    print("\nBuilding model...")
    factory, model, x_train, y_train, x_test, y_test = get_factory_model(datasource='cifar100')
    
    history = run_experiment(factory, model, x_train, y_train, x_test, y_test, saveimage=True)
    
    plot_history("loss", history, 'loss_results.png')
    plot_history("top-5-accuracy", history, 'top5_accuracy_results.png')

generate_cache()